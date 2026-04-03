'use strict';

/**
 * sitemap service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sitemap.sitemap');
