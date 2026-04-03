'use strict';

const ad = require('./ad');
const adScreen = require('./ad-screen');
const adStat = require('./ad-stat');
const campaignStat = require('./campaign-stat');
const dailySystemStat = require('./daily-system-stat');
const adSpot = require('./ad-spot');
const adType = require('./ad-type');
const campaign = require('./campaign');
const adsConfig = require('./ads-config');

module.exports = {
  ad,
  'ad-screen': adScreen,
  'ad-spot': adSpot,
  'ad-type': adType,
  'ad-stat': adStat,
  'campaign-stat': campaignStat,
  'daily-system-stat': dailySystemStat,
  'ads-config': adsConfig,
  campaign,
};
