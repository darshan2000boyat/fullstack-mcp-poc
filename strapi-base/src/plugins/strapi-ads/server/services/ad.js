'use strict';

/**
 *  service
 */

const modelName = 'plugin::strapi-ads.ad';
const campaignModel = 'plugin::strapi-ads.campaign';
const statModel = 'plugin::strapi-ads.ad-stat';
const { createCoreService } = require('@strapi/strapi').factories;
const { deepOmit } = require('../utils/common');
const { format, subDays, startOfDay } = require('date-fns');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { download, getTempDirectory, capitalizeFirst } = require('../helpers/generate-csv');
const { yup, validateYupSchema } = require('@strapi/utils');
const { ValidationError } = require('@strapi/utils').errors;

const validateAdStatusSchema = validateYupSchema(yup.object({
  ad_status: yup.string().oneOf(['inactive', 'archived']).required(),
}));

module.exports = createCoreService(modelName, ({ strapi }) => ({
  async duplicate(ctx) {
    const { id } = ctx.params;
    const originalAd = await strapi.entityService.findOne('plugin::strapi-ads.ad', id, {
      populate: "*",
    });
    if (!originalAd) {
      ctx.throw(404, 'Ad not found');
    }
    let { ad_image, campaign, ...adData } = originalAd;
    adData = _.omit(adData, ['id', 'createdAt', 'updatedAt', 'publishedAt','createdBy', 'updatedBy', 'total_impressions', 'total_clicks', 'ctr']);
    adData.ad_name = `${adData.ad_name} (Copy)-${new Date().getTime()}`;
    adData.ad_id = await strapi.service('plugin::content-manager.uid').generateUIDField({
      contentTypeUID: 'plugin::strapi-ads.ad',
      field: 'ad_id',
      data: {
        ad_name: adData.ad_name,
      },
    });
    const duplicatedAd = await strapi.entityService.create('plugin::strapi-ads.ad', {
      data: {
        ...adData,
        campaign: campaign ? campaign?.id : null,
        ad_image: ad_image ? ad_image?.id : null,
        ad_status: 'draft',
        publishedAt: new Date(),
      },
    });
    return await strapi.entityService.findOne('plugin::strapi-ads.ad', duplicatedAd?.id, {
      populate: ['ad_status', 'ad_image', 'campaign'],
    });
  },

  async fetchStat(ctx) {
    const { id } = ctx.request.params;
    const { filters } = ctx.request.query;
    let { start_date, end_date } = filters || {};
    const knex = strapi.db.connection;

    const ad = await strapi.entityService.findOne(modelName, id);

    if(!end_date){
      end_date = ad.ad_end_date;
      //end_date = '2026-01-08';
    }

    if(!start_date){
      start_date = ad.ad_start_date;
    }

    let query = knex('ad_stats')
    .where('ad_id', id)

    if (start_date && end_date) {
      query = query.where('stat_date', '>=', start_date).andWhere('stat_date', '<=', end_date);
    }

    const currentStats = await query.sum({
      total_impressions: 'impressions',
      total_clicks: 'clicks'
    })
    .max('stat_date as stat_date')
    .first();

    console.log(query.sum({
      total_impressions: 'impressions',
      total_clicks: 'clicks'
    }).max('stat_date as stat_date').toSQL().toNative());

    const max_stat_date = currentStats.stat_date;
    let latestDateStat = [];

    if(max_stat_date === end_date){
      latestDateStat= await strapi.db.query(statModel).findMany({
        where:{ad_id:id,stat_date:end_date},fields:['stat_date','impressions','clicks'],limit:1,
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
      // lastWeekStat = await knex('ad_stats')
      // .where('ad_id', id)
      // .where('stat_date', '>=', start_date)
      // .andWhere('stat_date', '<=', lastWeekDate)
      // .sum({
      //   total_impressions: 'impressions',
      //   total_clicks: 'clicks'
      // })
      // .first();

      const currentWeekStat = await knex('ad_stats')
      .where('ad_id', id)
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

    const previousDate = previousStats?.stat_date;
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    let timeDifferenceText = previousDate == yesterday ? 'since yesterday' : 'since last day';

    const currentDate = currentStats?.stat_date;
    const previousWeek = format(subDays(new Date(currentDate), 7), 'yyyy-MM-dd');
    const lastWeek = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const timeDifferenceTextCtr = previousWeek == lastWeek ? 'vs last week' : 'vs prior week';

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
      timeDifferenceText = previousWeek == lastWeek ? 'since last week' : 'since prior week';
    }

    return {
      data: {
        stats: [
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

  async getDestinationPage(ctx) {
    const { ad_destination_model } = ctx.request.params;
    const { pagination = {}, filters = {}, _q = null } = ctx.request.query;

    const destinationModels = strapi.plugin('strapi-ads').config('destinationModelConfig');

    const destination = destinationModels[ad_destination_model];

    if (!destination) {
      ctx.throw(400, 'Invalid destination model');
    }

    const searchFilter = _q && destination.fields && destination.fields.length
        ? {
          $or: destination.fields.map(field => ({
            [field]: { $containsi: _q }
          }))
        }
        : {};

    const pages = await strapi.service(destination.model).find({
      filters: { ...destination.filters, ...filters, ...searchFilter },
      fields: destination.fields ? destination.fields : undefined,
      pagination: { pageSize: 10, ...pagination },
      sort: { ...destination.sort },
    });

    const resultsWithTitle = pages.results.map((page) => ({
      ...page,
      title: destination.fields ? page[destination.fields[0]] : 'Configure title field',
    }));

    return {
      ...pages,
      results: resultsWithTitle,
    };
  },

  async generateAdsReport(ctx) {
    const title = `ads_report_${format(new Date(), 'yyyyMMdd_HHmmss')}`;
    const { filters } = ctx.request.query;
    const tmpWorkingDirectory = await getTempDirectory();
    const csvId = uuidv4();
    const outputPath = path.resolve(tmpWorkingDirectory, `${csvId}.csv`);
    const stream = fs.createWriteStream(outputPath);

    const limit = 100;
    let offset = 0;
    let hasMore = true;

    const headers = ['AD', 'Date', 'Status', 'Type', 'Campaign', 'Impressions', 'Clicks', 'CTR'];

    stream.write(headers.join(',') + '\n');
    do {
      const ads = await strapi.db.query(modelName).findMany({
        fields: [
          'ad_name',
          'ad_start_date',
          'ad_end_date',
          'ad_status',
          'total_impressions',
          'total_clicks',
        ],
        populate: { campaign: { fields: ['campaign_name'] }, ad_type: { fields: ['title'] } },
        where: filters,
        limit,
        offset,
      });

      if (!ads.length) {
        hasMore = false;
        break;
      }

      ads.forEach((ad) => {
        const formattedDates = ad.ad_end_date
          ? `${format(new Date(ad.ad_start_date), 'dd/MM/yy')} - ${format(new Date(ad.ad_end_date), 'dd/MM/yy')}`
          : `${format(new Date(ad.ad_start_date), 'dd/MM/yy')}`;
        const ctr =
          ad.total_impressions > 0
            ? ((ad.total_clicks / ad.total_impressions) * 100).toFixed(2)
            : '0.00';
        const row = [
          ad.ad_name,
          formattedDates,
          capitalizeFirst(ad.ad_status),
          ad.ad_type?.title,
          ad.campaign?.campaign_name,
          ad.total_impressions,
          ad.total_clicks,
          `${ctr}%`,
        ]
          .map((val) => `"${(val ?? '').toString().replace(/"/g, '""')}"`)
          .join(',');
        stream.write(row + '\n');
      });

      offset += limit;
      hasMore = ads.length === limit;
    } while (hasMore);

    stream.end();

    return {
      message: 'CSV generated successfully',
      downloadUrl: `/api/strapi-ads/download-csv/${csvId}/${_.kebabCase(title)}`,
    };
  },

  async downloadAdsReport(ctx) {
    await download(ctx);
  },

  async getDestinationModel(ctx) {
    const destinationModels = strapi.plugin('strapi-ads').config('destinationModelConfig');

    return Object.keys(destinationModels)
      .map((key) => ({
        key: key,
        label: destinationModels[key].label,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  },

  async updateStatus(ctx){
    const { id } = ctx.params;
    const { ad_status } = await validateAdStatusSchema(ctx.request.body?.data || {});
    let selected;

    const campaigns = await strapi.entityService.findMany(campaignModel, {
      filters: { ads: { id } },
      populate: {
        ads: true,
      }
    });
    const campaign = campaigns[0] || null;

    if(!campaign){
      throw new ValidationError("Invalid Ad");
    }

    const currentAd = campaign.ads.find(ad => ad.id == id);

    if(!currentAd){
      throw new ValidationError("Invalid Ad");
    }


    if(campaign.campaign_status==='active'){
      const allExceptCurrentInactive=campaign.ads
      .filter(ad=>ad.id!=id)
      .every(ad=>ad.ad_status!=='live');
      if(allExceptCurrentInactive&&currentAd.ad_status==='live'){
        const updatedAd = await strapi.entityService.update(campaignModel, campaign.id, {
          data: { campaign_status: 'inactive'},
        });
      }

      // Unselect the ad if it's being inactivated
      selected = false;
    }


    const updateData = { ad_status };
    if (selected === true || selected === false) {
      updateData.selected = selected;
    }
    const updatedAd = await strapi.entityService.update(modelName, id, {
      data: updateData,
    });


    return campaign;
  }
}));
