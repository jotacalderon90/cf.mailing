'use strict';

const { z } = require('zod');

module.exports = {
  total: z.object({
    to: z.string().trim().optional(),
  }),

  collection: z.object({
    skip: z.coerce.number(),
    sort_field: z.string().trim().toLowerCase().optional(),
    sort_type: z.coerce.number().optional(),
    to: z.string().trim().optional(),
  }),
};
