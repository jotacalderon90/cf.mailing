'use strict';

const controlador = require('./lib/03.views/controller');

module.exports = {
  /**
   * @swagger
   * /:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista principal
   *     description: obtiene vista principal
   *     x-roles: ['root', 'admin','mailing']
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/')
  //@method(['get'])
  //@roles(['root', 'admin','mailing'])
  renderIndex: controlador.renderIndex,

  /**
   * @swagger
   * /form:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: formulario para nuevo correo
   *     description: formulario para nuevo correo
   *     x-roles: ['root', 'admin','mailing']
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/form')
  //@method(['get'])
  //@roles(['root', 'admin','mailing'])
  renderForm: controlador.renderForm,

  /**
   * @swagger
   * /admin/configuration:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: formulario de configuración
   *     description: formulario de configuración
   *     x-roles: ['root']
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/admin/configuration')
  //@method(['get'])
  //@roles(['root'])
  renderConfig: controlador.renderConfig,
};
