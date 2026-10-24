'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const domain = require('../domain');

module.exports = {
  read: async function (req, res) {
    try {
      const respuesta = await service.read({
        host: domain.getParentDomain(req.headers.host),
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.read + ' ' + constants.error.controlador);
    }
  },

  update: async function (req, res) {
    try {
      const parseResult = validator.update.safeParse(req.body);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.update({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.update + ' ' + constants.error.controlador);
    }
  },
};
