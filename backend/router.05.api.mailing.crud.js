'use strict';

const controlador = require('./lib/05.api.mailing.crud/controller');

module.exports = {
  /**
   * @swagger
   * /api/mailing/{id}:
   *   get:
   *     tags:
   *       - ApiCrud
   *     summary: api para visualizar un correo
   *     description: api para visualizar un correo
   *     x-roles: ['root', 'admin', 'mailing']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/mailing/:id')
  //@method(['get'])
  //@roles(['root', 'admin', 'mailing'])
  read: controlador.read,

  /**
   * @swagger
   * /api/mailing/{id}:
   *   delete:
   *     tags:
   *       - ApiCrud
   *     summary: api para eliminar un correo
   *     description: api para eliminar un correo
   *     x-roles: ['root']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/mailing/:id')
  //@method(['delete'])
  //@roles(['root'])
  delete: controlador.delete,
};
