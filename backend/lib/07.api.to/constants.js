'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.correos = 'Error al obtener correos únicos';
_constants.error.rest.subscritos = 'Error al obtener subscritos';

module.exports = _constants;
