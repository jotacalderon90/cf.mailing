'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const { smtp } = require('../_repository/_');

module.exports = {
  read: async function (input) {
    try {
      const docSmtp = await smtp.collection({ host: input.host, active: true });
      if (docSmtp.length > 0) {
        return docSmtp[0].config;
      } else {
        return {};
      }
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.servicio);
    }
  },

  update: async function (input) {
    try {
      const docSmtp = await smtp.collection({ host: input.host, active: true });
      let updated;

      if (docSmtp.length == 0) {
        updated = await smtp.create({ host: input.host, config: input.config });
      } else {
        updated = await smtp.update(docSmtp[0].id, { config: input.config });
      }

      logger.info(updated);

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.update + ' ' + constants.error.servicio);
    }
  },
};
