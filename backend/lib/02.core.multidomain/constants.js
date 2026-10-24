'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.create = 'Error al crear mailing';
_constants.error.rest.bad_ip = 'Ip cliente inválida :|';
_constants.error.rest.bad_template = 'Plantilla no encontrada';
_constants.error.bad_content = 'Mal contenido (ni html ni plantilla)';

module.exports = _constants;
