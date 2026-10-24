'use strict';

const controlador = require('./lib/04.api.mailing.base/controller');

module.exports = {
  /**
   * @swagger
   * /api/mailing/total:
   *   get:
   *     tags:
   *       - ApiBase
   *     summary: api para total de una coleccion
   *     description: api para total de una coleccion
   *     x-roles: ['root','admin','mailing']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/mailing/total')
  //@method(['get'])
  //@roles(['root','admin','mailing'])
  total: controlador.total,

  /**
   * @swagger
   * /api/mailing/collection:
   *   get:
   *     tags:
   *       - ApiBase
   *     summary: api para listar una coleccion
   *     description: api para listar una coleccion
   *     x-roles: ['root','admin','mailing']
   *     parameters:
   *       - in: query
   *         name: skip
   *         required: true
   *         schema:
   *           type: string
   *         description: Origen de la request
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/mailing/collection')
  //@method(['get'])
  //@roles(['root','admin','mailing'])
  collection: controlador.collection,
};
