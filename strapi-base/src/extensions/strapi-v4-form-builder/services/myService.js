// @ts-nocheck
"use strict";

module.exports = ({ strapi }) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  },
  getComponent(componentUID) {
    const formBlockComp = strapi.components[componentUID];
    return formBlockComp
      ? {
          attributes: formBlockComp.attributes,
          category: formBlockComp.category,
          ...formBlockComp,
        }
      : null;
  },
  async createformBlockComp() {
    let response = [];
    return null;
  },
});
