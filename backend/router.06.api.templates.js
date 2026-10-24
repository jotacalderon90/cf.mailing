'use strict';

const controlador = require('./lib/06.api.templates/controller');

module.exports = {
  /**
   * @swagger
   * /api/template/collection:
   *   get:
   *     tags:
   *       - ApiBase
   *     summary: api para obtener plantillas de correo
   *     description: api para obtener plantillas de correo
   *     x-roles: ['root','admin','mailing']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/template/collection')
  //@method(['get'])
  //@roles(['root','admin','mailing'])
  collection: controlador.collection,

  /**
   * @swagger
   * /api/template/metadata/{name}:
   *   get:
   *     tags:
   *       - ApiBase
   *     summary: api para obtener metadata de plantilla
   *     description: api para obtener metadata de plantilla
   *     x-roles: ['root','admin','mailing']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/template/metadata/:name')
  //@method(['get'])
  //@roles(['root','admin','mailing'])
  metadata: controlador.metadata,

  /**
   * @swagger
   * /api/template/render/{name}:
   *   post:
   *     tags:
   *       - ApiBase
   *     summary: api para renderizar plantilla de correo
   *     description: api para renderizar plantilla de correo
   *     x-roles: ['root','admin','mailing']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/template/render/:name')
  //@method(['post'])
  //@roles(['root','admin','mailing'])
  render: controlador.render,
};
