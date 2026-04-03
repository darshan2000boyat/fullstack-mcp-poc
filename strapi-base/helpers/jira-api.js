// @ts-nocheck
const axios = require("axios");
const fetch = require("node-fetch");
const { errorResponse } = require("./error");
const { Version2Client } = require("jira.js");
const { default: logger } = require("./logger");
const { format, sub } = require("date-fns");
const jiraClient = new Version2Client({
  host: strapi.config.get("constants.JIRA_HOST_URL"),
  authentication: {
    basic: {
      email: process.env.JIRAUSERNAME,
      apiToken: process.env.JIRAUSERTOKEN,
    },
  },
  newErrorHandling: true,
});

module.exports = {
  async jiraGetAccountID(ctx, requestData) {
    try {
      const jiraUserName = process.env.JIRAUSERNAME;
      const jiraUserToken = process.env.JIRAUSERTOKEN;
      const authBuffer = new Buffer.from(
        `${jiraUserName}:${jiraUserToken}`
      ).toString("base64");
      const config = {
        method: requestData.methodType,
        // url: `${requestData.apiURL}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${authBuffer}`,
        },
        data: requestData.data ? JSON.stringify(requestData.data) : "",
      };
      const jira_response = await fetch(requestData.apiURL, config);
      const res = await jira_response?.json();
      return res;
    } catch (error) {
      await errorResponse(ctx, error, "jira");
    }
  },
  async jiraCreateIssue(ctx, requestData) {
    try {
      const jiraUserName = process.env.JIRAUSERNAME;
      const jiraUserToken = process.env.JIRAUSERTOKEN;
      const authBuffer = new Buffer.from(
        `${jiraUserName}:${jiraUserToken}`
      ).toString("base64");
      let jiraHost = `${strapi.config.get(
        "constants.JIRA_HOST_URL"
      )}/rest/api/3/issue`;
      let config = {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${authBuffer}`,
        },
        body: requestData ? JSON.stringify(requestData) : "",
      };
      // const jira_response = await jiraClient.issues.createIssue(requestData);
      const jira_response = await fetch(jiraHost, config);
      // logger.info(`request_config: ${JSON.stringify(config)}`);
      // logger.info(`jira_response: ${JSON.stringify(jira_response)}`);
      const new_res = await jira_response?.json();
      const { self, id } = new_res;
      // logger.info(`JIRA ISSUE CREATED`);
      try {
        const getConfig = {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${authBuffer}`,
          },
        };
        const jira_issue_response = await fetch(self?.toString(), getConfig);
        const issue = await jira_issue_response?.json();
        // const issue = await jiraClient.issues.getIssue({ issueIdOrKey: id });
        // logger.info(`NEW JIRA ISSUE DETAILS FETCHED`);
        if (!issue?.self?.toString()) {
          return new_res;
        }
        return issue;
      } catch (er) {
        errorResponse(ctx, er);
        return new_res;
      }
    } catch (error) {
      await errorResponse(ctx, error, "jira");
      return error?.errorMessages
        ? error?.errorMessages[0]
        : error?.response?.data;
    }
  },
  async jiraCreateMetaData(ctx, requestData) {
    try {
      const jiraUserName = process.env.JIRAUSERNAME;
      const jiraUserToken = process.env.JIRAUSERTOKEN;
      const urlEndpoint = `${strapi.config.get(
        "constants.JIRA_HOST_URL"
      )}/rest/api/3/issue/createmeta`;
      const authBuffer = new Buffer.from(
        `${jiraUserName}:${jiraUserToken}`
      ).toString("base64");
      const config = {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${authBuffer}`,
        },
      };
      const jira_response = await fetch(urlEndpoint, config);
      const res = await jira_response?.json();
      return res;
    } catch (error) {
      await errorResponse(ctx, error, "jira");
    }
  },
  async jiraGetIssueDetails(ctx, requestData) {
    try {
      const jiraUserName = process.env.JIRAUSERNAME;
      const jiraUserToken = process.env.JIRAUSERTOKEN;
      const urlEndpoint = `${strapi.config.get(
        "constants.JIRA_HOST_URL"
      )}/rest/api/3/issue/${requestData.jiraIssueID}`;
      const authBuffer = new Buffer.from(
        `${jiraUserName}:${jiraUserToken}`
      ).toString("base64");
      const config = {
        method: "get",
        // url: urlEndpoint,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${authBuffer}`,
        },
      };
      const jira_response = await fetch(urlEndpoint, config);
      const res = await jira_response?.json();
      return res;
    } catch (error) {
      await errorResponse(ctx, error, "jira");
    }
  },
  async getJiraStatuses(ctx, requestData) {
    try {
      const jiraUserName = process.env.JIRAUSERNAME;
      const jiraUserToken = process.env.JIRAUSERTOKEN;
      const urlEndpoint = `${strapi.config.get(
        "constants.JIRA_HOST_URL"
      )}/rest/api/3/statuses/search`;
      const authBuffer = new Buffer.from(
        `${jiraUserName}:${jiraUserToken}`
      ).toString("base64");
      const config = {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${authBuffer}`,
        },
      };
      const jira_response = await fetch(urlEndpoint, config);
      const res = await jira_response?.json();
      logger.info(`Jira Statuses Sync: ${res.maxResults}`);
      return res;
    } catch (error) {
      await errorResponse(ctx, error, "jira");
    }
  },
  async jiraGetIssueTypeDetails(ctx, requestData) {
    try {
      const jiraUserName = process.env.JIRAUSERNAME;
      const jiraUserToken = process.env.JIRAUSERTOKEN;
      const urlEndpoint = `${strapi.config.get(
        "constants.JIRA_HOST_URL"
      )}/rest/api/3/issuetype/${requestData.jiraIssueID}`;
      const authBuffer = new Buffer.from(
        `${jiraUserName}:${jiraUserToken}`
      ).toString("base64");
      const config = {
        method: "get",
        // url: urlEndpoint,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${authBuffer}`,
        },
      };
      const jira_response = await fetch(urlEndpoint, config);
      const res = await jira_response?.json();
      return res;
    } catch (error) {
      await errorResponse(ctx, error, "jira");
      return error?.errorMessages
        ? error?.errorMessages[0]
        : error?.response?.data;
    }
  },
  async jiraGetAllIssueDetails(ctx, requestData) {
    try {
      const jiraUserName = process.env.JIRAUSERNAME;
      const jiraUserToken = process.env.JIRAUSERTOKEN;
      const dateF = sub(new Date(), {
        days: 2,
      });
      const dateFilter = format(dateF, "yyyy-MM-dd");
      let urlEndpoint = `${strapi.config.get(
        "constants.JIRA_HOST_URL"
      )}/rest/api/3/search`;
      if (requestData.isCronJob) {
        urlEndpoint =
          urlEndpoint +
          `?jql= created >= ${dateFilter} AND reporter=${requestData.accountId}`;
      } else {
        urlEndpoint =
          urlEndpoint +
          `?jql=${strapi.config.get(
            "constants.RESOLUTION_STATUS_Q"
          )} reporter=${requestData.accountId}`;
      }
      const authBuffer = new Buffer.from(
        `${jiraUserName}:${jiraUserToken}`
      ).toString("base64");
      const config = {
        method: "get",
        // url: urlEndpoint,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${authBuffer}`,
        },
      };
      const jira_response = await fetch(urlEndpoint, config);
      const res = await jira_response?.json();
      return res;
    } catch (error) {
      await errorResponse(ctx, error, "jira");
    }
  },
};
