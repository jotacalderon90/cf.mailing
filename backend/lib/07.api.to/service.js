'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const request = require('cl.jotacalderon.cf.framework/lib/request');

const constants = require('./constants');

const { mailing } = require('../_repository/_');

module.exports = {
  //Correos enviados
  correos: async function (host) {
    try {
      const correos = await mailing.collection({ host: host }, { projection: { to: 1 } });
      return [
        ...new Set(
          correos.map((correo) => {
            return correo.to;
          })
        ),
      ].join(',');
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.correos + ' ' + constants.error.servicio);
    }
  },
  //Usuarios subscritos desde sistema de cuentas
  subscritos: async function (input) {
    try {
      const url =
        process.env.NODE_ENV === 'production' && process.env.FRONT_MULTIDOMAIN === '1'
          ? 'https://account.' + input.domain
          : process.env.HOST_ACCOUNT;

      const hookAccount = await request.get(url + '/api/mailing/subscritos', {
        headers: {
          cookie: input.cookie,
          'user-agent': 'cf.mailing',
        },
      });

      if (hookAccount.error) {
        throw new Error(hookAccount.error);
      }

      const jsonResponse = JSON.parse(hookAccount.data.body);

      if (jsonResponse.error) {
        throw new Error(jsonResponse.error);
      }

      return jsonResponse.data
        .map((row) => {
          return row.email;
        })
        .join(',');
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.subscritos + ' ' + constants.error.servicio);
    }
  },
};
