'use strict';

const { z } = require('zod');

module.exports = {
  read: z.object({}),

  update: z.object({
    config: z.object({
      host: z.string().min(1, 'Host es obligatorio'),
      secureconnection: z.boolean().default(false),
      port: z.number(),
      user: z.string().min(1, 'Usuario es obligatorio'),
      password: z.string().min(1, 'Contraseña es obligatoria'),
      from: z.string().optional(),
      bcc: z.string().optional(),
      requireTLS: z.boolean().default(false),
    }),
  }),
};
