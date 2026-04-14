/**
 * remote-config router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::remote-config.remote-config", {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
