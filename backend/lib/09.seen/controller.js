'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const domain = require('../domain');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

module.exports = {
  create: async function (req, res) {
    try {
      const parseResult = validator.create.safeParse(req.params);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }
      
      //20261113:por llamadas dentro de mailing al crear nuevo y renderizar no existe id
      if(parseResult.data.hash === '.png'){
        res.sendFile(process.cwd() + '/frontend/mailing/px.png');
        return;
      }

      await service.create({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
        headers: req.headers,
        request: {
          originalUrl: req.originalUrl,
          ip: req.ip,
          ips: req.ips,
          cookies: req.cookies,
          signedCookies: req.signedCookies,
          socket: {
            remoteAddress: req.socket.remoteAddress,
            remotePort: req.socket.remotePort,
            localAddress: req.socket.localAddress,
            localPort: req.socket.localPort,
          },
        },
      });

      res.set({
        'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      });

      res.sendFile(process.cwd() + '/frontend/mailing/px.png');
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.create + ' ' + constants.error.controlador);
    }
  },

  collection: async function (req, res) {
    try {
      const parseResult = validator.collection.safeParse(req.params);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.collection({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
      });

      res.json({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(
        req,
        res,
        constants.error.rest.collection + ' ' + constants.error.controlador
      );
    }
  },
};
