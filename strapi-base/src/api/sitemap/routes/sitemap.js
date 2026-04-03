'use strict';

/**
 * sitemap router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::sitemap.sitemap');
