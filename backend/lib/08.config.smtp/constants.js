'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.read = 'Error al obtener configuración SMTP';
_constants.error.rest.update = 'Error al actualizar configuración SMTP';

module.exports = _constants;
