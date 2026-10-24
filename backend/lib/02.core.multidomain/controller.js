'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const domain = require('../domain');
const localip = require('../localip');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const validIps = process.env.NODE_ENV === 'production' ? process.env.IPS_VALIDAS.split(',') : [];

module.exports = {
  create: async function (req, res) {
    try {
      if (!req.user) {
        if (process.env.NODE_ENV === 'production') {
          if (!localip(req.headers['x-real-ip'])) {
            if (validIps.indexOf(req.headers['x-real-ip']) === -1) {
              throw new Error(constants.error.rest.bad_ip + ' ' + req.headers['x-real-ip']);
            }
          }
        }
      }

      const parseResult = validator.create.safeParse(req.body);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      if (process.env.NODE_ENV === 'development')
        req.headers.origin = req.protocol + '://' + req.headers.host;

      const origin = req.headers.origin.split(req.protocol + '://')[1];

      await service.create({
        ...parseResult.data,
        origin: origin,
        host: domain.getParentDomain(origin),
      });

      response.APISuccess(res);
      return;
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.create + ' ' + constants.error.controlador);
    }
  },
};
