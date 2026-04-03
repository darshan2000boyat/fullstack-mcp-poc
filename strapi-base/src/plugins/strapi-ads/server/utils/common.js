const _ = require('lodash');
const {parseISO,eachDayOfInterval,format,isMonday,addDays}=require("date-fns");

const deepOmit = (obj, keys) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepOmit(item, keys));
  } else if (obj !== null && typeof obj === 'object') {
    return _.omit(
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepOmit(v, keys)])),
      keys
    );
  }
  return obj;
};

const formatStat = (num) => {
  if (num === null || num === undefined) return "";

  const abs = Math.abs(num);

  if (abs >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (abs >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (abs >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return num.toString();
}


const fillMissingDates = (results) => {
  // Convert stat_date to numbers and sort
  const dates = results.map(r => r.stat_date);
  const minDate = parseISO(dates[dates.length - 1]);
  const maxDate = parseISO(dates[0]);

  // Create a map for quick lookup
  const dateMap = new Map(results.map(r => [r.stat_date, r]));

  const allDates = eachDayOfInterval({ start: minDate, end: maxDate })
  .map(d => format(d, 'yyyy-MM-dd'))
  .reverse();

  const filledResults = allDates.map(dateStr =>
      dateMap.get(dateStr) || { stat_date: dateStr, clicks: 0, impressions: 0, filler: true }
  );
  return filledResults;
};

const fillMondayDates = (results) => {
  const dates = results.map(r => r.stat_date);
  const minDate = parseISO(dates[dates.length - 1]);
  const maxDate = parseISO(dates[0]);

  // Generate all Mondays in the interval
  const allMondays = eachDayOfInterval({ start: minDate, end: maxDate })
  .filter(d => isMonday(d))
  .map(d => format(d, 'yyyy-MM-dd'))
  .reverse();

  const dateMap = new Map(results.map(r => [r.stat_date, r]));

  return allMondays.map(dateStr =>
      dateMap.get(dateStr) || { stat_date: dateStr, clicks: 0, impressions: 0, filler: true }
  );
}

const addLabels = (results, view = 'day') => {
  return results.map(r => {
    if (view === 'week') {
      const start = parseISO(r.stat_date);
      const end = addDays(start, 6);
      return {
        ...r,
        label: `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`
      };
    } else {
      const date = parseISO(r.stat_date);
      return {
        ...r,
        label: format(date, 'MMM d')
      };
    }
  });
}


module.exports = { deepOmit, formatStat, fillMissingDates, fillMondayDates, addLabels };
