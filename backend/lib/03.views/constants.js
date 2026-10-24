'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.renderIndex = 'Error al renderizar página principal';
_constants.error.rest.renderForm = 'Error al renderizar formulario para nuevo correo';
_constants.error.rest.renderConfig = 'Error al renderizar vista de configuración';

module.exports = _constants;
