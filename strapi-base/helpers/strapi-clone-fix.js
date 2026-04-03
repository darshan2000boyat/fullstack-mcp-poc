'use-strict';

module.exports = async (strapi) => {
  strapi.db.lifecycles.subscribe(async (event) => {
    //fix for duplicate option in strapi admin
    if (event.action === "afterCreate") {
      const { result } = event;

      const localizations = result?.localizations;
      if (localizations?.length > 0) {
        //if localization present then check if already linked to another entry
        const entries = await strapi.db.query(event.model.uid).findMany({
          where: {
            localizations: {
              id: localizations[0].id,
            },
          },
        });

        if (entries.length > 1) {
          //already linked so make it empty, for clone issue fix in strapi
          await strapi.db.query(event.model.uid).update({
            where: {
              id: result.id,
            },
            data: {
              localizations: []
            }
          });
        }
      }
    }
  });
};