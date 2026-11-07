'use strict';

/*20261107: 
Para poder separar mailing de servidor donde esté archivosprivados debo gestionar plantillas de manera independiente, 
actualmente en docker-compose ingreso los volúmenes pero eso desaparecerá
esta libreria se conectará a archivosprivados y tendra en local cache una autogestión para el refresco de contenidos
idealmente por 15 minutos
*/

const crypto = require('crypto');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const request = require('cl.jotacalderon.cf.framework/lib/request');
const render = require('cl.jotacalderon.cf.framework/lib/render');
const redis = require('cl.jotacalderon.cf.framework/lib/redis');

const domain = require('./domain');

const ttl = 900;//15min

const getBaseURL = function(host) {
  if (process.env.NODE_ENV === 'production' && process.env.FRONT_MULTIDOMAIN === '1') {
    return 'https://archivosprivados.' + domain.getParentDomain(host);
  } else {
    return process.env.HOST_ARCHIVOSPRIVADOS;
  }
}

module.exports = {
  
  collection: async function (host) {
    
    const cacheKey = crypto.createHash('md5').update(host).digest('hex');
    
    if (redis.client) {
      const cached = await redis.get(cacheKey);
      if (cached) return cached;
    }
    
    const pathTemplates = '/archivosprivados/plantillas-de-correo';
    
    const pathEncoded = Buffer.from(pathTemplates, 'utf8').toString('base64');
    
    const serviceContent = await request.get(getBaseURL(host) + `/api/integration/collection/${pathEncoded}`, {
      headers: {
        'user-agent': 'cf.mailing',
        'origin': 'mailing.' + domain.getParentDomain(host)
      },
    });
    
    if(serviceContent.data.statusCode === 200) {
      const json = JSON.parse(serviceContent.data.body);
      if(json.error) {
        throw new Error(json.error);
      }
      
      if (redis.client) {
        redis.set(cacheKey, json.data, 900);
      }

      return json.data;
    }
    
    throw new Error(serviceContent);
    
  },
  
  read: async function (host, templateName) {
    
    const cacheKey = crypto.createHash('md5').update(host + templateName).digest('hex');
    
    if (redis.client) {
      const cached = await redis.get(cacheKey);
      if (cached) return cached;
    }
    
    const pathTemplate = '/archivosprivados/plantillas-de-correo/' + templateName;
    
    const pathEncoded = Buffer.from(pathTemplate, 'utf8').toString('base64');
    
    const serviceContent = await request.get(getBaseURL(host) + `/api/integration/get/${pathEncoded}`, {
      headers: {
        'user-agent': 'cf.mailing',
        'origin': 'mailing.' + domain.getParentDomain(host)
      },
    });
    
    if(serviceContent.data.statusCode === 200) {
      
      if (redis.client) {
        redis.set(cacheKey, json.body, ttl);
      }

      return serviceContent.data.body;
    }
    
    throw new Error(serviceContent);
  },
  
  render: async function (templateContent, data) {
    return await render.processTemplate(templateContent, data);
  } 
}