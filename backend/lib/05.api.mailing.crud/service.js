'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const { mailing, mailing_seen } = require('../_repository/_');

module.exports = {
  read: async function (input) {
    try {
      const doc = await mailing.read(input.id);
      if (!doc.host === input.host) {
        throw new Error(constants.error.rest.invalid_host + ' ' + input.host);
      }

      return {
        subject: doc.subject,
        html: doc.html,
      };
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.servicio);
    }
  },

  delete: async function (input) {
    try {
      const doc = await mailing.read(input.id);
      if (!doc.host === input.host) {
        throw new Error(constants.error.rest.invalid_host + ' ' + input.host);
      }

      /*sin await :)*/

      mailing.delete(input.id);

      mailing_seen.deleteByHash({
        host: doc.host,
        hash: doc.hash,
      });

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.delete + ' ' + constants.error.servicio);
    }
  },
};
