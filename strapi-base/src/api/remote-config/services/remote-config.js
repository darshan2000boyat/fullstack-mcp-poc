'use strict';

/**
 * remote-config service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::remote-config.remote-config');
