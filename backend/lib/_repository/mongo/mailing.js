'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');

const AppError = require('../../error');

const constants = require('../constants');

const mapRow = function (row) {
  row.id = row._id.toString();
  delete row._id;
  return row;
};

const validId = /^[a-f0-9]{24}$/;

const name_collection = 'mailing';

module.exports = {
  total: async function (query, options) {
    try {
      const total = await mongodb.count(name_collection, query, options);

      if (isNaN(total)) {
        throw new Error(total);
      }

      return total;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.total + ' ' + constants.error.repositorio);
    }
  },

  collection: async function (query, options, asCursor) {
    try {
      const collection = await mongodb.find(name_collection, query, options, asCursor);

      if (asCursor) {
        return collection;
      }

      if (!Array.isArray(collection)) {
        throw new Error(collection);
      }

      return collection.map(mapRow);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },

  tags: async function (field, query) {
    try {
      const tags = await mongodb.distinct(name_collection, field, query);

      if (!Array.isArray(tags)) {
        throw new Error(tags);
      }

      return tags;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.tags + ' ' + constants.error.repositorio);
    }
  },

  create: async function (input) {
    try {
      if (input._id) {
        input._id = mongodb.toId(input._id);
      }

      if (!input.host) {
        throw new Error('no host :|');
      }

      const newdoc = {};

      newdoc.config = input.config;
      newdoc.to = input.to;
      newdoc.subject = input.subject;
      newdoc.campaign = input.campaign;
      newdoc.html = input.html;
      newdoc.hash = input.hash;
      newdoc.origin = input.origin; //www.vilumanativa.cl,blog.vilumanativa.cl
      newdoc.host = input.host; //vilumanativa.cl
      newdoc.created = input.created;
      newdoc.created_display = input.created_display;
      newdoc.sended = false;
      
      newdoc.tries = [];
      newdoc.triesCount = 0;

      const created = await mongodb.insertOne(name_collection, newdoc);

      if (!created.acknowledged) {
        throw new Error(created);
      }

      return created.insertedId.toString();
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new AppError(constants.error.duplicate, 409);
      }
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.repositorio);
    }
  },

  read: async function (id) {
    try {
      if (!validId.test(id)) {
        throw new Error('Id inválido');
      }

      const doc = await mongodb.findOne(name_collection, id);

      if (!doc._id) {
        throw new Error(doc);
      }

      return mapRow(doc);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.repositorio);
    }
  },

  update: async function (id, input) {
    try {
      if (!validId.test(id)) {
        throw new Error('Id inválido');
      }

      delete input._id;
      delete input._name;

      const updated = await mongodb.updateOne(name_collection, id, { $set: input });

      if (!updated.acknowledged) {
        logger.error(updated);
        throw new Error(updated);
      }

      return true;
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new AppError(constants.error.duplicate, 409);
      }
      logger.error(error);
      throw new Error(constants.error.rest.update + ' ' + constants.error.repositorio);
    }
  },

  delete: async function (id) {
    try {
      if (!validId.test(id)) {
        throw new Error('Id inválido');
      }

      const deleted = await mongodb.deleteOne(name_collection, id);

      if (!deleted.acknowledged) {
        throw new Error(deleted);
      }

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.delete + ' ' + constants.error.repositorio);
    }
  },

  /**********************/
  /*Metodos para MAILING*/
  /**********************/

  findToTablePaginator: async function (input) {
    try {
      const query = {
        host: input.host,
        ...(input?.to ? { to: input.to } : {})
      };

      let sort = {
        created: -1,
        updated: -1
      };

      if (input.sort_field) {
        sort = {};
        sort[input.sort_field] = input.sort_type;
      }

      const options = {
        projection: {
          to: 1,
          subject: 1,
          campaign: 1,
          created: 1,
          updated: 1,
          origin: 1,
          sended: 1,
          seen: 1,
          hash: 1,
          triesCount: 1,
          tries: 1
        },
        sort: sort,
        limit: constants.paginator,
        skip: input.skip,
      };

      return await this.collection(query, options);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },
  
  updateTries: async function(id, respuestaMailer) {
    try {
      if (!validId.test(id)) {
        throw new Error('Id inválido');
      }

      const updated = await mongodb.updateOne(name_collection, id, { 
        $set: {
          sended: (respuestaMailer.accepted?.length > 0),
          updated: new Date()
        },
        $push: {
          tries: {
            response: respuestaMailer,
            created: new Date(),
            success: (respuestaMailer.accepted?.length > 0)
          }
        },
        $inc: { 
          triesCount: 1 
        }
      });

      if (!updated.acknowledged) {
        logger.error(updated);
        throw new Error(updated);
      }

      return true;
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new AppError(constants.error.duplicate, 409);
      }
      logger.error(error);
      throw new Error(constants.error.rest.update + ' ' + constants.error.repositorio);
    }
  },

  updateSeen: async function (id) {
    try {
      if (!validId.test(id)) {
        throw new Error('Id inválido');
      }

      const updated = await mongodb.updateOne(name_collection, id, { $inc: { seen: 1 } });

      if (!updated.acknowledged) {
        logger.error(updated);
        throw new Error(updated);
      }

      return true;
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new AppError(constants.error.duplicate, 409);
      }
      logger.error(error);
      throw new Error(constants.error.rest.update + ' ' + constants.error.repositorio);
    }
  },
};
