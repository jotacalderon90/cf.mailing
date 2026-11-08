'use strict';

const fs = require('fs');
const path = require('path');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('../constants');
const mailer = require('../mailer');
const domain = require('../domain');
const templates = require('../templates');

const { mailing, smtp } = require('../_repository/_');

module.exports = {
  fncToSend: async function () {
    try {
      logger.info('Cron fncToSend start');

      const mailing_to_send = await mailing.collection(
        { sended: false },
        { limit: 1, sort: { created: 1 } }
      );

      for (let i = 0; i < mailing_to_send.length; i++) {
        const sended = await mailer.send(mailing_to_send[i].config, mailing_to_send[i]);
        if (sended) {
          await mailing.update(mailing_to_send[i].id, {
            sended: true,
            created: new Date(),
          });
        }
      }

      logger.info('Cron fncToSend finish');
    } catch (error) {
      logger.error(error);
      throw new Error('Error en cron fncToSend ' + constants.error.controlador);
    }
  },
  
  fncToRefreshTemplates: async function () {
    logger.info('Cron fncToRefreshTemplates start');
    try {
      
      const hosts = process.env.NODE_ENV === 'production'
      ? (await smtp.collection()).map((row) => row.host)
      : [domain.getParentDomain(process.env.TEST_HOST)];
      
      const baseDir = path.resolve(process.cwd(), 'frontend/assets/domains');
      let ok = 0, fail = 0;
      
      for (const host of hosts) {
        try {
          const archivos = await templates.collection(host);

          for (const archivo of archivos) {
            try {
              const contenido = await templates.read(host, archivo);
              const destino = path.resolve(baseDir, host, 'mailing/templates', archivo);

              if (!destino.startsWith(baseDir + path.sep)) {
                throw new Error(`Ruta inválida: ${destino}`);
              }

              await fs.promises.mkdir(path.dirname(destino), { recursive: true });
              const tmp = destino + '.tmp';
              await fs.promises.writeFile(tmp, contenido);
              await fs.promises.rename(tmp, destino);

              ok++;
            } catch (error) {
              fail++;
              logger.error(`Error en plantilla ${archivo} (${host}): ${error.message}`);
            }
          }
        } catch (error) {
          logger.error(`Error en plantillas del dominio ${host}: ${error.message}`);
        }
      }

      logger.info(`Cron fncToRefreshTemplates finish: ${ok} ok, ${fail} con error`);
    } catch (error) {
      logger.error(error);
      throw new Error('Error en cron fncToRefreshTemplates ' + constants.error.controlador);
    }
  }
};
