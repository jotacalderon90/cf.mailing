'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.read = 'Error al leer un correo';
_constants.error.rest.delete = 'Error al eliminar un correo';
_constants.error.rest.invalid_host = 'Error al eliminar un correo por diferencia de host :s';

module.exports = _constants;
