// @ts-nocheck
"use strict";

/**
 * search service
 */

const { createCoreService } = require("@strapi/strapi").factories;
const currentModel = "api::search.search";
// const favoriteModel = "api::user-favourite.user-favourite";

module.exports = createCoreService(currentModel, {
  async globalSearch(ctx) {
    const { query } = ctx.request;
    let { model, search_keyword, locale } = query;
    const searchModelList = await strapi.entityService.findMany(currentModel, {
      populate: {
        globalSearchModels: true,
      },
    });
    if (searchModelList?.globalSearchModels?.length) {
      if (model) {
        searchModelList.globalSearchModels =
          searchModelList?.globalSearchModels.filter(
            (e) => e.modelUid === model
          );
      }

      const searchResults = await Promise.all(
        searchModelList?.globalSearchModels?.map(async (searchModel) => {
          const { modelUid, modelQuery, modelTitle } = searchModel;
          const { populate, fields, searchFields } = modelQuery;
          let conditions = [];
          searchFields.map((field) => {
            conditions.push({ [field]: { $containsi: search_keyword } });
          });

          const res = await strapi.entityService.findMany(modelUid, {
            fields: fields,
            populate: populate,
            locale,
            filters: { $or: conditions },
          });
          //   const updatedRes = await this.getItemsIsFavourite(
          //     locale,
          //     res,
          //     modelUid,
          //     ctx?.state?.user
          //   );
          const totalResults = await strapi.entityService.findMany(modelUid, {
            locale,
            filters: { $or: conditions },
            limit: -1,
          });
          const transformData = strapi
            .controller(modelUid)
            .transformResponse(res);
          return {
            [modelUid]: {
              title: modelTitle,
              ...transformData,
              meta: { totalCount: totalResults?.length },
            },
          };
        })
      );
      const result = searchResults.reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});

      return result;
    }
  },
  //   async getItemsIsFavourite(locale, dataArr, model_uid, user) {
  //     if (dataArr.length) {
  //       for (let data of dataArr) {
  //         let resData = await strapi.entityService.findMany(favoriteModel, {
  //           filters: {
  //             itemID: data?.id?.toString(),
  //             model: model_uid,
  //             userID: user?.id?.toString(),
  //           },
  //           locale: locale,
  //           // limit: -1,
  //         });
  //         //userID: user?.id?.toString(),
  //         if (resData?.length > 0) {
  //           // const userFav = resData?.filter(
  //           //   (u) => u.userId == user?.id?.toString()
  //           // );
  //           data.isFavorite = true;
  //           // data.countFavorite = resData.length;
  //         } else {
  //           data.isFavorite = false;
  //           // data.countFavorite = 0;
  //         }
  //       }
  //     }
  //     return dataArr;
  //   },
});
