'use strict';

const fs = require('fs');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('../constants');
const mailer = require('../mailer');
const domain = require('../domain');
const templates = require('../templates');

const { mailing, smtp } = require('../_repository/_');

module.exports = {
  fncToSend: async function () {
    try {
      logger.info('Cron fncToSend start');

      const mailing_to_send = await mailing.collection(
        { sended: false },
        { limit: 1, sort: { created: 1 } }
      );

      for (let i = 0; i < mailing_to_send.length; i++) {
        const sended = await mailer.send(mailing_to_send[i].config, mailing_to_send[i]);
        if (sended) {
          await mailing.update(mailing_to_send[i].id, {
            sended: true,
            created: new Date(),
          });
        }
      }

      logger.info('Cron fncToSend finish');
    } catch (error) {
      logger.error(error);
      throw new Error('Error en cron fncToSend ' + constants.error.controlador);
    }
  },
  
  fncToRefreshTemplates: async function () {
    try {
      logger.info('Cron fncToRefreshTemplates start');
      
      let smtpConfigs;
      if(process.env.NODE_ENV === 'production') {
        smtpConfigs = (await smtp.collection()).map((row)=>{
          return row.host;
        });
      } else {
        smtpConfigs = [domain.getParentDomain(process.env.TEST_HOST)]
      }
      
      for(let i = 0 ; i < smtpConfigs.length ; i++ ) {
        try {
          
          const templateFiles = await templates.collection(smtpConfigs[i]);
          for ( let x=0; x < templateFiles.length; x++) {
            try {
              const templateContent = await templates.read(smtpConfigs[i], templateFiles[x]);
              
              await fs.promises.writeFile(process.cwd() + '/frontend/assets/domains/' + smtpConfigs[i] + '/mailing/templates/' + templateFiles[x], templateContent);
              logger.info('Plantilla ' + templateFiles[x] + ' para el dominio ' + smtpConfigs[i] + ' actualizada correctamente');
              
            } catch (error) {
              logger.error('Error al refrescar plantilla ' + templateFiles[x] + ' para el dominio ' + smtpConfigs[i]);
            }
          }
          
        } catch (error) {
          logger.error('Error al refrescar plantillas para el dominio ' + smtpConfigs[i]);
        }
      }
      
      logger.info('Cron fncToRefreshTemplates finish');
    } catch (error) {
      logger.error(error);
      throw new Error('Error en cron fncToRefreshTemplates ' + constants.error.controlador);
    }
  }
};
