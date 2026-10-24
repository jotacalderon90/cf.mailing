'use strict';

const { z } = require('zod');

module.exports = {
  read: z.object({
    id: z.string().trim(),
  }),

  delete: z.object({
    id: z.string().trim(),
  }),
};
