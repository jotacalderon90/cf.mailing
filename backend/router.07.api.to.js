'use strict';

const controlador = require('./lib/07.api.to/controller');

module.exports = {
  /**
   * @swagger
   * /api/to/correos:
   *   get:
   *     tags:
   *       - ApiBase
   *     summary: api para obtener lista de correos únicos
   *     description: api para obtener lista de correos únicos
   *     x-roles: ['root','admin','mailing']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/to/correos')
  //@method(['get'])
  //@roles(['root','admin','mailing'])
  correos: controlador.correos,

  /**
   * @swagger
   * /api/to/subscritos:
   *   get:
   *     tags:
   *       - ApiBase
   *     summary: api para obtener lista de correos subscritos
   *     description: api para obtener lista de correos subscritos
   *     x-roles: ['root','admin','mailing']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/to/subscritos')
  //@method(['get'])
  //@roles(['root','admin','mailing'])
  subscritos: controlador.subscritos,
};
