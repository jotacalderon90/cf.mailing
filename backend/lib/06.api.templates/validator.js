'use strict';

const { z } = require('zod');

module.exports = {
  collection: z.object({}),

  metadata: z.object({
    name: z.string(),
  }),

  render: z
    .object({
      name: z.string(),
    })
    .passthrough(),
};
