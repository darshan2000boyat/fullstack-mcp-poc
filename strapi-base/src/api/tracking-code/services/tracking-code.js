'use strict';

/**
 * tracking-code service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tracking-code.tracking-code');
