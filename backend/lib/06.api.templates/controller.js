'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

module.exports = {
  collection: async function (req, res) {
    try {
      const respuesta = await service.collection({
        host: req.headers.host,
      });
      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(
        req,
        res,
        constants.error.rest.collection + ' ' + constants.error.controlador
      );
    }
  },

  metadata: async function (req, res) {
    try {
      const parseResult = validator.metadata.safeParse(req.params);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.metadata({
        ...parseResult.data,
        host: req.headers.host,
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(
        req,
        res,
        constants.error.rest.metadata + ' ' + constants.error.controlador
      );
    }
  },

  render: async function (req, res) {
    try {
      const parseResult = validator.render.safeParse({ ...req.body, ...req.params });

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.render({
        ...parseResult.data,
        host: req.headers.host,
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.render + ' ' + constants.error.controlador);
    }
  },
};
