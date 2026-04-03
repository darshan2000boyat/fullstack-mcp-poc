module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/get-campaigns',
      handler: 'campaign-custom.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/admin-find',
      handler: 'ad.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-ad-types',
      handler: 'ad-type-custom.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-campaigns/:id',
      handler: 'campaign-custom.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-ad-types/:id',
      handler: 'ad-type-custom.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-campaigns/duplicate/:id',
      handler: 'campaign-custom.duplicate',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/duplicate/:id',
      handler: 'ad-type-custom.duplicate',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/get',
      handler: 'ad.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/get/:id',
      handler: 'ad.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/ad/delete/:id',
      handler: 'ad.deleteAd',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/generate-report',
      handler: 'ad.generateAdsReport',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/campaign/generate-report',
      handler: 'campaign.generateCampaignReport',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/ad',
      handler: 'ad.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/ad/:id',
      handler: 'ad.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/campaign/conflict-check',
      handler: 'campaign.conflictChecker',
      config: {
        policies: [],
      },
    },

    {
      method: 'POST',
      path: '/campaign/sync-stats',
      handler: 'campaign.syncStats',
      config: {
        policies: [],
      },
    },

    {
      method: 'GET',
      path: '/campaign/get-sync-stats-status',
      handler: 'campaign.getSyncStatsStatus',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/campaign',
      handler: 'campaign.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/campaign/:type',
      handler: 'campaign.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/campaign/conflict-check',
      handler: 'campaign.conflictChecker',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/campaign/:id/update-status',
      handler: 'campaign.updateStatus',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/ad/:id/update-status',
      handler: 'ad.updateStatus',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/stat/:id',
      handler: 'ad.fetchStat',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/graph',
      handler: 'ad-stat.list',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/campaign/graph',
      handler: 'campaign-stat.list',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/overall/graph',
      handler: 'daily-system-stat.list',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/campaign/stat/:id',
      handler: 'campaign.fetchStat',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/campaign/stat-overall',
      handler: 'campaign.fetchStatOverall',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/campaign/stat-analytics',
      handler: 'campaign.fetchStatAnalytics',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-destination-pages/:ad_destination_model',
      handler: 'ad.getDestinationPage',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-destination-model',
      handler: 'ad.getDestinationModel',
      config: {
        policies: [],
      },
    },
  ],
};
