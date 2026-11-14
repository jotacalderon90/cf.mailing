'use strict';

const crypto = require('crypto');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const request = require('cl.jotacalderon.cf.framework/lib/request');
const redis = require('cl.jotacalderon.cf.framework/lib/redis');

const apiBase = '/api/integration';

const pathConfig = '/archivosprivados/configuraciones/';

const getBaseURL = function(domain) {
  if (process.env.NODE_ENV === 'production' && process.env.FRONT_MULTIDOMAIN === '1') {
    return 'https://archivosprivados.' + domain;
  } else {
    return process.env.HOST_ARCHIVOSPRIVADOS;
  }
}

const getOptions = function(domain) {
  return {
    headers: {
      'user-agent': 'cf.account',
      'origin': 'account.' + domain
    }
  }
}

module.exports = {
  
  getConfig: async function (domain, pathFile) {
    try {
      const cacheKey = crypto.createHash('md5').update('oauth2' + domain + pathFile).digest('hex');

      if (redis.client) {
        const cached = await redis.get(cacheKey);
        if (cached) return cached;
      }
      
      const pathEncoded = Buffer.from(pathConfig + pathFile, 'utf8').toString('base64');

      const serviceContent = await request.get(getBaseURL(domain) + `${apiBase}/get/${pathEncoded}`, getOptions(domain));
      
      if(serviceContent.data.statusCode === 200) {
        
        if (redis.client) {
          redis.set(cacheKey, serviceContent.data.body, ((60*60)*24));//ttl=1seg - 24h
        }

        return serviceContent.data.body;
      }
      
      return null;      
    } catch (error) {
      logger.error(error);
    }
    
    return null;
  }

}