// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import qs from 'qs';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import formatDateToString from '../../utils/formatDate';

const useAdModuleStats = ({ startDate, endDate } = {}) => {
  const { get } = useFetchClient();

  const filters = {
    start_date: formatDateToString(startDate),
    end_date: formatDateToString(endDate),
  };

  const query = qs.stringify(
    {
      filters,
    },
    { encodeValuesOnly: true }
  );

  const { data, error, isLoading, mutate } = useSWR(
    startDate ? ['overall-stats-analytics', startDate, endDate] : null,
    () => get(`/${pluginId}/campaign/stat-analytics?${query}`)
  );

  return {
    stats: data?.data?.data?.stats || [],
  };
};

export default useAdModuleStats;
