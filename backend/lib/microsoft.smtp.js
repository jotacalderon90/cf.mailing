'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

module.exports = {
  getToken: async function (client_id, client_secret, tenant_id) {
    
    const res = await fetch(
      `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: client_id,
          client_secret: client_secret,
          scope: 'https://outlook.office365.com/.default',
          grant_type: 'client_credentials',
        }),
      }
    );

    const data = await res.json();
    
    if (!res.ok || !data.access_token) {
      throw new Error(JSON.stringify(data));
    }
    
    logger.info(data);
    
    return {
      accessToken: data.access_token,
      expires: Date.now() + (data.expires_in * 1000)
    };
  }
}