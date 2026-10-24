'use strict';

const { z } = require('zod');

module.exports = {
  create: z
    .object({
      email: z
        .string()
        .trim()
        .toLowerCase()
        .refine(
          (val) =>
            !val ||
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              val
            ),
          { message: 'El formato del email no es válido' }
        ),
      subject: z.string().optional(),
      template: z.string().optional(),
      html: z.string().optional(),
      campaign: z.string().default(''),
    })
    .passthrough(),
};
