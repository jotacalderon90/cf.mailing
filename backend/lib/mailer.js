'use strict';
const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const nodemailer = require('nodemailer');

class self {
  constructor() {
    this._transporters = new Map();
  }

  _getCacheKey(config) {
    return `${config.host}:${config.port}:${config.user}`;
  }

  _getTransporter(config) {
    const key = this._getCacheKey(config);

    if (this._transporters.has(key)) {
      logger.info(`[mailer] reusing transporter for ${key}`);
      return this._transporters.get(key);
    }

    logger.info(`[mailer] creating transporter for ${key}`);

    const transporter = nodemailer.createTransport({
      pool: true,
      maxConnections: 5,
      socketTimeout: 30000,
      host: config.host,
      port: config.port,
      secure: config.secureconnection,
      requireTLS: config.requireTLS,
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });

    this._transporters.set(key, transporter);
    return transporter;
  }

  async send(config, body) {
    try {
      body.bcc = config.bcc;
      body.from = config.from;

      const transporter = this._getTransporter(config);
      const response = await transporter.sendMail(body);

      logger.info(response);
      return true;
    } catch (error) {
      logger.error(error);
      logger.error(config);
      logger.error(body);
      return false;
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
