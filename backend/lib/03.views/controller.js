'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const domain = require('../domain');
const view = require('../view');

const constants = require('./constants');

module.exports = {
  renderIndex: async function (req, res) {
    try {
      res.render(await view('mailing/01.index/_', req.headers.host), {
        roles: req.user ? req.user.roles : [],
        __hostAccount: domain.getHostAccount(req),
      });
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderIndex + ' ' + constants.error.controlador
      );
    }
  },
  renderForm: async function (req, res) {
    try {
      res.render(await view('mailing/02.form/_', req.headers.host), {
        roles: req.user ? req.user.roles : [],
        __hostAccount: domain.getHostAccount(req),
      });
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderForm + ' ' + constants.error.controlador
      );
    }
  },
  renderConfig: async function (req, res) {
    try {
      res.render(await view('mailing/03.config/_', req.headers.host), {
        roles: req.user ? req.user.roles : [],
        __hostAccount: domain.getHostAccount(req),
      });
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderConfig + ' ' + constants.error.controlador
      );
    }
  },
};
