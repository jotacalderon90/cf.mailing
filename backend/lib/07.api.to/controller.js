'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const service = require('./service');

const domain = require('../domain');

module.exports = {
  correos: async function (req, res) {
    try {
      const respuesta = await service.correos(domain.getParentDomain(req.headers.host));

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.correos + ' ' + constants.error.controlador);
    }
  },
  subscritos: async function (req, res) {
    try {
      const respuesta = await service.subscritos({
        domain: domain.getParentDomain(req.headers.host),
        cookie: req.headers.cookie,
      });
      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(
        req,
        res,
        constants.error.rest.subscritos + ' ' + constants.error.controlador
      );
    }
  },
};
