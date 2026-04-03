// @ts-nocheck
const logger = require("./logger").default;
const emailModel = "api::email-template.email-template";
const { format } = require("date-fns");
const fs = require("fs");
const path = require("path");
const emailTemplateModel = "api::email-template.email-template";
const mustache = require("mustache");
const _ = require("lodash");
const utils = require("@strapi/utils");
const { ApplicationError } = utils.errors;

const compileTemplate = async (templatePath) => {
  const template = fs.readFileSync(templatePath, "utf8");
  return _.template(template);
};

module.exports = {
  /**
   * Sends email with html email template
   */
  async sendEmail(type, data, user, localeCode) {
    try {
      logger.info("Send email - Start");
      const eTemplate = await strapi
        .query(emailTemplateModel)
        .findOne({ where: { type, locale: localeCode ? localeCode : "en" } });

      if (!eTemplate) {
        throw new ApplicationError("No template found for email template");
      }
      let emailBody = mustache.render(eTemplate.content, data);
      const emailSubject = mustache.render(eTemplate.subject, data);

      const emailToSend = {
        to: user.email,
        from:
          eTemplate.from_email || eTemplate.from_name
            ? `${eTemplate.from_name} <${eTemplate.from_email}>`
            : undefined,
        replyTo: eTemplate.response_email,
        subject: emailSubject,
        text: emailBody,
        html: await module.exports.emailWrapper(emailBody, localeCode),
      };

      // Send an email to the user.
      //logger.info('Send email');
      //logger.info(emailToSend);
      await strapi.plugin("email").service("email").send(emailToSend);
    } catch (error) {
      console.log("EmailAPI-ErrorResponse:", error);

      logger.info("EmailAPI-ErrorResponse:");
      logger.info(error);
      return { IsSuccess: "false" };
    }
  },

  async sendEmailForms(data, localeCode = "en") {
    try {
      const { to, from_email = null, subject, html, isAdmin } = data;
      const emailToSend = {
        to,
        from: from_email ? from_email : undefined,
        // replyTo: eTemplate.response_email,
        subject,
        text: html,
        html: await module.exports.emailWrapper(html, isAdmin, localeCode),
      };
      logger.info(emailToSend);
      const res = await strapi
        .plugin("email")
        .service("email")
        .send(emailToSend);
      logger.info("Email Response:", res);
    } catch (error) {
      logger.info("EmailAPI-ErrorResponse:");
      logger.info(error);
      console.log("EmailAPI-ErrorResponse:", error);
      return { IsSuccess: "false" };
    }
  },

  async emailWrapper(content, isAdmin, localeCode = "en") {
    const sendCustomMail = strapi.config.get("constants.SEND_CUSTOM_MAIL");
    if (sendCustomMail == "false") {
      return content;
    }
    let templatePath = path.join(
      __dirname,
      ".",
      "template",
      localeCode == "en" ? "email.html" : "email-ar.html"
    );
    if (isAdmin) {
      templatePath = path.join(
        __dirname,
        ".",
        "template",
        localeCode == "en" ? "email-admin.html" : "email-admin-ar.html"
      );
    }

    if (!fs.existsSync(templatePath)) {
      throw new ApplicationError("Template file does not exist");
    }

    content = await module.exports.templatifyContent(content);

    const compiledTemplate = await compileTemplate(templatePath);
    return compiledTemplate({ content });
  },

  async templatifyContent(content) {
    // @ts-ignore

    // Define the styles to apply to <p> and <h1> tags
    const pStyle =
      "font-weight: 400;font-size: 15px;line-height: 24px;text-align: center;letter-spacing: 1px;color: #FFFFFF;margin: 0;border-top: 16px solid transparent;border-right: 60px solid transparent;border-left: 60px solid transparent;border-bottom: 16px solid transparent;opacity: 0.4;";

    // Apply styles to <p> tags
    content = content.replace(/<p>/g, `<p style="${pStyle}">`);

    // Replace <a> tags (for the OTP) with a styled <p> and <a>
    content = content.replace(
      /<a href="(.*?)">(.*?)<\/a>/g,
      `
    <p style="border-top: 16px solid transparent; text-align: center;">
        <a href="$1" style=" 
            background:#0E84F1;
            background: linear-gradient(96.09deg, #00A7BB 11.89%, #0E84F1 103.69%);
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            text-align: center;
            width: 280px;
            color: #FFFFFF;
            text-decoration: none;
            padding: 18px 27px;
            margin: 0;
        " target="_blank">$2</a> 
    </p>
    `
    );

    return content;
  },
};
