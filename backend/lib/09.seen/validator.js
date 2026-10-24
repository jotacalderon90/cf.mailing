'use strict';

const { z } = require('zod');

module.exports = {
  create: z.object({
    hash: z.string().endsWith('.png'),
  }),
  collection: z.object({
    hash: z.string(),
  }),
};
