'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const templates = require('../templates');

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


module.exports = {
  collection: async function (input) {
    try {
      
      return await templates.collection(input.host);
      
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.servicio);
    }
  },

  metadata: async function (input) {
    try {
      
      const templateContent = await templates.read(input.host, input.name);

      return getMetadata(templateContent);
      
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.metadata + ' ' + constants.error.servicio);
    }
  },

  render: async function (input) {
    try {
      
      const templateContent = await templates.read(input.host, input.name);

      return await templates.render(templateContent, input);
      
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.render + ' ' + constants.error.servicio);
    }
  },
};
