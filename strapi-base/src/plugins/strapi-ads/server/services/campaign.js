'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const _ = require('lodash');
const { deepOmit } = require('../utils/common');
const { subMonths, subDays, format } = require('date-fns');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const modelName = 'plugin::strapi-ads.campaign';
const adModel = 'plugin::strapi-ads.ad';
const adStatModel = 'plugin::strapi-ads.ad-stat';
const campaignStatModel = 'plugin::strapi-ads.campaign-stat';
const campaignModel = 'plugin::strapi-ads.campaign';
const { getTempDirectory, capitalizeFirst } = require('../helpers/generate-csv');
const { yup, validateYupSchema } = require('@strapi/utils');

const validateStatusSchema = validateYupSchema(yup.object({
  campaign_status: yup.string().oneOf(['inactive', 'archived']).required(),
}));

module.exports = createCoreService('plugin::strapi-ads.campaign', ({ strapi }) => ({
  async duplicate(ctx) {
    const { id } = ctx.params;
    const originalCampaign = await strapi.entityService.findOne('plugin::strapi-ads.campaign', id, {
      populate: {
        ads: {
          populate: '*',
        }
      },
    });
    if (!originalCampaign) {
      ctx.throw(404, 'Campaign not found');
    }
    // @ts-ignore
    let { ads, ...campaignData } = originalCampaign;
    campaignData = _.omit(campaignData, ['id', 'createdAt', 'updatedAt', 'publishedAt','createdBy', 'updatedBy',  'total_impressions', 'total_clicks', 'ctr']);
    campaignData.campaign_name = `${campaignData.campaign_name} (Copy)-${originalCampaign?.id + 1}`;
    campaignData.campaign_id = await strapi
      .service('plugin::content-manager.uid')
      .generateUIDField({
        contentTypeUID: 'plugin::strapi-ads.campaign',
        field: 'campaign_id',
        data: {
          campaign_name: campaignData.campaign_name,
        },
      });
    const duplicatedCampaign = await strapi.entityService.create('plugin::strapi-ads.campaign', {
      data: {
        ...campaignData,
        campaign_name: campaignData.campaign_name,
        campaign_status: 'draft',
        publishedAt: new Date(),
      },
    });
    // @ts-ignore
    if (ads?.length) {
      // @ts-ignore
      ads = ads?.map((ad) =>
          _.omit(ad, ['id', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'campaign', 'total_impressions', 'total_clicks', 'ctr'])
      );
      // @ts-ignore
      for (const ad of ads) {
        let { ad_image, ...adData } = ad;
        adData.ad_name = `${adData.ad_name} (Copy)-${new Date().getTime()}`;
        adData.ad_id = await strapi.service('plugin::content-manager.uid').generateUIDField({
          contentTypeUID: 'plugin::strapi-ads.ad',
          field: 'ad_id',
          data: {
            ad_name: adData.ad_name,
          },
        });
        await strapi.entityService.create('plugin::strapi-ads.ad', {
          data: {
            ...adData,
            campaign: duplicatedCampaign.id,
            ad_image: ad_image ? ad_image.id : null,
            ad_status: 'draft',
            publishedAt: new Date(),
          },
        });
      }
    }
    return await strapi.entityService.findOne(
      'plugin::strapi-ads.campaign',
      duplicatedCampaign?.id,
      {
        populate: ['ads','ads.ad_image', 'ads.ad_type', 'ads.ad_spot', 'ads.ad_screens', ],
      }
    );
  },

  async addNewCampaign(ctx) {
    const { campaignData, ads } = ctx.request.body;

    // Remove unwanted fields if present
    const cleanCampaignData = deepOmit(campaignData, [
      'id',
      'createdAt',
      'updatedAt',
      'publishedAt',
    ]);

    // Generate unique campaign_id
    cleanCampaignData.campaign_id = await strapi
      .service('plugin::content-manager.uid')
      .generateUIDField({
        contentTypeUID: 'plugin::strapi-ads.campaign',
        field: 'campaign_id',
        data: {
          campaign_name: cleanCampaignData.campaign_name,
        },
      });

    // Create campaign
    const newCampaign = await strapi.entityService.create('plugin::strapi-ads.campaign', {
      data: {
        ...cleanCampaignData,
        published: false,
      },
    });

    // Create ads if provided
    if (ads?.length) {
      for (const ad of ads) {
        let { ad_image, ...adData } = ad;
        adData.ad_id = await strapi.service('plugin::content-manager.uid').generateUIDField({
          contentTypeUID: 'plugin::strapi-ads.ad',
          field: 'ad_id',
          data: {
            ad_name: adData.ad_name,
          },
        });
        await strapi.entityService.create('plugin::strapi-ads.ad', {
          data: {
            ...adData,
            campaign: newCampaign.id,
            ad_image: ad_image ? ad_image.id : null,
            published: false,
          },
        });
      }
    }

    return await strapi.entityService.findOne('plugin::strapi-ads.campaign', newCampaign?.id, {
      populate: ['ads', 'campaign_status', 'ads.ad_status', 'ads.ad_image'],
    });
  },

  async aggregateCampaignStats(date, campaign_id = null) {


    const statDate = date || format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const dayBefore = format(subDays(new Date(statDate), 1), 'yyyy-MM-dd');
    let campaign = null;
    if(campaign_id) {
      campaign = await strapi.entityService.findOne('plugin::strapi-ads.campaign', campaign_id, {
        populate: ['ads']
      });

      if(_.isEmpty(campaign) || _.isEmpty(campaign.ads)) {
        strapi.log.info(
          `[Cron] No ads found for campaign ID ${campaign_id}. Skipping aggregation for ${statDate}.`
        );
        return;
      }
    }

    const limit = 100;
    let offset = 0;
    let hasMore = true;
    const campaignAgg = {};

    do {
      const stats = await strapi.db.query(adStatModel).findMany({
        where: {
          stat_date: statDate,
          ...(campaign?.id && { ad_id: campaign?.ads?.map(ad => ad.id) })
        },
        fields: ['ad_id', 'impressions', 'clicks'],
        limit,
        offset,
      });
      console.log('loop' + offset);

      if (!stats.length) {
        hasMore = false;
        break;
      }

      const adIds = [...new Set(stats.map((s) => s.ad_id))];
      const ads = await strapi.db.query(adModel).findMany({
        where: { id: { $in: adIds } },
        populate: { campaign: { fields: ['id'] } },
        fields: ['id'],
        limit,
      });

      const adToCampaignMap = {};
      for (const ad of ads) {
        if (ad?.campaign?.id) {
          adToCampaignMap[ad.id] = ad.campaign.id;
        }
      }

      for (const stat of stats) {
        const campaignId = adToCampaignMap[stat.ad_id];
        if (!campaignId) continue;

        if (!campaignAgg[campaignId]) {
          campaignAgg[campaignId] = { impressions: 0, clicks: 0 };
        }

        campaignAgg[campaignId].impressions += parseInt(stat.impressions || 0, 10);
        campaignAgg[campaignId].clicks += parseInt(stat.clicks || 0, 10);
      }

      offset += limit;
      hasMore = stats.length === limit;
    } while (hasMore);

    const entries = Object.entries(campaignAgg);

    const previousVersionsArray = [];
    for (const [campaignId, data] of entries) {
      const previousDayStatsArray = await strapi.entityService.findMany(campaignStatModel, {
        filters: { campaign_id: campaignId, stat_date: { $lt: statDate } },
        sort: { stat_date: 'desc' },
        limit: 1,
      });

      const previousDayStats = previousDayStatsArray[0];

      const previousTotalImpressions = previousDayStats?.total_impressions || 0;
      const previousTotalClicks = previousDayStats?.total_clicks || 0;

      const totalImpressions =
        parseInt(previousTotalImpressions, 10) + parseInt(data.impressions, 10);
      const totalClicks = parseInt(previousTotalClicks, 10) + parseInt(data.clicks, 10);

      const existing = await strapi.db.query(campaignStatModel).findOne({
        where: { campaign_id: campaignId, stat_date: statDate },
      });

      if (existing) {
        await strapi.db.query(campaignStatModel).update({
          where: { id: existing.id },
          data: {
            impressions: data.impressions,
            clicks: data.clicks,
            total_impressions: totalImpressions,
            total_clicks: totalClicks,
          },
        });
      } else {
        await strapi.db.query(campaignStatModel).create({
          data: {
            campaign_id: campaignId,
            stat_date: statDate,
            impressions: data.impressions,
            clicks: data.clicks,
            total_impressions: totalImpressions,
            total_clicks: totalClicks,
          },
        });
      }

      await strapi.db.query(campaignModel).update({
        where: { id: campaignId },
        data: {
          total_impressions: totalImpressions,
          total_clicks: totalClicks,
          ctr: totalImpressions > 0 ? Number((totalClicks / totalImpressions * 100).toFixed(2)) : 0,
        },
      });
    }

    strapi.log.info(
      `[Cron] Campaign stats aggregated for ${statDate} — ${entries.length} campaigns`
    );

    return {
      previousVersionsArray
    }
  },

  async generateDailyStats(date) {
    const statDate = date || format(subDays(new Date(), 1), 'yyyy-MM-dd');

    const activeCampaigns = await strapi.entityService.count(modelName, {
      filters: {
        campaign_status: 'active',
        $or: [{ ads: { ad_end_date: null } }, { ads: { ad_end_date: { $gte: statDate } } }],
        ads: {
          ad_status: 'live',
          ad_start_date: { $lte: statDate },
        },
      },
    });

    const activeAds = await strapi.entityService.count(adModel, {
      filters: {
        campaign: { campaign_status: 'active' },
        ad_status: 'live',
        ad_start_date: { $lte: statDate },
        $or: [{ ad_end_date: null }, { ad_end_date: { $gte: statDate } }],
      },
    });

    const campaignStats = await strapi.db.connection
      .select(
        strapi.db.connection.sum('impressions').as('daily_impressions'),
        strapi.db.connection.sum('clicks').as('daily_clicks')
      )
      .from('campaign_stats')
      .where('stat_date', statDate)
      .first();

    const dailyImpressions = parseInt(campaignStats?.daily_impressions || 0, 10);
    const dailyClicks = parseInt(campaignStats?.daily_clicks || 0, 10);

    const dayBefore = format(subDays(new Date(statDate), 1), 'yyyy-MM-dd');
    const previousDayStats = await strapi.db.query('plugin::strapi-ads.daily-system-stat').findOne({
      where: { stat_date: dayBefore },
      fields: ['total_impressions', 'total_clicks'],
    });

    const previousTotalImpressions = previousDayStats?.total_impressions || 0;
    const previousTotalClicks = previousDayStats?.total_clicks || 0;

    const totalImpressions =
        parseInt(previousTotalImpressions, 10) + dailyImpressions;
    const totalClicks = parseInt(previousTotalClicks, 10) + dailyClicks;

    console.log({
      stat_date: statDate,
      active_campaigns: activeCampaigns,
      active_ads: activeAds,
      impressions: dailyImpressions,
      clicks: dailyClicks,
      total_impressions: totalImpressions,
      total_clicks: totalClicks,
    });

    const existing = await strapi.db.query('plugin::strapi-ads.daily-system-stat').findOne({
      where: { stat_date: statDate },
    });

    if (existing) {
      await strapi.db.query('plugin::strapi-ads.daily-system-stat').update({
        where: { id: existing.id },
        data: {
          stat_date: statDate,
          impressions: dailyImpressions,
          clicks: dailyClicks,
          active_campaigns: activeCampaigns,
          active_ads: activeAds,
          total_impressions: totalImpressions,
          total_clicks: totalClicks,
        },
      });
    } else {
      await strapi.db.query('plugin::strapi-ads.daily-system-stat').create({
        data: {
          stat_date: statDate,
          impressions: dailyImpressions,
          clicks: dailyClicks,
          active_campaigns: activeCampaigns,
          active_ads: activeAds,
          total_impressions: totalImpressions,
          total_clicks: totalClicks,
        },
      });
    }

    strapi.log.info(`Daily stats generated for ${statDate}`);
  },

  async fetchStat(ctx) {
    const { id } = ctx.request.params;
    const { filters } = ctx.request.query;
    let { start_date, end_date } = filters || {};
    const knex = strapi.db.connection;

    const today = format(new Date(), 'yyyy-MM-dd');

    const campaign = await strapi.entityService.findOne('plugin::strapi-ads.campaign', id);

    if(!end_date){
      end_date = campaign.max_date;
    }

    if(!start_date){
      start_date = campaign.min_date;
    }
    const totalActiveAds = await strapi.entityService.count(adModel, {
      filters: {
        ad_status: 'live',
        campaign: { id, campaign_status: 'active' },
        ad_start_date: { $lte: today },
        $or: [{ ad_end_date: null }, { ad_end_date: { $gte: today } }],
      },
    });

    let query = knex('campaign_stats')
    .where('campaign_id', id)

    if (start_date && end_date) {
      query = query.where('stat_date', '>=', start_date).andWhere('stat_date', '<=', end_date);
    }

    const currentStats = await query.sum({
      total_impressions: 'impressions',
      total_clicks: 'clicks'
    })
    .max('stat_date as stat_date')
    .first();

    const max_stat_date = currentStats.stat_date;

    let latestDateStat = [];

    if(max_stat_date === end_date){
      latestDateStat=await strapi.db.query(campaignStatModel).findMany({
        where:{campaign_id:id,stat_date:max_stat_date},fields:['stat_date','impressions','clicks'],limit:1,
      });
    }


    const previousStats = {
      total_impressions : currentStats.total_impressions - (latestDateStat[0]?.impressions || 0),
      total_clicks : currentStats.total_clicks - (latestDateStat[0]?.clicks || 0),
      stat_date : format(subDays(new Date(end_date), 1), 'yyyy-MM-dd'),
    };



    const lastWeekDate = format(subDays(new Date(end_date), 7), 'yyyy-MM-dd');

    let lastWeekStat = null, previousWeekStats = null;
    if (new Date(lastWeekDate) >= new Date(start_date)) {
      // lastWeekStat = await knex('campaign_stats')
      // .where('campaign_id', id)
      // .where('stat_date', '>=', start_date)
      // .andWhere('stat_date', '<=', lastWeekDate)
      // .sum({
      //   total_impressions: 'impressions',
      //   total_clicks: 'clicks'
      // })
      // .first();

      const currentWeekStat = await knex('campaign_stats')
      .where('campaign_id', id)
      .where('stat_date', '>', lastWeekDate)
      .andWhere('stat_date', '<=', end_date)
      .sum({
        total_impressions: 'impressions',
        total_clicks: 'clicks'
      })
      .first();

      previousWeekStats = {
        total_impressions : currentStats.total_impressions - (currentWeekStat.total_impressions || 0),
        total_clicks : currentStats.total_clicks - (currentWeekStat.total_clicks || 0),
        lastWeekDate: lastWeekDate,
      }

    }


    // console.log(currentStats, previousStats, lastWeekStat, previousWeekStats);

    const previousDate = previousStats?.stat_date;
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    let timeDifferenceText = previousDate == yesterday ? 'since yesterday' : 'since last day';

    const currentDate = currentStats?.stat_date;
    const lastWeek = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const timeDifferenceTextCtr = lastWeekDate == lastWeek ? 'vs last week' : 'vs prior week';

    const currentTotalImpressions = parseInt(currentStats?.total_impressions || 0, 10);
    const currentTotalClicks = parseInt(currentStats?.total_clicks || 0, 10);

    const previousTotalImpressions = parseInt(previousStats?.total_impressions || 0, 10);
    const previousTotalClicks = parseInt(previousStats?.total_clicks || 0, 10);

    const previousWeekTotalImpressions = parseInt(previousWeekStats?.total_impressions || 0, 10);
    const previousWeekTotalClicks = parseInt(previousWeekStats?.total_clicks || 0, 10);

    // Calculate CTR
    const currentCTR =
      currentTotalImpressions > 0
        ? ((currentTotalClicks / currentTotalImpressions) * 100).toFixed(2)
        : 0;
    const previousWeekCTR =
      previousWeekTotalImpressions > 0
        ? ((previousWeekTotalClicks / previousWeekTotalImpressions) * 100).toFixed(2)
        : 0;

    // Calculate deltas
    let impressionsDelta = previousTotalImpressions > 0 ? currentTotalImpressions - previousTotalImpressions : 0;
    let clicksDelta = previousTotalClicks > 0 ? currentTotalClicks - previousTotalClicks : 0;
    const ctrDelta = previousWeekCTR > 0 ? parseFloat(currentCTR) - parseFloat(previousWeekCTR) : 0;


    if (impressionsDelta === 0 && clicksDelta === 0) {
      impressionsDelta = previousWeekTotalImpressions > 0 ? currentTotalImpressions - previousWeekTotalImpressions : 0;
      clicksDelta = previousWeekTotalClicks > 0 ? currentTotalClicks - previousWeekTotalClicks : 0;
      timeDifferenceText = lastWeekDate == lastWeek ? 'since last week' : 'since prior week';
    }

    return {
      data: {
        stats: [
          {
            label: 'Active Ads',
            type: 'ads',
            total: totalActiveAds,
            delta: 0,
          },
          {
            label: 'Total Impressions',
            type: 'impressions',
            total: currentTotalImpressions,
            delta: impressionsDelta,
            text: timeDifferenceText,
          },
          {
            label: 'Total CLicks',
            type: 'clicks',
            total: currentTotalClicks,
            delta: clicksDelta,
            text: timeDifferenceText,
          },
          {
            label: 'CTR',
            type: 'ctr',
            total: parseFloat(currentCTR),
            delta: parseFloat(ctrDelta.toFixed(2)),
            text: timeDifferenceTextCtr,
          },
        ],
      },
    };
  },

  async fetchStatOverall(ctx) {
    const knex = strapi.db.connection;
    const { filters = {} } = ctx.request.query;
    let { ads, campaign_status, campaign_name, start_date, end_date } = filters || {};
    let { ad_type } = ads || {};

    const today = format(new Date(), 'yyyy-MM-dd');
    end_date = end_date || today;
    // start_date = start_date || format(subDays(new Date(), 365), 'yyyy-MM-dd');
    delete filters.start_date;
    delete filters.end_date;

    const totalCampaigns = await strapi.db.query('plugin::strapi-ads.campaign').count({
      filters: {
        ...filters,
        ...(!filters.campaign_status && { campaign_status: { $ne: 'archived' } }),
        ...(start_date && { max_date: { $gte: start_date } }),
      },
    });

    const lastMonthDate = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
    let campaignsSinceLastMonth = 0;
    if (new Date(lastMonthDate) >= new Date(start_date)){
      campaignsSinceLastMonth=await strapi.entityService.count('plugin::strapi-ads.campaign',{
        filters:{
          ...filters,...(!filters.campaign_status&&{campaign_status:{$ne:'archived'}}),max_date:{$gte:lastMonthDate},
        },
      });
    }

    let totalActiveAds = 0;
    if(_.isEmpty(campaign_status) || ( Array.isArray(campaign_status) && campaign_status.includes('active') )){
      totalActiveAds=await strapi.entityService.count(adModel,{
        filters:{
          ad_status:'live',...ads,
          campaign:{campaign_status:'active', ...(campaign_name ? { campaign_name } : {}),},
          ad_start_date:{$lte:today},
          $or:[{ad_end_date:null},{ad_end_date:{$gte:today}}],
        },
      });
    }

    let query = knex('campaign_stats as cs')
    .innerJoin('campaigns as c', knex.raw('c.id = cs.campaign_id::integer'))

    if(campaign_status){
      query.whereIn('c.campaign_status', campaign_status)
    }
    else{
      query.whereNotIn('c.campaign_status', ['archived'])
    }
    if(campaign_name && campaign_name.$containsi) {
      query.where('c.campaign_name', 'ilike', `%${campaign_name.$containsi}%`)
    }

    if(ad_type){
    query.whereExists(function() {
        this.select(knex.raw('1'))
        .from('ads_campaign_links as acl')
        .innerJoin('ads as a', 'acl.ad_id', 'a.id')
        .innerJoin('ads_ad_type_links as aatl', 'a.id', 'aatl.ad_id')
        .whereRaw('acl.campaign_id = c.id')
        .where('aatl.ad_type_id', ad_type);
      })
    }




    let currentStats = {
      total_impressions: 0,
      total_clicks: 0,
      stat_date: null,
    };

    if(start_date){
      let mainQuery=query.clone();
      if(start_date&&end_date){
        mainQuery.where('cs.stat_date','>=',start_date).andWhere('cs.stat_date','<=',end_date);
      }
      currentStats= await mainQuery.sum({
        total_impressions:'cs.impressions',total_clicks:'cs.clicks'
      })
      .max('cs.stat_date as stat_date')
      .first();
      console.log(mainQuery.toSQL().toNative());
    } else {

      // Else user has requested for all time stats which can be accumulated from accumulated stats on campaigns table
      let allTimequery = knex('campaigns as c')

      if(campaign_status){
        allTimequery.whereIn('c.campaign_status', campaign_status)
      }
      else{
        allTimequery.whereNotIn('c.campaign_status', ['archived'])
      }
      if(campaign_name && campaign_name.$containsi) {
        allTimequery.where('c.campaign_name', 'ilike', `%${campaign_name.$containsi}%`)
      }

      if(ad_type){
        allTimequery.whereExists(function() {
          this.select(knex.raw('1'))
          .from('ads_campaign_links as acl')
          .innerJoin('ads as a', 'acl.ad_id', 'a.id')
          .innerJoin('ads_ad_type_links as aatl', 'a.id', 'aatl.ad_id')
          .whereRaw('acl.campaign_id = c.id')
          .where('aatl.ad_type_id', ad_type);
        })
      }

      currentStats= await allTimequery.sum({
        total_impressions:'c.total_impressions',total_clicks:'c.total_clicks'
      })
      .first();

      currentStats.stat_date=end_date;
    }

    const max_stat_date = currentStats.stat_date;
    let latestDateStat = {}, previousStats = {};

    if(max_stat_date === end_date){
      let lastDayQuery = query.clone();
      lastDayQuery.where('cs.stat_date', '=', end_date);
      latestDateStat= await lastDayQuery.sum({
        total_impressions: 'cs.impressions',
        total_clicks: 'cs.clicks'
      })
      .max('cs.stat_date as stat_date')
      .first();

      previousStats = {
        total_impressions : currentStats.total_impressions - (latestDateStat?.total_impressions || 0),
        total_clicks : currentStats.total_clicks - (latestDateStat?.total_clicks || 0),
        stat_date : format(subDays(new Date(end_date), 1), 'yyyy-MM-dd'),
      };
    }

    const lastWeekDate = format(subDays(new Date(end_date), 7), 'yyyy-MM-dd');

    let lastWeekStat = null, previousWeekStats = null, lastWeekActiveAds =0;
    if (_.isEmpty(start_date) || new Date(lastWeekDate) >= new Date(start_date)){
      let lastWeekQueryz=query.clone();
      let lastWeekQuery=query.clone();

      // lastWeekStat = await lastWeekQueryz
      // .where('stat_date', '>=', start_date)
      // .andWhere('stat_date', '<=', lastWeekDate)
      // .sum({
      //   total_impressions: 'impressions',
      //   total_clicks: 'clicks'
      // })
      // .first();

      const currentWeekStat = await lastWeekQuery
      .where('stat_date', '>', lastWeekDate)
      .andWhere('stat_date', '<=', end_date)
      .sum({
        total_impressions: 'impressions',
        total_clicks: 'clicks'
      })
      .first();

      console.log(currentWeekStat)

      previousWeekStats = {
        total_impressions : currentStats.total_impressions - (currentWeekStat.total_impressions || 0),
        total_clicks : currentStats.total_clicks - (currentWeekStat.total_clicks || 0),
        lastWeekDate: lastWeekDate,
      };

      lastWeekActiveAds=await strapi.entityService.count(adModel,{
        filters:{
          ad_status:['live', 'expired'],...ads,
          campaign:{campaign_status:['active', 'expired'], ...(campaign_name ? { campaign_name } : {}),},
          ad_start_date:{$lte:lastWeekDate},
          $or:[{ad_end_date:null},{ad_end_date:{$gte:lastWeekDate}}],
        },
      });
    }


    // console.log(currentStat, latestDateStat, previousStatsz);
    console.log(lastWeekStat, lastWeekActiveAds);

    const previousDate = previousStats?.stat_date;
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    let timeDifferenceText = previousDate == yesterday ? 'since yesterday' : 'since last day';

    const currentDate = currentStats?.stat_date;
    const lastWeek = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const timeDifferenceTextCtr = lastWeekDate == lastWeek ? 'vs last week' : 'vs prior week';
    const timeDifferenceTextTotalAds =
        lastWeekDate == lastWeek ? 'since last week' : 'since prior week';

    // Calculate current values
    const currentTotalImpressions = parseInt(currentStats?.total_impressions || 0, 10);
    const currentTotalClicks = parseInt(currentStats?.total_clicks || 0, 10);

    // Calculate previous day values
    const previousTotalImpressions = parseInt(previousStats?.total_impressions || 0, 10);
    const previousTotalClicks = parseInt(previousStats?.total_clicks || 0, 10);

    const previousWeekTotalImpressions = parseInt(previousWeekStats?.total_impressions || 0, 10);
    const previousWeekTotalClicks = parseInt(previousWeekStats?.total_clicks || 0, 10);
    const previousWeekActiveAds = parseInt(previousWeekStats?.active_ads || 0, 10);

    // Calculate CTR
    const currentCTR =
      currentTotalImpressions > 0
        ? ((currentTotalClicks / currentTotalImpressions) * 100).toFixed(2)
        : 0;
    const previousWeekCTR =
      previousWeekTotalImpressions > 0
        ? ((previousWeekTotalClicks / previousWeekTotalImpressions) * 100).toFixed(2)
        : 0;

    // Calculate deltas
    let impressionsDelta = previousTotalImpressions > 0 ? currentTotalImpressions - previousTotalImpressions : 0;
    let clicksDelta = previousTotalClicks > 0 ? currentTotalClicks - previousTotalClicks : 0;
    const ctrDelta = previousWeekCTR > 0 ? parseFloat(currentCTR) - parseFloat(previousWeekCTR) : 0;

    if (impressionsDelta === 0 && clicksDelta === 0) {
      impressionsDelta = previousWeekTotalImpressions > 0 ? currentTotalImpressions - previousWeekTotalImpressions : 0;
      clicksDelta = previousWeekTotalClicks > 0 ? currentTotalClicks - previousWeekTotalClicks : 0;
      timeDifferenceText = lastWeekDate == lastWeek ? 'since last week' : 'since prior week';
    }

    const activeAdsDelta = totalActiveAds - previousWeekActiveAds;

    return {
      data: {
        stats: [
          {
            label: 'Total Campaigns',
            type: 'ads',
            total: totalCampaigns,
            delta: campaignsSinceLastMonth > 0 ? totalCampaigns - campaignsSinceLastMonth : 0,
            text: 'this month',
          },
          {
            label: 'Active Ads',
            type: 'ads',
            total: totalActiveAds,
            delta: activeAdsDelta,
            text: timeDifferenceTextTotalAds,
          },
          {
            label: 'Total Impressions',
            type: 'impressions',
            total: currentTotalImpressions,
            delta: impressionsDelta,
            text: timeDifferenceText,
          },
          {
            label: 'Total CLicks',
            type: 'clicks',
            total: currentTotalClicks,
            delta: clicksDelta,
            text: timeDifferenceText,
          },
          {
            label: 'CTR',
            type: 'ctr',
            total: parseFloat(currentCTR),
            delta: parseFloat(ctrDelta.toFixed(2)),
            text: timeDifferenceTextCtr,
          },
        ],
      },
    };
  },

  async fetchStatAnalytics(ctx) {
    const knex = strapi.db.connection;
    const { filters = {} } = ctx.request.query;
    let { start_date, end_date } = filters || {};

    const today = format(new Date(), 'yyyy-MM-dd');
    end_date = end_date || today;
    start_date = start_date || format(subDays(new Date(), 365), 'yyyy-MM-dd');
    delete filters.start_date;
    delete filters.end_date;

    const totalCampaigns = await strapi.db.query('plugin::strapi-ads.campaign').count({
      filters: {
        ...filters,
        campaign_status: { $ne: 'archived' },
        min_date: { $lte: end_date },
        max_date: { $gte: start_date },
      },
    });

    const lastMonthDate = format(subMonths(new Date(end_date), 1), 'yyyy-MM-dd');
    let campaignsSinceLastMonth = 0;
    if (new Date(lastMonthDate) >= new Date(start_date)){
      campaignsSinceLastMonth=await strapi.entityService.count('plugin::strapi-ads.campaign',{
        filters:{
          ...filters,campaign_status:{$ne:'archived'},
          min_date: { $lte: lastMonthDate },
          max_date: { $gte: start_date },
        },
      });
    }

    const totalActiveAds=await strapi.entityService.count(adModel,{
      filters:{
        ad_status:['live', 'expired'],
        campaign:{campaign_status:['active', 'expired'], },
        ad_start_date:{$lte:end_date},
        $or:[{ad_end_date:null},{ad_end_date:{$gte:end_date}}],
      },
    });

    let query = knex('daily_system_stats as ds')

    let mainQuery = query.clone();
    if (start_date && end_date) {
      mainQuery.where('ds.stat_date', '>=', start_date).andWhere('ds.stat_date', '<=', end_date);
    }
    const currentStats = await mainQuery.sum({
      total_impressions: 'ds.impressions',
      total_clicks: 'ds.clicks'
    })
    .max('ds.stat_date as stat_date')
    .first();

    const max_stat_date = currentStats.stat_date;
    let latestDateStat = {}, previousStats = {};

    if(max_stat_date === end_date){
      let lastDayQuery = query.clone();
      lastDayQuery.where('ds.stat_date', '=', end_date);
      latestDateStat= await lastDayQuery.sum({
        total_impressions: 'ds.impressions',
        total_clicks: 'ds.clicks'
      })
      .max('ds.stat_date as stat_date')
      .first();

      previousStats = {
        total_impressions : currentStats.total_impressions - (latestDateStat?.total_impressions || 0),
        total_clicks : currentStats.total_clicks - (latestDateStat?.total_clicks || 0),
        stat_date : format(subDays(new Date(end_date), 1), 'yyyy-MM-dd'),
      };
    }

    const lastWeekDate = format(subDays(new Date(end_date), 7), 'yyyy-MM-dd');

    let lastWeekStat = null, previousWeekStats = null, previousWeekActiveAds =0;
    if (new Date(lastWeekDate) >= new Date(start_date)){
      // let lastWeekQueryz=query.clone();
      let lastWeekQuery=query.clone();

      // lastWeekStat = await lastWeekQueryz
      // .where('stat_date', '>=', start_date)
      // .andWhere('stat_date', '<=', lastWeekDate)
      // .sum({
      //   total_impressions: 'impressions',
      //   total_clicks: 'clicks'
      // })
      // .first();

      const currentWeekStat = await lastWeekQuery
      .where('stat_date', '>', lastWeekDate)
      .andWhere('stat_date', '<=', end_date)
      .sum({
        total_impressions: 'impressions',
        total_clicks: 'clicks'
      })
      .first();

      console.log(currentWeekStat)

      previousWeekStats = {
        total_impressions : currentStats.total_impressions - (currentWeekStat.total_impressions || 0),
        total_clicks : currentStats.total_clicks - (currentWeekStat.total_clicks || 0),
        lastWeekDate: lastWeekDate,
      };

      previousWeekActiveAds=await strapi.entityService.count(adModel,{
        filters:{
          ad_status:['live', 'expired'],
          campaign:{campaign_status:['active', 'expired'], },
          ad_start_date:{$lte:lastWeekDate},
          $or:[{ad_end_date:null},{ad_end_date:{$gte:lastWeekDate}}],
        },
      });
    }


    // console.log(currentStat, latestDateStat, previousStats);
    // console.log(lastWeekStat, previousWeekStatsz, lastWeekActiveAds);

    const previousDate = previousStats?.stat_date;
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    let timeDifferenceText = previousDate == yesterday ? 'since yesterday' : 'since last day';

    const currentDate = currentStats?.stat_date;
    const lastWeek = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const timeDifferenceTextCtr = lastWeekDate == lastWeek ? 'vs last week' : 'vs prior week';
    const timeDifferenceTextTotalAds =
        lastWeekDate == lastWeek ? 'since last week' : 'since prior week';

    // Calculate current values
    const currentTotalImpressions = parseInt(currentStats?.total_impressions || 0, 10);
    const currentTotalClicks = parseInt(currentStats?.total_clicks || 0, 10);

    // Calculate previous day values
    const previousTotalImpressions = parseInt(previousStats?.total_impressions || 0, 10);
    const previousTotalClicks = parseInt(previousStats?.total_clicks || 0, 10);

    const previousWeekTotalImpressions = parseInt(previousWeekStats?.total_impressions || 0, 10);
    const previousWeekTotalClicks = parseInt(previousWeekStats?.total_clicks || 0, 10);

    // Calculate CTR
    const currentCTR =
      currentTotalImpressions > 0
        ? ((currentTotalClicks / currentTotalImpressions) * 100).toFixed(2)
        : 0;
    const previousWeekCTR =
      previousWeekTotalImpressions > 0
        ? ((previousWeekTotalClicks / previousWeekTotalImpressions) * 100).toFixed(2)
        : 0;

    // Calculate deltas
    let impressionsDelta = previousTotalImpressions > 0 ? currentTotalImpressions - previousTotalImpressions : 0;
    let clicksDelta = previousTotalClicks > 0 ? currentTotalClicks - previousTotalClicks : 0;
    const ctrDelta = previousWeekCTR > 0 ? parseFloat(currentCTR) - parseFloat(previousWeekCTR) : 0;

    if (impressionsDelta === 0 && clicksDelta === 0) {
      impressionsDelta = previousWeekTotalImpressions > 0 ? currentTotalImpressions - previousWeekTotalImpressions : 0;
      clicksDelta = previousWeekTotalClicks > 0 ? currentTotalClicks - previousWeekTotalClicks : 0;
      timeDifferenceText = lastWeekDate == lastWeek ? 'since last week' : 'since prior week';
    }

    const activeAdsDelta = previousWeekActiveAds > 0 ? totalActiveAds - previousWeekActiveAds : 0;

    return {
      data: {
        stats: [
          {
            label: 'Total Campaigns',
            type: 'ads',
            total: totalCampaigns,
            delta: campaignsSinceLastMonth > 0 ? totalCampaigns - campaignsSinceLastMonth : 0,
            text: 'this month',
          },
          {
            label: 'Active Ads',
            type: 'ads',
            total: totalActiveAds,
            delta: activeAdsDelta,
            text: timeDifferenceTextTotalAds,
          },
          {
            label: 'Total Impressions',
            type: 'impressions',
            total: currentTotalImpressions,
            delta: impressionsDelta,
            text: timeDifferenceText,
          },
          {
            label: 'Total CLicks',
            type: 'clicks',
            total: currentTotalClicks,
            delta: clicksDelta,
            text: timeDifferenceText,
          },
          {
            label: 'CTR',
            type: 'ctr',
            total: parseFloat(currentCTR),
            delta: parseFloat(ctrDelta.toFixed(2)),
            text: timeDifferenceTextCtr,
          },
        ],
      },
    };
  },

  async generateCampaignReport(ctx) {
    try{
      const title=`campaign_report_${format(new Date(),'yyyyMMdd_HHmmss')}`;
      const {filters}=ctx.request.query;
      const tmpWorkingDirectory=await getTempDirectory();
      const csvId=uuidv4();
      const outputPath=path.resolve(tmpWorkingDirectory,`${csvId}.csv`);
      const stream=fs.createWriteStream(outputPath);

      const limit=100;
      let offset=0;
      let hasMore=true;

      const headers=['Campaign','Date','Status','Ads','Impressions','Clicks','CTR','Company Registered As','Entity Name','Licence Number',];

      stream.write(headers.join(',')+'\n');
      do{
        const entities=await strapi.db.query(modelName).findMany({
          fields:['campaign_name','min_date','max_date','campaign_status','total_impressions','total_clicks','campaign_entity_type','campaign_entity_name','campaign_entity_license_number',],
          populate:{ads: true },
          where: filters,
          limit,
          offset,
        });

        if(!entities.length){
          hasMore=false;
          break;
        }

        entities.forEach((entity)=>{
          const formattedDates=entity.max_date?`${format(new Date(entity.min_date),'dd/MM/yy')} - ${format(new Date(entity.max_date),'dd/MM/yy')}`:`${format(new Date(entity.min_date),'dd/MM/yy')}`;
          const ctr=entity.total_impressions>0?((entity.total_clicks/entity.total_impressions)*100).toFixed(2):'0.00';
          const row=[entity.campaign_name,formattedDates,capitalizeFirst(entity.campaign_status),entity.ads.length,entity.total_impressions,entity.total_clicks,`${ctr}%`,entity.campaign_entity_type,entity.campaign_entity_name,entity.campaign_entity_license_number,]
          .map((val)=>`"${(val??'').toString().replace(/"/g,'""')}"`)
          .join(',');
          stream.write(row+'\n');
        });

        offset+=limit;
        hasMore=entities.length===limit;
      }while(hasMore);

      stream.end();

      return {
        message:'CSV generated successfully',downloadUrl:`/api/strapi-ads/download-csv/${csvId}/${_.kebabCase(title)}`,
      };
    }catch(e){
      console.error(e);
    }
  },

  async expireAds() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const limit = 100;
    let totalExpired = 0;
    let hasMore = true;

    do {
      const expiredAds = await strapi.entityService.findMany('plugin::strapi-ads.ad', {
        filters: {
          ad_end_date: { $lt: today },
          ad_status: { $ne: 'expired' },
        },
        limit,
      });

      const adIds = expiredAds.map(ad => ad.id);
      await strapi.db.connection('ads')
      .whereIn('id', adIds)
      .update({ ad_status: 'expired' });

      totalExpired += expiredAds.length;
      hasMore = expiredAds.length === limit;
    } while (hasMore);

    return { expiredCount: totalExpired };
  },

  async expireCampaignsWithAllExpiredAds() {
    const limit = 100;
    let totalUpdated = 0;
    let hasMore = true;

    do {
      const campaignsToExpire = await strapi.db.connection('campaigns as c')
      .select('c.id')
      .innerJoin('ads_campaign_links as acl', 'c.id', 'acl.campaign_id')
      .innerJoin('ads as a', 'acl.ad_id', 'a.id')
      .where('c.campaign_status', 'active')
      .groupBy('c.id')
      .havingRaw('COUNT(a.id) = COUNT(CASE WHEN a.ad_status = ? THEN 1 END)', ['expired'])
      .orderBy('c.id', 'asc')
      .limit(limit);

      if (!campaignsToExpire.length) {
        hasMore = false;
        break;
      }

      const campaignIds = campaignsToExpire.map(c => c.id);
      await strapi.db.connection('campaigns')
      .whereIn('id', campaignIds)
      .update({ campaign_status: 'expired' });

      totalUpdated += campaignIds.length;
      hasMore = campaignsToExpire.length === limit;
    } while (hasMore);

    return { expiredCount: totalUpdated };

  },

  async updateStatus(ctx){
    const { id } = ctx.params;
    const { campaign_status } = await validateStatusSchema(ctx.request.body?.data || {});

    const entity = await strapi.entityService.update(modelName, id, {
      data: { campaign_status },
      populate: {
        ads: true,
      }
    });

    if (entity.ads?.length){
      for (const ad of entity.ads) {
        if (ad.ad_status === 'live'){
          await strapi.entityService.update(adModel,ad.id,{
            data:{ad_status:'inactive'},
          });
        }
      }
    }


    return entity;
  },

  async syncStatsOverall(date = null){
    try{
      const ads_config = await strapi.plugin('strapi-ads').service('ads-config').find();

      if(ads_config?.stat_sync_in_progress === false){

        await strapi.plugin('strapi-ads').service('ads-config').createOrUpdate({
          data:{
            stat_sync_in_progress:true,
          }
        });
        const statDate = date || format(subDays(new Date(), 1), 'yyyy-MM-dd');
        await strapi.plugin('strapi-ads').service('campaign').aggregateCampaignStats(statDate);
        await strapi.plugin('strapi-ads').service('campaign').generateDailyStats(statDate);

        await strapi.plugin('strapi-ads').service('ads-config').createOrUpdate({
          data: {
            stat_sync_last_run:new Date(),stat_sync_in_progress:false,
          }
        })
      }
    }catch(e){
      console.error(e);
      return e;
    }
  }
}));
