'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.total = 'Error al obtener total de correos enviados';
_constants.error.rest.collection = 'Error al obtener correos enviados';

module.exports = _constants;
