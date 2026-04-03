'use strict';

/**
 * remote-config controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::remote-config.remote-config');
