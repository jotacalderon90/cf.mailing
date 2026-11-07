'use strict';

const cron = require('node-cron');

const controlador = require('./lib/cron/controller');

if (process.env.CRON_CHEDULE_SENDER) {
  cron.schedule(process.env.CRON_CHEDULE_SENDER, controlador.fncToSend);
}

//Cargo plantillas al iniciar
controlador.fncToRefreshTemplates();

if (process.env.CRON_CHEDULE_REFRESH_TEMPLATES) {
  cron.schedule(process.env.CRON_CHEDULE_REFRESH_TEMPLATES, controlador.fncToRefreshTemplates);
}
