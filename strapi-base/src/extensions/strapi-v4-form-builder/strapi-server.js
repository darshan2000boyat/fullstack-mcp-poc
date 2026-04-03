"use strict";

const _ = require("lodash");
const overriddenController = require("./controllers");
const overriddenServices = require("./services");

module.exports = (plugin) => {
  _.each(overriddenController, (item, key) => {
    plugin.controllers[key] = item;
  });
  _.each(overriddenServices, (item, key) => {
    plugin.services[key] = item;
  });

  return plugin;
};
