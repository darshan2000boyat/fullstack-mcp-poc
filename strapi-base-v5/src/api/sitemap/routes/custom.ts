export default {
  routes: [
    {
      method: "GET",
      path: "/sitemap/get-data",
      handler: "sitemap.getData",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/sitemap/get-data-dynamic",
      handler: "sitemap.getDataDynamic",
      config: {
        auth: false,
      },
    },
  ],
};
