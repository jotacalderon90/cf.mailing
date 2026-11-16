'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const nodemailer = require('nodemailer');

const archivosprivadosSmtp = require('./archivosprivados.smtp');

const microsoftSmtp = require('./microsoft.smtp');

class self {
  constructor() {
    this._transporters = new Map();
  }

  _getCacheKey(config) {
    return `${config.host}:${config.port}:${config.user}`;
  }

  async _getTransporter(config) {
    const key = this._getCacheKey(config);

    if (this._transporters.has(key)) {
      logger.info(`[mailer] reusing transporter for ${key}`);
      return this._transporters.get(key);
    }
    
    const auth = {};
    
    if (config._type === 'smtp') {
      auth.user = config.user;
      auth.pass = config.password;
    
    } else if(config.type === 'oauth2') {
      const smtpOauth = await archivosprivadosSmtp.getConfig(config._domain, config._file);
      if(smtpOauth === null) {
        throw new Error('smtpOauth es null, revisar dominio ' + config._domain + ' archivo ' + config._file);
      }
      
      auth.type = 'OAuth2';
      auth.user = config.user;
      auth.provisionCallback = (user, renew, callback) => {
        
        console.log('[OAuth2] provisionCallback INVOCADO', {
          user,
          renew
        });
        
        if (config._file !== 'microsoft-smtp.json') {
          return callback(new Error('config._file no soportado: ' + config._file));
        }
          
        microsoftSmtp
          .getToken(smtpOauth.client_id, smtpOauth.client_secret, smtpOauth.tenant_id)
          //.then(token => callback(null, token.accessToken, token.expires))
          //.catch(err => callback(err));
          .then(token => {
            console.log('[OAuth2] Token obtenido:', {
              isString: typeof token === 'string',
              length: token?.length
            });

            callback(null, token);
          })
          .catch(err => {
            console.error('[OAuth2] Error:', err.message);
            callback(err);
          });
      };
    }

    logger.info(`[mailer] creating transporter for ${key}`);

    const transporter = nodemailer.createTransport({
      pool: false,
      maxConnections: 1,
      socketTimeout: 30000,
      host: config.host,
      port: config.port,
      secure: config.secureconnection,
      requireTLS: config.requireTLS,
      auth: auth,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
      logger: true,   // agregar aquí
      debug: true,    // agregar aquí
    });
    
    await transporter.verify();
    logger.info('transporter OK!');

    this._transporters.set(key, transporter);
    return transporter;
  }
  
  async send(config, body) {
    try {
      body.bcc = config.bcc;
      body.from = config.from;
      
      const transporter = await this._getTransporter(config);
      
      const response = await transporter.sendMail(body);
      logger.info(response);
      
      return response;

    } catch (error) {
      logger.error(error);
      logger.error(config);
      logger.error(body);
      
      return error;
    }
  }

  close() {
    for (const [key, transporter] of this._transporters) {
      logger.info(`[mailer] closing transporter for ${key}`);
      transporter.close();
    }
    this._transporters.clear();
  }
}

module.exports = new self();
