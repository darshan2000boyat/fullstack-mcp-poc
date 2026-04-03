'use strict';

/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const modelName = 'plugin::strapi-ads.campaign';
const { parseMultipartData } = require('@strapi/utils');
const { parseISO, startOfDay, isAfterToday } = require('date-fns');
const _ = require('lodash');
const { ValidationError } = require('@strapi/utils').errors;


const hasConflictingDates = async (ads, campaign) => {
  // First check if there is a local conflict within the ads array

  let conflictsArray = [];
  const allAdIds = ads.map((ad) => ad.id).filter(Boolean);
  for (let i = 0; i < ads.length; i++) {
    const ad1 = ads[i];

    const start = startOfDay(parseISO(ad1.ad_start_date));
    const end = startOfDay(parseISO(ad1.ad_end_date));
    const today = startOfDay(new Date());

    if (!start || !end || isNaN(start) || isNaN(end)) {
      return {
        generalError: true,
        message: `Invalid dates for "${ad1.ad_name}"`,
        adLocal: ad1,
      };
    }
    if (start > end) {
      return {
        generalError: true,
        message: `Start should be less than or equal to end for "${ad1.ad_name}"`,
        adLocal: ad1,
      };
    }
    if (end < today) {
      return {
        generalError: true,
        message: `End should be greater than or equal to today for "${ad1.ad_name}"`,
        adLocal: ad1,
      };
    }

    if (ad1.ad_status !== 'live') {
      continue;
    }

    const screens = Array.isArray(ad1.ad_screens) ? ad1.ad_screens : [];

    const ad_type_local = await strapi.entityService.findOne(
      'plugin::strapi-ads.ad-type',
      ad1.ad_type
    );
    const ad_spot_local = await strapi.entityService.findOne(
      'plugin::strapi-ads.ad-spot',
      ad1.ad_spot
    );
    const ad_screens_local = screens.length
      ? await strapi.entityService.findMany('plugin::strapi-ads.ad-screen', {
          filters: { id: { $in: screens } },
        })
      : [];

    let remoteConflicts = [];

    for (let j = i + 1; j < ads.length; j++) {
      const ad2 = ads[j];

      if (ad2.ad_status !== 'live') {
        continue;
      }

      if (ad1.ad_type !== ad2.ad_type) {
        continue;
      }

      if (ad1.ad_spot !== ad2.ad_spot) {
        continue;
      }

      const screens1 = Array.isArray(ad1.ad_screens) ? ad1.ad_screens : [];
      const screens2 = Array.isArray(ad2.ad_screens) ? ad2.ad_screens : [];

      const shouldCheckDates =
        (screens1.length === 0 && screens2.length === 0) ||
        (screens1.length > 0 &&
          screens2.length > 0 &&
          _.intersection(screens1, screens2).length > 0);

      if (!shouldCheckDates) {
        continue;
      }

      // Check if dates overlap
      const start1 = parseISO(ad1.ad_start_date);
      const end1 = ad1.ad_end_date ? parseISO(ad1.ad_end_date) : parseISO('9999-12-31');
      const start2 = parseISO(ad2.ad_start_date);
      const end2 = ad2.ad_end_date ? parseISO(ad2.ad_end_date) : parseISO('9999-12-31');

      if (start1 <= end2 && end1 >= start2) {
        const ad_type = await strapi.entityService.findOne(
          'plugin::strapi-ads.ad-type',
          ad2.ad_type
        );
        const ad_spot = await strapi.entityService.findOne(
          'plugin::strapi-ads.ad-spot',
          ad2.ad_spot
        );
        const ad_screens = screens2.length
          ? await strapi.entityService.findMany('plugin::strapi-ads.ad-screen', {
              filters: { id: { $in: screens2 } },
            })
          : [];

        remoteConflicts.push({
          type: 'local',
          adRemote: { ...ad2, ad_type, ad_spot, ad_screens, campaign: campaign, localAd: true },
        });
      }
    }

    // Build the query filters
    const filters = {
      ad_status: 'live',
      campaign: {
        campaign_status: 'active',
      },
      ad_type: ad1.ad_type,
      ad_spot: ad1.ad_spot,
      ...(screens.length === 0
        ? { ad_screens: { $null: true } }
        : { ad_screens: { $in: screens } }),

      // ad_start_date: { $lte: ad1.ad_end_date },
      // ad_end_date: { $gte: ad1.ad_start_date },
      // $or: [
      //     {
      //         // Case 1: Both dates exist and overlap
      //         ad_start_date: { $lte: ad1.ad_end_date || '9999-12-31' },
      //         ad_end_date: { $gte: ad1.ad_start_date, $notNull: true },
      //     },
      //     {
      //         // Case 2: End date is null (infinite) and starts before ad1 ends
      //         ad_start_date: { $lte: ad1.ad_end_date || '9999-12-31' },
      //         ad_end_date: { $null: true },
      //     },
      // ],

      $or: [
        // Case 1: Remote ad is infinite (null end_date) and starts before or during ad1
        {
          ad_end_date: { $null: true },
          ad_start_date: { $lte: ad1.ad_end_date || new Date('9999-12-31') },
        },
        // Case 2: ad1 is infinite and remote ad starts before infinity
        ...(ad1.ad_end_date === null
          ? [
              {
                ad_start_date: { $gte: ad1.ad_start_date },
              },
            ]
          : []),
        // Case 3: Both have finite dates - standard overlap check
        ...(ad1.ad_end_date
          ? [
              {
                ad_start_date: { $lte: ad1.ad_end_date },
                ad_end_date: { $gte: ad1.ad_start_date },
              },
            ]
          : []),
      ],

      ...(allAdIds.length > 0 && { id: { $notIn: allAdIds } }),
    };

    const conflictingAds = await strapi.entityService.findMany('plugin::strapi-ads.ad', {
      filters,
      populate: ['campaign', 'ad_type', 'ad_spot', 'ad_screens'],
      limit: 10,
    });

    if (conflictingAds.length > 0) {
      for (const ad of conflictingAds){
        remoteConflicts.push({
          type:'remote',adRemote:ad,
        });
      }
    }

    if (remoteConflicts.length > 0) {
      conflictsArray.push({
        adLocal: {
          ...ad1,
          ad_type: ad_type_local,
          ad_spot: ad_spot_local,
          ad_screens: ad_screens_local,
        },
        remoteConflicts,
      });
    }
  }
  return {
    conflict: conflictsArray.length > 0,
    conflicts: conflictsArray,
  };
};

module.exports = createCoreController(modelName, ({ strapi }) => ({
  // Custom controller logic can be added here
  async create(ctx) {
    try {
      const { type = 'save' } = ctx.request.params;
      const { check_conflicts = false } = ctx.request.query;
      let data, files;
      if (ctx.is('multipart')) {
        const parsed = parseMultipartData(ctx);
        data = parsed.data;
        files = parsed.files;
        // You can also access parsed.files if needed
      } else {
        data = ctx.request.body;
      }

      const user = ctx.state.user;

      const campaignData = _.omit(data, ['ads']);
      let existing = null;
      if (data.id) {
        existing = await strapi.service(modelName).findOne(data.id, {
          populate: ['ads'],
        });
      }

      const computeAdStatus = (status, adEndDate) => {
        let adStatus = status;

        if (status === 'expired' && isAfterToday(adEndDate)) {
          adStatus = 'inactive';
        }

        if (type === 'unpublish') {
          adStatus = 'inactive';
        } else if (type === 'publish') {
          adStatus = 'live';
        }

        return adStatus;
      };

      const finalAds = [...(existing?.ads || [])];

      (data.ads || []).forEach((newAd) => {
        if (newAd.id) {
          const idx = finalAds.findIndex((ad) => ad.id === newAd.id);
          if (idx !== -1) {
            newAd.ad_status = computeAdStatus(finalAds[idx].ad_status, newAd.ad_end_date);
            finalAds[idx] = newAd; // Replace existing ad
          } else {
            throw new Error(`'${newAd.name}' ad not found in the campaign.`);
          }
        } else {
          // Set ad_status for new ads based on type
          if (type === 'unpublish') {
            newAd.ad_status = 'inactive';
          } else if (type === 'publish') {
            newAd.ad_status = 'live';
          } else {
            newAd.ad_status = 'draft';
          }
          finalAds.push(newAd); // New ad without id
        }
      });

      let campaignStatus = existing ? existing.campaign_status : 'draft';
      const allNotLive = finalAds.every((ad) => ad.ad_status !== 'live');

      if (type === 'publish' && existing) {
        campaignStatus = 'active';
      } else if (type === 'unpublish' && existing && allNotLive) {
        campaignStatus = 'inactive';
      }

      if ((type === 'save' || type === 'publish') && campaignStatus === 'active') {
        const checkConflict = await hasConflictingDates(data.ads, campaignData);
        if (checkConflict.conflict) {
          return {
            error: 'Conflict detected',
            message: checkConflict.message,
            details: checkConflict,
          };
        } else if (checkConflict.generalError) {
          throw new ValidationError(checkConflict.message, checkConflict);
        }
      }

      const startDates = finalAds
        .map((ad) => (typeof ad.ad_start_date === 'string' ? parseISO(ad.ad_start_date) : null))
        .filter((date) => date instanceof Date && !isNaN(date));
      const endDates = finalAds
        .map((ad) => (typeof ad.ad_end_date === 'string' ? parseISO(ad.ad_end_date) : null))
        .filter((date) => date instanceof Date && !isNaN(date));

      const minStart = startDates.length ? new Date(Math.min(...startDates)) : null;
      const maxEnd = endDates.length ? new Date(Math.max(...endDates)) : null;

      campaignData.min_date = minStart;
      campaignData.max_date = maxEnd;
      campaignData.campaign_status = campaignStatus;

      if (check_conflicts) {
        return { noConfilct: true, message: 'No conflicts detected' };
      }
      let campaign;
      if (data.id) {
        campaignData.updatedBy = user.id;
        campaign = await strapi.service(modelName).update(data.id, { data: campaignData });
      } else {
         const campaign_id = await strapi
          .service("plugin::content-manager.uid")
          .generateUIDField({
            contentTypeUID: modelName,
            field: "campaign_id",
            data: campaignData,
          });
        campaignData.campaign_id = campaign_id ?? "";
        campaignData.createdBy = user.id;
        campaign = await strapi.service(modelName).create({ data: campaignData });
      }

      const receivedAdIds = new Set();
      for (let index = 0; index < data.ads.length; index++) {
        const adFiles = files?.[`ads.${index}.ad_image`];
        const ad = data.ads[index];
        let adObject = null;

        if (ad.id) {
          await strapi.service('plugin::strapi-ads.ad').update(ad.id, {
            data: { ad_external_url: "", ...ad },
            files: adFiles ? { ad_image: adFiles } : undefined,
          });
        } else {
          const adSlug = await strapi
            .service("plugin::content-manager.uid")
            .generateUIDField({
              contentTypeUID: "plugin::strapi-ads.ad",
              field: "ad_id",
              data: ad,
            });
          await strapi.service("plugin::strapi-ads.ad").create({
            data: { ad_external_url: "", ...ad, ad_id: adSlug ?? "", campaign: campaign.id },
            files: adFiles ? { ad_image: adFiles } : undefined,
          });
        }

        receivedAdIds.add(adObject.id);

        await strapi.service('plugin::strapi-ads.ad').update(adObject.id, {
          data: { ad_image: 3688 },
        });
      }

      const campaignResult = await strapi.service(modelName).findOne(campaign.id, {
        populate: ['ads.ad_spot', 'ads.ad_screens', 'ads.ad_type', 'ads.ad_image'],
      });
      campaignResult.ads = (campaignResult.ads || []).filter((ad) => receivedAdIds.has(ad.id));

      return campaignResult;
    } catch (e) {
      ctx.badRequest(e.message, e.details);
      console.error(e);
    }
  },

  async conflictChecker(ctx) {
    try{
      let data,files;
      if(ctx.is('multipart')){
        const parsed=parseMultipartData(ctx);
        data=parsed.data;
        files=parsed.files;
        // You can also access parsed.files if needed
      }else{
        data=ctx.request.body;
      }

      const campaignData=_.omit(data,['ads']);
      let existing=null;
      if(data.id){
        existing= await strapi.service(modelName).findOne(data.id);
      }
      const campaignStatus=data.campaign_status||(existing?existing.campaign_status:'');
      if(campaignStatus==='active'){
        const checkConflict=await hasConflictingDates(data.ads,campaignData);
        if(checkConflict.conflict){
          return {
            error:'Conflict detected',message:checkConflict.message,details:checkConflict,
          };
        }else if(checkConflict.generalError){
          throw new ValidationError(checkConflict.message,checkConflict);
        }
      }

      return { noConfilct: true, message: 'No conflicts detected' };
    } catch(e){
      ctx.badRequest(e.message);
    }
  },

  async fetchStat(ctx){
      try{
          return strapi.plugin('strapi-ads').service('campaign').fetchStat(ctx);
      }catch(e){
          console.error(e);
          return e;
    }
  },
  async fetchStatOverall(ctx){
      try{
          return strapi.plugin('strapi-ads').service('campaign').fetchStatOverall(ctx);
      }catch(e){
          console.error(e);
          return e;
      }
  },

  async fetchStatAnalytics(ctx){
      try{
          return strapi.plugin('strapi-ads').service('campaign').fetchStatAnalytics(ctx);
      }catch(e){
          console.error(e);
          return e;
      }
  },

  async generateCampaignReport(ctx){
    try{
      console.log("herer??")
      return strapi.plugin('strapi-ads').service('campaign').generateCampaignReport(ctx);
    }catch(e){
      console.error(e);
      return e;
    }
  },

  async updateStatus(ctx){
    try{
      return strapi.plugin('strapi-ads').service('campaign').updateStatus(ctx);
    }catch(e){
      console.error(e);
      return e;
    }
  },

  async syncStats(ctx){
      try{
          const today=format(new Date(),'yyyy-MM-dd');
          await strapi.plugin('strapi-ads').service('campaign').aggregateCampaignStats(today);
          await strapi.plugin('strapi-ads').service('campaign').generateDailyStats(today);
          return {success:true,message:'Campaign stats aggregated and daily stats generated.'};
      }catch(e){
          console.error(e);
          return e;
      }
  },

  async generateAdsReport(ctx) {
    try {
      return strapi.plugin('strapi-ads').service('campaign').generateAdsReport(ctx);
    } catch (e) {
      console.error(e);
      return e;
    }
  },

  async getSyncStatsStatus(ctx) {
    try {
      return { success: true, message: '', last_sync: new Date() };
    } catch (e) {
      console.error(e);
      return e;
    }
  },
}));
