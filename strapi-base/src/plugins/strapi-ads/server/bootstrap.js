"use strict";

module.exports = async ({ strapi }) => {
  // Register permission actions.
  const actions = [
    {
      section: "plugins",
      displayName: "Ad modules",
      uid: "ad-management",
      pluginName: "strapi-ads",
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
