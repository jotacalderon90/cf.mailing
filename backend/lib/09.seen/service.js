'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const { mailing, mailing_seen } = require('../_repository/_');

const constants = require('./constants');

module.exports = {
  create: async function (input) {
    try {
      input.hash = input.hash.split('.png')[0];
      if (input.hash.length != 24) {
        logger.error(constants.error.rest.create + ' largo de hash ' + input.hash.length);
        return false;
      }

      const docs = await mailing.collection({ host: input.host, hash: input.hash });
      if (docs.length != 1) {
        logger.error(constants.error.rest.create + ' largo de docs ' + docs.length);
        return false;
      }

      await mailing_seen.create(input);

      await mailing.updateSeen(docs[0].id);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },
  collection: async function (input) {
    try {
      return await mailing_seen.collection(
        {
          host: input.host,
          hash: input.hash,
        },
        {
          sort: {
            created: -1,
          },
        }
      );
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.servicio);
    }
  },
};
