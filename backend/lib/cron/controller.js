'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('../constants');
const mailer = require('../mailer');

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
      
      const smtpConfigs = await smtp.collection();
      console.log(smtpConfigs);
      
      logger.info('Cron fncToRefreshTemplates finish');
    } catch (error) {
      logger.error(error);
      throw new Error('Error en cron fncToRefreshTemplates ' + constants.error.controlador);
    }
  }
};
