'use strict';

/*20261107: 
Para poder separar mailing de servidor donde esté archivosprivados debo gestionar plantillas de manera independiente, 
actualmente en docker-compose ingreso los volúmenes pero eso desaparecerá
esta libreria se conectará a archivosprivados y sera recargada por un cron
*/

const crypto = require('crypto');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const request = require('cl.jotacalderon.cf.framework/lib/request');

const pathTemplates = '/archivosprivados/plantillas-de-correo';
const apiBase = '/api/integration';

const getBaseURL = function(host) {
  if (process.env.NODE_ENV === 'production' && process.env.FRONT_MULTIDOMAIN === '1') {
    return 'https://archivosprivados.' + host;
  } else {
    return process.env.HOST_ARCHIVOSPRIVADOS;
  }
}

const getOptions = function(host) {
  return {
    headers: {
      'user-agent': 'cf.mailing',
      'origin': 'mailing.' + host
    }
  }
}

module.exports = {
  
  collection: async function (host) {
    
    const pathEncoded = Buffer.from(pathTemplates, 'utf8').toString('base64');
    
    const serviceContent = await request.get(getBaseURL(host) + `${apiBase}/collection/${pathEncoded}`, getOptions(host));
    
    if(serviceContent.data.statusCode === 200) {
      const json = JSON.parse(serviceContent.data.body);
      if(json.error) {
        throw new Error(json.error);
      }
      return json.data;
    }
    
    throw new Error(serviceContent);
    
  },
  
  read: async function (host, templateName) {
    
    const pathEncoded = Buffer.from(pathTemplates + '/' + templateName, 'utf8').toString('base64');
    
    const serviceContent = await request.get(getBaseURL(host) + `${apiBase}/get/${pathEncoded}`, getOptions(host));
    
    if(serviceContent.data.statusCode === 200) {
      return serviceContent.data.body;
    }
    
    throw new Error(serviceContent);
  }
}