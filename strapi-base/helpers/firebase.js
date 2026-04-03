const admin = require('firebase-admin');
const logger = require('./logger').default;
const _ = require('lodash');

admin.initializeApp({ credential: admin.credential.cert(strapi.config.get('firebase')) });

module.exports = {
  /**
   * Sends notifications to the targetted devices
   */
  async sendNotification(message) {
    try {
      const failedTokens = [];
      const { tokens } = message;
      if (tokens.length > 500) {
        const chunks = _.chunk(tokens, 500);
        for (const chunkItem of chunks) {
          message.tokens = chunkItem;
          const response = await admin.messaging().sendMulticast(message);
          if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
              if (!resp.success) failedTokens.push(chunkItem[idx]);
            });
          }
        }
      } else if(tokens.length > 0){
        const response = await admin.messaging().sendMulticast(message);
        if (response.failureCount > 0) {
          response.responses.forEach((resp, idx) => {
            if (!resp.success) failedTokens.push(tokens[idx]);
          });
        }
      }

      if (failedTokens.length) {
        // Queries for deleting failed tokens stored with us.

        

        const knex = strapi.db.connection.context;
        const inClause = failedTokens.map((str) => `'${str}'`).join();
        const sql = `SELECT id FROM fcm_tokens WHERE token IN (${inClause})`;
        let results = await knex.raw(sql);
        results = results.rows ? results.rows : [];
        const ids = results.map((i) => i.id);

        console.log(ids);

        const deleteCompSql = `DELETE FROM fcm_tokens_users_links cpc WHERE fcm_token_id IN (${ids.join()})`;
        await knex.raw(deleteCompSql);

        const deleteSql = `DELETE FROM fcm_tokens WHERE id IN (${ids.join()})`;
        await knex.raw(deleteSql);

      }

      return failedTokens.length ? false : true;
    } catch (error) {
      console.log(error);
      logger.error(error.message);
    }
  },

  /**
   * Subscribes users to a particular topic
   */
  async subscribeToTopic(tokens = [], topic) {
    try {
      await admin.messaging().subscribeToTopic(tokens, topic);
      return true;
    } catch (error) {
      logger.error(`Failed to subscribe to topic ${topic}`);
      logger.error('Tokens used for subscribing were ', tokens);
      logger.error(error.message);
      logger.error(error.stack);
      return false;
    }
  },

  /**
   * Un-Subscribes users from a particular topic
   */
  async unsubscribeFromTopic(tokens = [], topic) {
    try {
      await admin.messaging().unsubscribeFromTopic(tokens, topic);
      return true;
    } catch (error) {
      logger.error(`Failed to unsubscribe from topic ${topic}`);
      logger.error('Tokens used for unsubscribing were ', tokens);
      logger.error(error.message);
      logger.error(error.stack);
      return false;
    }
  },

  /**
   * Sends notifications to the targetted topic
   */
  async sendNotificationToTopic(message) {
    try {
      logger.info('in sendNotificationToTopic ', message);
      const notifStatus = await admin.messaging().send(message);
      logger.info(
        'check if sendNotificationToTopic is successfully sent ==> check notif status ',
        notifStatus
      );
      return true;
    } catch (error) {
      logger.info('is there an error sending mails ====> ', error);
      logger.error('Failed to send notification to topic: ', message);
      logger.error(error.message);
      logger.error(error.stack);
      return false;
    }
  },

  /**
   * Fetches the latest template of remote configs
   */
  async getRemoteConfigsTemplate() {
    const template = await admin.remoteConfig().getTemplate();
    return template;
  },

  /**
   * Should be used to validate a remote configs template before actually publishing live
   */
  async validateRemoteConfigsTemplate(template) {
    // Will throw error incase its an invalidate template.
    await admin.remoteConfig().validateTemplate(template);
  },

  /**
   * Publishes remote configs to firebase
   */
  async publishRemoteConfigsTemplate(template) {
    // will throw error incase of failure
    await admin.remoteConfig().publishTemplate(template);
  },

  /**
   * Returns a formatted payload strucuture required for Firebase notifications
   */
  getNotificationPayload(params) {
    const {
      title = '',
      subtitle = '',
      body = '',
      icon = 'https://mocaverse-api.1020dev.com/firebase-logo.png',
      image = 'https://mocaverse-api.1020dev.com/firebase-logo.png',
      link = 'https://mocaverse.1020dev.com/',
      sound = 'bingbong.aiff',
      data = {},
      tokens = [],
      topic,
    } = params;

    // APNS used for IOS rich featured, Web push is for web notification, Notification object is for general notification.
    const payload = {
      apns: {
        payload: {
          aps: {
            alert: { body, title, subtitle, icon },
            badge: 1,
            sound,
            content_available: false,
          },
        },
      },
      data: _.omitBy(data, _.isNil),
      webpush: { fcm_options: { link } },
      notification: { body, image, title, link },
    };

    if (topic) payload.topic = topic;
    else payload.tokens = tokens;

    return payload;
  },
};
