// @ts-nocheck
const format = require('date-fns/format');
const parseISO = require('date-fns/parseISO');
const formatISO = require('date-fns/formatISO');
const addDays = require('date-fns/addDays');

module.exports = {
  ISOFormat(date) {
    /*eslint quotes: ["error", "single", { "avoidEscape": true }]*/

    if (!(date instanceof Date)) {
      // @ts-ignore
      date = parseISO(date);
    }
    return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
  },

  CustomFormat(date, required_format = "yyyy-MM-dd'T'00:00:00'Z'") {
    /*eslint quotes: ["error", "single", { "avoidEscape": true }]*/
    if (!(date instanceof Date)) {
      date = parseISO(date);
    }
    return format(date, required_format);
  },

  UTCStringInISOFormat(utcDateString) {
    return utcDateString.replace(/.\d+Z$/g, 'Z');
  },
};
