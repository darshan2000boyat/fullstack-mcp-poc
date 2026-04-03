const logger = require("../helpers/logger").default;

module.exports = {
  async createDeepLink(result, PageType) {
    const knex = strapi.db.connection.context;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      branch_key: strapi.config.get("constants.BRANCHIO_KEY"),
      channel: "mobile",
      data: {
        Args: [
          {
            Key: "Id",
            Value: result.id,
          },
          {
            Key: "PageType",
            Value: PageType,
          },
        ],
        Route: "/content-detail-screen-view",
        Type: "navigation",
        Category: "contentPage",
        Screen: "content_detail_screen",
      },
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let res = {};
    try {
      const fetchResult = await fetch(
        strapi.config.get("constants.BRANCHIO_URL"),
        requestOptions
      );
      if (fetchResult.ok) {
        res = await fetchResult.json();
        console.log(res);
      }
    } catch (error) {
      logger.error(`BranchIO | ${error.message}`);
    }

    const query = `UPDATE ${PageType} SET SHARE_LINK='${res.url}' WHERE id=${result.id} AND LOCALE='${result.locale}'`;
    try {
      await knex.raw(query);
    } catch (error) {
      logger.error(`BranchIO | Query call | Id: ${error.message}`);
    }
  },
};
