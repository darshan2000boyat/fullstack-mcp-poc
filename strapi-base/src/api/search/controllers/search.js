"use strict";

/**
 * search controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const currentModel = "api::search.search";
const { errorResponse } = require("../../../../helpers/error");

module.exports = createCoreController(currentModel, ({ strapi }) => ({
  async globalSearch(ctx) {
    try {
      const response = await strapi.service(currentModel).globalSearch(ctx);
      const sanitizedEntity = await this.sanitizeOutput(response, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      await errorResponse(ctx, error);
    }
  },
}));
