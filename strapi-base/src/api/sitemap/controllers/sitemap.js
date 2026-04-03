// @ts-nocheck
"use strict";

/**
 * sitemap controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const currentModel = "api::sitemap.sitemap";
const { filter } = require("lodash/fp");
const { errorResponse } = require("../../../../helpers/error");

module.exports = createCoreController(currentModel, ({ strapi }) => ({
  async getData(ctx) {
    const slug = ctx.request.query["slug"];
    const locale = ctx.request.query["locale"];
    const isPreview = ctx.request.query["isPreview"] === "true";
    const ALL_BLOCKS = strapi.config.get("sitemap-components.ALL_BLOCKS");
    const CHANNEL = strapi.config.get("sitemap-components.CHANNEL");
    const GLOBAL_BLOCK = {
      "website-blocks.global-block": {
        populate: {
          ...CHANNEL,
          Block: {
            fields: ["BlockName", "BlockUID"],
            populate: {
              Blocks: {
                on: ALL_BLOCKS,
              },
            },
          },
        },
      },
    };
    let publishFilter = {};
    if (!isPreview) {
      publishFilter = { publishedAt: { $null: false } };
    }
    const response = await strapi.entityService.findMany(currentModel, {
      locale,
      fields: [
        "PageTitle",
        "PageDescription",
        "PageUid",
        "PageSubtitle",
        "HidePageTitle",
        "RequireAuth",
        "Disabled",
      ],
      populate: {
        ParentPage: {
          fields: ["PageTitle", "PageUid", "Disabled"],
          populate: {
            ParentPage: {
              fields: ["PageTitle", "PageUid", "Disabled"],
              populate: {
                ParentPage: {
                  fields: ["PageTitle", "PageUid", "Disabled"],
                },
              },
            },
          },
        },
        components: {
          on: {
            ...ALL_BLOCKS,
            ...GLOBAL_BLOCK,
          },
        },
      },
      filters: {
        PageUid: {
          $eq: slug,
        },
        ...publishFilter,
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(response, ctx);

    return this.transformResponse(sanitizedEntity);
  },

  async getDataDynamic(ctx) {
    const slug = ctx.request.query["slug"];
    const locale = ctx.request.query["locale"];

    let slugs = slug?.split(",") || [];
    const isPreview = ctx.request.query["isPreview"] === "true";
    const primaryUID = slugs[slugs.length - 1];
    let filters = [
      {
        PageUid: {
          $eq: primaryUID,
        },
      },
    ];
    if (!isPreview) {
      filters.push({ publishedAt: { $null: false } });
    }
    if (slugs?.length === 1) {
      filters.push({
        ParentPage: {
          id: {
            $null: true,
          },
        },
      });
    }

    slugs = slug?.split(",").slice(0, -1)?.reverse() || [];

    for (let i = 0; i < slugs.length; i++) {
      const isLast = i === slugs.length - 1;

      let nestedCondition = {
        ParentPage: {
          PageUid: {
            $eq: slugs[i],
          },
          ...(isLast
            ? {
                ParentPage: {
                  id: {
                    $null: true,
                  },
                },
              }
            : {}),
        },
      };

      for (let j = 0; j < i; j++) {
        nestedCondition = {
          ParentPage: nestedCondition,
        };
      }
      filters.push(nestedCondition);
    }

    const ALL_BLOCKS = strapi.config.get("sitemap-components.ALL_BLOCKS");
    const CHANNEL = strapi.config.get("sitemap-components.CHANNEL");
    const GLOBAL_BLOCK = {
      "website-blocks.global-block": {
        populate: {
          ...CHANNEL,
          Block: {
            fields: ["BlockName", "BlockUID"],
            populate: {
              Blocks: {
                on: ALL_BLOCKS,
              },
            },
          },
        },
      },
    };

    const response = await strapi.entityService.findMany(currentModel, {
      locale,
      filters,
      fields: [
        "PageTitle",
        "PageDescription",
        "PageUid",
        "PageSubtitle",
        "HidePageTitle",
        "RequireAuth",
        "Disabled",
      ],
      populate: {
        ParentPage: {
          fields: ["PageTitle", "PageUid", "Disabled"],
          populate: {
            ParentPage: {
              fields: ["PageTitle", "PageUid", "Disabled"],
              populate: {
                ParentPage: {
                  fields: ["PageTitle", "PageUid", "Disabled"],
                },
              },
            },
          },
        },
        components: {
          on: {
            ...ALL_BLOCKS,
            ...GLOBAL_BLOCK,
          },
        },
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(response, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));
