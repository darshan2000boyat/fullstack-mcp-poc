/**
 * route router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::route.route", {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
