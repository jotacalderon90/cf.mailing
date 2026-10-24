'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.collection = 'Error al obtener lista de plantillas de correo';
_constants.error.rest.metadata = 'Error al obtener metadata de plantilla de correo';
_constants.error.rest.render = 'Error al renderizar plantilla de correo';
_constants.error.rest.bad_template = 'Plantilla no encontrada';

module.exports = _constants;
