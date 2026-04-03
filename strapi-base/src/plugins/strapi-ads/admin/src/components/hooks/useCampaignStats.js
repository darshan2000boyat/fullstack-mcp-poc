// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';
import formatDateToString from '../../utils/formatDate';

const useCampaignStats = (id,startDate,endDate) => {
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

  const { data, error, isLoading, mutate } = useSWR(['campaign-stats', id,startDate,endDate], () =>
    get(`/${pluginId}/campaign/stat/${id}?${query}`)
  );

  return {
    stats: data?.data?.data?.stats || [],
  };
};

export default useCampaignStats;
