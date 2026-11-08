'use strict';

const fs = require('fs');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const render = require('cl.jotacalderon.cf.framework/lib/render');

const constants = require('./constants');

const directory = process.cwd() + '/frontend/';

const getTemplateFolder = function (host) {
  return 'assets/domains/' + host + '/mailing/templates/';
};

module.exports = {
  collection: async function (input) {
    try {
      const dir = directory + getTemplateFolder(input.host);

      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      const respuesta = entries.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);

      return respuesta;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.servicio);
    }
  },

  metadata: async function (input) {
    try {
      const getMetadata = function (template) {
        const rows = [];
        while (template.indexOf('{{') > -1) {
          const index1 = template.indexOf('{{');
          const tmp = template.substring(index1);
          const index2 = tmp.indexOf('}}');
          const tempTemplate = tmp.substring(2, index2);
          rows.push({
            label: tempTemplate.replace('data:doc.', ''),
            name: tempTemplate,
            type: 'static',
            value: '',
          });
          template = template.split('{{' + tempTemplate + '}}').join('metadata');
        }
        return rows;
      };

      const fileContent = await fs.promises.readFile(
        directory + getTemplateFolder(input.host) + input.name,
        'utf8'
      );

      return getMetadata(fileContent);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.metadata + ' ' + constants.error.servicio);
    }
  },

  render: async function (input) {
    try {
      const domainPath = getTemplateFolder(input.host) + input.name;

      const exists = await fs.promises
        .access(process.cwd() + '/frontend/' + domainPath)
        .then(() => true)
        .catch(() => false);

      if (!exists) {
        throw new Error(constants.error.rest.bad_template + ' ' + domainPath, input);
      }

      return await render.process(domainPath, input);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.render + ' ' + constants.error.servicio);
    }
  },
};
