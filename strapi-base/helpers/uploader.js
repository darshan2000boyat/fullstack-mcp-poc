// @ts-nocheck
const _ = require("lodash");
const fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs");
const stream = require("stream");
const path = require("path");
const promisify = require("util").promisify;
const mime = require("mime-types");

const { default: logger } = require("./logger");

module.exports = {
  async uploadToLibrary(imageByteStreamURL, id, model, field) {
    if (strapi.config.get("constants.NO_IMAGE_SYNC")) {
      return false;
    }
    try {
      let config = {
        method: "GET",
        url: imageByteStreamURL,
        responseType: "stream",
        headers: {},
      };
      let imageData = "";
      if (field == "EventImage")
        config.headers.ApiKey = `${process.env.REMOTE_EVENT_API_TOKEN}`;
      if (field === "EmployeeVCardQRCode") {
        config.url = `
          ${strapi.config.get(
            "constants.REMOTE_QR_IMAGE_URL"
          )}${imageByteStreamURL}.png`?.trim();
        try {
          const response = await fetch(config.url, {
            method: "GET",
            responseType: "stream",
          });
          imageData = await response?.body;
        } catch (error) {
          logger.info(
            `Uploader VCardQrCode Node-Fetch Error: `,
            JSON.stringify(config.url)
          );
          await errorResponse(null, error);
        }
      } else if (field === "EmployeeImage") {
        const req = {
          code: null,
          endpointURL: imageByteStreamURL,
        };
        imageData = await getRemoteNtmlImage(req);
      } else {
        try {
          const response = await fetch(config.url, {
            method: "GET",
            responseType: "stream",
          });
          imageData = await response?.body;
        } catch (error) {
          logger.info(`Uploader Node-Fetch Error`);
        }
      }
      let extension = "png";
      const currentDate = new Date();
      if (imageData) {
        if (imageData?.headers && imageData?.headers["content-type"]) {
          extension = mime.extension(imageData?.headers["content-type"]);
        }
        if (imageData?.body) {
          try {
            const filePath = `./public/uploads/strapiImage_${currentDate.getTime()}.${extension}`;
            fs.writeFile(filePath, imageData.body, function (err) {
              if (err) return console.log("error writing file");
              console.log(
                `strapiImage_${currentDate.getTime()}.${extension} saved!`
              );
            });
            await this.upload(filePath, "uploads", id, model, field);
            return true;
          } catch (error) {
            logger.info(`Uploader Upload to Minio Error`);
            await errorResponse(null, error);
          }
        } else {
          const filePath = `./public/uploads/strapiImage_${currentDate.getTime()}.${extension}`;
          const file = fs.createWriteStream(filePath);
          const finished = promisify(stream.finished);
          imageData.pipe(file);
          await finished(file);
          try {
            await this.upload(filePath, "uploads", id, model, field);
            return true;
          } catch (error) {
            logger.info(`Uploader Upload to Minio Error`);
            await errorResponse(null, error);
          }
        }
        logger.info(`Image ${field} Added: ${imageByteStreamURL}`);
      } else false;
    } catch (error) {
      console.log(error);
      logger.info(`Uploader Error`);
      await errorResponse(null, error);
      return null;
    }
  },
  async upload(filePath, saveAs, id, model, field) {
    const stats = await this.getFileDetails(filePath);
    const fileName = path.parse(filePath).base;

    const files = {
      path: filePath,
      name: fileName,
      type: mime.lookup(filePath),
      size: stats.size,
    };
    const uploadService = strapi.plugin("upload").service("upload");
    const res = await uploadService.uploadToEntity(
      {
        id: id,
        model: model,
        field: field,
        //source: "users-permissions"
      },
      files
    );

    await this.deleteFile(filePath);
    return _.first(res);
  },
  async uploadFileToStrapi(filePath, destinationFolder) {
    // if (!fs.existsSync(destinationFolder)) fs.mkdirSync(destinationFolder);
    const stats = await getFileDetails(filePath);
    const fileName = path.parse(filePath).base;
    const folderService = strapi.plugins.upload.services.folder;
    // FOLDER - CREATE IF NOT EXISTS
    let strapiUploadFolder = await strapi
      .query("plugin::upload.folder")
      .findOne({
        where: {
          $or: [{ name: destinationFolder }, { path: destinationFolder }],
        },
      });
    if (!strapiUploadFolder) {
      await folderService.create({ name: destinationFolder });
      strapiUploadFolder = await strapi
        .query("plugin::upload.folder")
        .findOne({ where: { name: destinationFolder } });
    }
    const res = await strapi.plugins.upload.services.upload.upload({
      data: {
        path: destinationFolder,
        fileInfo: { folder: strapiUploadFolder.id },
      },
      files: {
        path: filePath,
        name: fileName,
        type: mime.lookup(filePath),
        size: stats.size,
      },
    });

    await deleteFile(filePath);
    return _.first(res);
  },

  getHttpsUrl(url) {
    if (!url.startsWith("https")) {
      let httpsUrl = url.replace("http", "https");
      return httpsUrl;
    }
    return url;
  },

  async getFile(name) {
    const file = await strapi.plugins.upload.services.upload.findMany({ name });
    return file;
  },

  async getQRcode(barcode, fileName) {
    let qrCode = await this.generateQRCode(barcode, fileName);
    //return qrCode.url;
    return qrCode;
  },
  async decodeBase64Image(dataString, type = "application/vnd.apple.pkpass") {
    const response = {};
    response.type = type;
    response.data = Buffer.from(dataString, "base64");
    return response;
  },

  async decodeByteData(dataString) {
    const response = {};
    response.data = Buffer.from(dataString, "byte");
    return response;
  },
};

function getFileDetails(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) reject(err.message);
      resolve(stats);
    });
  });
}

function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) reject(err.message);
      resolve("deleted");
    });
  });
}
