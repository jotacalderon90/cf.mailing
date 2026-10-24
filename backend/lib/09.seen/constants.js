'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.create = 'Error al marcar mailing como visto';
_constants.error.collection = 'Error al obtener información de visualización de mailing';

module.exports = _constants;
