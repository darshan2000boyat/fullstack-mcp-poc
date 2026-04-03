// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';
import getTimeframeDate from '../../utils/getTimeframeDate';
import { startOfToday } from 'date-fns';
import { formatDateToString } from '../../utils/formatDate';

const useAdGraph = ({ page = 1, pageSize = 7, id, startDate, endDate }) => {
  const { get } = useFetchClient();

  const filters = {
    ad_id: id,
    start_date: formatDateToString(startDate),
    end_date: formatDateToString(endDate),
  };

  const query = qs.stringify(
    {
      filters,
    },
    { encodeValuesOnly: true }
  );

  const { data, error, isLoading, mutate } = useSWR(['ad-graph', id, startDate, endDate], () =>
    get(`/${pluginId}/ad/graph?${query}`)
  );

  return {
    adGraph: data?.data?.results ? [...data?.data?.results].reverse() : [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useAdGraph;
