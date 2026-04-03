// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';
import getTimeframeDate from '../../utils/getTimeframeDate';
import { startOfToday } from 'date-fns';
import { formatDateToString } from '../../utils/formatDate';

const useOverallGraph = ({ startDate, endDate } = {}) => {
  const { get } = useFetchClient();

  const hasDates = Boolean(startDate && endDate);

  const filters = {
    start_date: startDate ? formatDateToString(startDate) : undefined,
    end_date: endDate ? formatDateToString(endDate) : undefined,
  };

  const query = qs.stringify({ filters }, { encodeValuesOnly: true });

  const { data, error, isLoading, mutate } = useSWR(
    hasDates ? ['overall-graph', startDate, endDate] : null,
    hasDates ? () => get(`/${pluginId}/overall/graph?${query}`) : null
  );

  return {
    overallGraph: data?.data?.results ? [...data.data.results].reverse() : [],
    isLoading: hasDates ? isLoading : false,
    isError: !!error,
    error,
    mutate,
  };
};

export default useOverallGraph;
