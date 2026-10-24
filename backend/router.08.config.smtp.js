'use strict';

const controlador = require('./lib/08.config.smtp/controller');

module.exports = {
  /**
   * @swagger
   * /api/config/smtp:
   *   get:
   *     tags:
   *       - ApiAdministracion
   *     summary: api para obtener configuracion SMTP
   *     description: api para obtener configuracion SMTP
   *     x-roles: ['root']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/config/smtp')
  //@method(['get'])
  //@roles(['root'])
  read: controlador.read,

  /**
   * @swagger
   * /api/config/smtp:
   *   put:
   *     tags:
   *       - ApiAdministracion
   *     summary: api para actualizar configuracion SMTP
   *     description: api para actualizar configuracion SMTP
   *     x-roles: ['root']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/config/smtp')
  //@method(['put'])
  //@roles(['root'])
  update: controlador.update,
};
