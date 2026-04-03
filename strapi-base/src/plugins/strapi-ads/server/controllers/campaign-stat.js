'use strict';
/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const modelName = 'plugin::strapi-ads.campaign-stat';
const campaignModel = 'plugin::strapi-ads.campaign';
const { parseISO, format, addDays, startOfWeek, differenceInDays } = require('date-fns');
const { ValidationError } = require('@strapi/utils').errors;

const { fillMissingDates, fillMondayDates, addLabels } = require('../utils/common');

module.exports = createCoreController(modelName, ({ strapi }) => ({
    async list(ctx){

        const { filters } = ctx.request.query;
        let { campaign_id, start_date, end_date, } = filters || {};

        if(!campaign_id){
            throw new ValidationError(`${campaign_id} not found`);
        }
        const campaign = await strapi.service(campaignModel).findOne(campaign_id);

        //if start_date or end_date not provided, set defaults
        if (!end_date) {
            const today = format(new Date(), 'yyyy-MM-dd');
            end_date = campaign.max_date < today ? campaign.max_date : today;
        }
        if (!start_date) {
            const campaignEnd = parseISO(campaign.max_date);
            const campaignStart = parseISO(campaign.min_date);
            const minus365 = addDays(campaignEnd, -365);
            start_date = format(minus365 < campaignStart  ? campaignStart : minus365, 'yyyy-MM-dd');
        }

        // Enforce max 1 year range
        const start = parseISO(start_date);
        const end = parseISO(end_date);
        if (start > end) {
            throw new ValidationError('start_date should not be greater than end_date');
        }
        if (differenceInDays(end, start) > 365) {
            end_date = format(addDays(start, 365), 'yyyy-MM-dd');
        }

        const count = await strapi.entityService.count(modelName, {
            filters: {
                campaign_id,
                stat_date: {
                    $gte: start_date,
                    $lte: end_date,
                }
            },
        });
        let filledResults=[];

        if(count < 50){
            const response = await strapi.service(modelName).find({
                filters: {
                    campaign_id,
                    stat_date: {
                        $gte: start_date,
                        $lte: end_date,
                    }
                },
                sort: { stat_date: 'desc' },
                pagination:{pageSize: 50 },
            });

            if(campaign.id&&response?.results?.length){
                const maxDate=response.results[0]?.stat_date;
                const minDate=response.results[response.results.length-1]?.stat_date;
                const rangeDateStart=campaign.min_date < start_date ? start_date : campaign.min_date;
                const rangeDateEnd=campaign.max_date > end_date ? end_date : campaign.max_date;
                if(rangeDateStart<minDate){
                    response.results.push({
                        stat_date:rangeDateStart,clicks:0,impressions:0,rangeFiller:true
                    });
                }

                if(maxDate<rangeDateEnd){
                    response.results.unshift({
                        stat_date:rangeDateEnd,clicks:0,impressions:0,rangeFiller:true
                    });
                }

                filledResults=fillMissingDates(response.results);
                filledResults = addLabels(filledResults, 'day')
            }
        } else {
            const knex = strapi.db.connection;
            const queryResults = await knex('campaign_stats')
            .select(
                knex.raw("to_char(date_trunc('week', stat_date), 'YYYY-MM-DD') as week_start"),
                knex.raw('SUM(clicks) as clicks'),
                knex.raw('SUM(impressions) as impressions')
            )
            .where({ campaign_id })
            .where('stat_date', '>=', start_date)
            .where('stat_date', '<=', end_date)
            .groupBy("week_start")
            .orderBy('week_start', 'desc')
            .limit(60);

            const results = queryResults.map(r => ({
                stat_date: r.week_start,
                clicks: Number(r.clicks),
                impressions: Number(r.impressions)
            }));

            if(campaign.id&& results?.length){
                const maxDate = format(
                    addDays(parseISO(results[0]?.stat_date), 6),
                    'yyyy-MM-dd'
                );
                const minDate=results[results.length-1]?.stat_date;

                const rangeDateStart=campaign.min_date < start_date ? start_date : campaign.min_date;
                const rangeDateEnd=campaign.max_date > end_date ? end_date : campaign.max_date;

                if(rangeDateStart<minDate){
                    const weekStartMonday = format(
                        startOfWeek(parseISO(rangeDateStart), { weekStartsOn: 1 }),
                        'yyyy-MM-dd'
                    );
                    results.push({
                        stat_date:weekStartMonday,clicks:0,impressions:0,rangeFiller:true
                    });
                }

                if(maxDate<rangeDateEnd){
                    const weekStartMonday = format(
                        startOfWeek(parseISO(rangeDateEnd), { weekStartsOn: 1 }),
                        'yyyy-MM-dd'
                    );
                    results.unshift({
                        stat_date:weekStartMonday,clicks:0,impressions:0,rangeFiller:true
                    });
                }

                filledResults=fillMondayDates(results);
                filledResults = addLabels(filledResults, 'week')
            }
        }


        // for (let i = 0; i < 10; i++){
        //     const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        //     const existing=await strapi.db.query(modelName).findOne({
        //         where:{campaign_id,stat_date:date},
        //     });
        //
        //     if(!existing){
        //         // Generate random values
        //         const impressions=Math.floor(Math.random()*1000);
        //         const clicks=Math.floor(Math.random()*100);
        //
        //         // Create entry
        //         await strapi.db.query(modelName).create({
        //             data:{
        //                 campaign_id,
        //                 stat_date:date,
        //                 impressions,
        //                 clicks,
        //                 total_impressions:impressions,
        //                 total_clicks:clicks,
        //             },
        //         });
        //     }
        // }


        return {
            results: filledResults
        };
    }
}));
