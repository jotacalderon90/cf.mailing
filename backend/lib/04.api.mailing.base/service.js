'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const { mailing } = require('../_repository/_');

module.exports = {
  total: async function (input) {
    try {
      
      const query = {
        host: input.host,
        ...(input?.to ? { to: input.to } : {})
      };
      
      return await mailing.total(query);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.total + ' ' + constants.error.servicio);
    }
  },

  collection: async function (input) {
    try {
      
      return await mailing.findToTablePaginator({
        host: input.host,
        skip: input.skip,
        sort_field: input.sort_field,
        sort_type: input.sort_type,
        to: input.to
      });
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.servicio);
    }
  },
};
