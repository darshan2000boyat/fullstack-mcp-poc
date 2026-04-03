"use strict";

const _ = require("lodash");
const path = require("path");
const mime = require("mime-types");

module.exports = () => async (ctx, next) => {
  let filesArray = [];
  const allowedExtensions = [
    ".jpeg",
    ".jpg",
    ".png",
    ".gif",
    ".tiff",
    ".webp",
    ".pdf",
    ".doc",
    ".docx",
    ".svg",
    ".heic",
  ];
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "image/gif",
    "image/tiff",
    "image/webp",
    "image/heic",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const blockedExtensions = [
    ".html",
    ".js",
    ".php",
    ".sh",
    ".exe",
    ".bat",
    ".dll",
    ".jar",
    ".swf",
    ".asp",
    ".py",
    ".pl",
    ".sql",
    ".json",
    ".yaml",
    ".xml",
    ".c",
    ".cpp",
  ];

  if (ctx.request.files && ctx.request.is("multipart")) {
    filesArray = _.values(ctx.request.files || {});
    _.forEach(filesArray, (file) => {
      const files = _.isArray(file) ? file : [file];
      _.forEach(files, (file) => {
        if (file) {
          const { type, name } = file;
          const fileExtension = path.extname(name).toLowerCase();
          if (
            !allowedMimeTypes.includes(type) ||
            !allowedExtensions.includes(fileExtension) ||
            blockedExtensions.includes(fileExtension)
          ) {
            ctx.throw(400, `Unsupported file type: ${name}`);
          }
          const guessedMimeType = mime.lookup(fileExtension);
          if (guessedMimeType && guessedMimeType !== type) {
            ctx.throw(
              400,
              `File type mismatch: ${name} has a MIME type of ${type}, but expected ${guessedMimeType}`
            );
          }
        }
      });
    });
  }

  await next();
};
