'use strict';

/**
 * remote-config router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::remote-config.remote-config');
