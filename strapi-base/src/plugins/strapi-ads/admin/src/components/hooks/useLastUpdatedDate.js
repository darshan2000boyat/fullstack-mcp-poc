// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';

const useLastUpdatedDate = () => {
  const { get } = useFetchClient();

  const { data, error, isLoading, mutate } = useSWR(
    ['get-sync-stats-status'],
    () => get(`/${pluginId}/campaign/get-sync-stats-status`),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  );

  return {
    lastUpdated: data?.data?.last_sync || null,
    inProgress: data?.data?.stat_sync_in_progress || false,
    mutate,
  };
};

export default useLastUpdatedDate;
