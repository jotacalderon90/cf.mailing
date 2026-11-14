'use strict';

const crypto = require('crypto');
const fs = require('fs');
const { DateTime } = require('luxon');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const render = require('cl.jotacalderon.cf.framework/lib/render');

const constants = require('./constants');

const unsubscribe = require('../unsubscribe');

const { smtp, mailing } = require('../_repository/_');

module.exports = {
  create: async function (input) {
    try {
      //1° - Obtener dato de configuración para el dominio padre
      const docSMTP = await smtp.collection({ host: input.host, active: true });
      if (docSMTP.length == 0) {
        throw new Error(constants.error.rest.bad_host + ' ' + input.host);
      }

      //2° - Configurar nuevo documento de mail
      const newdoc = {};

      newdoc.config = docSMTP[0].config;
      newdoc.config._domain = input.host;//20261113:se agrega domain en config para uso interno en oauth2

      newdoc.to = input.email || input.to;
      input.unsubscribe = unsubscribe.encrypt(newdoc.to);

      newdoc.subject = input.subject;
      newdoc.campaign = input.campaign;

      input.hash = crypto.randomBytes(18).toString('base64url');
      newdoc.hash = input.hash;

      newdoc.host = input.host;
      newdoc.origin = input.origin;

      newdoc.template = input.template;

      newdoc.created = new Date();
      newdoc.created_display = DateTime.now().toFormat('dd/MM/yyyy HH:mm');

      //3° - Obtener plantilla
      if (input.html) {
        newdoc.html = input.html;
      } else if (input.template) {
        const domainPath = `assets/domains/${input.host}/mailing/templates/${input.template}`;

        const exists = await fs.promises
          .access(process.cwd() + '/frontend/' + domainPath)
          .then(() => true)
          .catch(() => false);

        if (!exists) {
          throw new Error(constants.error.rest.bad_template + ' ' + domainPath);
        }

        newdoc.html = await render.process(domainPath, input);
        
      } else {
        throw new Error(constants.error.rest.bad_content);
      }

      //4° - Crear documento mailing y responder (correo se envía siempre por background en CRON)
      await mailing.create(newdoc);

      return true;

      /*
      //4° - Enviar correo
      if(input.async === true) {
        //Envía por background! a futuro todo con async == true?
      } else {
        await mailer.send(newdoc.config, newdoc);
        await mailing.update({html: newdoc.html, sended: true}, newdocId);
      }
      */

      /*
      // Agregar adjuntos si no existen
      if (!body.attachments) {
        body.attachments = [];
      }
      
      // Ejemplo: agregar un archivo
      body.attachments.push({
        filename: 'audit.zip',
        path: './audit.zip'  // ruta al archivo
      });
      */
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },
};
