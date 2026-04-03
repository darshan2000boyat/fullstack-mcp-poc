import { subDays, subMonths, subYears ,format} from 'date-fns';

const getTimeframeDate = (timeframe) => {
  const now = new Date();
  let date;

  switch (timeframe) {
    case 'last_7_days':
      return subDays(now, 6);
    case 'last_30_days':
      return subDays(now, 29);
    case 'last_3_months':
      date=subMonths(now, 3);
      break;

    case 'last_6_months':
      date= subMonths(now, 6);
      break;

    case 'last_year':
      date= subYears(now, 1);
      break;

    default:
      return null

  }

  return format(date, 'yyyy-MM-dd');
};

export default getTimeframeDate;
