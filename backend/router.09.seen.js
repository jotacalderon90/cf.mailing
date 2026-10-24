'use strict';

const controlador = require('./lib/09.seen/controller');

module.exports = {
  /**
   * @swagger
   * /seen/{hash}:
   *   get:
   *     tags:
   *       - ApiSeen
   *     summary: api para marcar correo como visto
   *     description: api para marcar correo como visto
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/seen/:hash')
  //@method(['get'])
  create: controlador.create,

  /**
   * @swagger
   * /api/seen/{hash}/collection:
   *   get:
   *     tags:
   *       - ApiSeen
   *     summary: api para ver info de vistos
   *     description: api para ver info de vistos
   *     x-roles: ['root','admin','mailing']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/seen/:hash/collection')
  //@method(['get'])
  //@roles(['root','admin','mailing'])
  collection: controlador.collection,
};
