'use strict';

const controlador = require('./lib/02.core.multidomain/controller');

module.exports = {
  /**
   * @swagger
   * /api/mailing:
   *   post:
   *     tags:
   *       - Core
   *     summary: Crear nuevo mail
   *     description: Crear nuevo mail
   *     parameters:
   *       - in: header
   *         name: origin
   *         required: true
   *         schema:
   *           type: string
   *         description: Origen de la request
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/mailing')
  //@method(['post'])
  create: controlador.create,

  /**
   * @swagger
   * /api/internal/mailing:
   *   post:
   *     tags:
   *       - Core
   *     summary: Crear nuevo mail desde app interna (recurso logueado)
   *     description: Crear nuevo mail desde app interna (recurso logueado)
   *     x-roles: ['root','admin','mailing']
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/internal/mailing')
  //@method(['post'])
  //@roles(['root','admin','mailing'])
  create2: controlador.create,
};
