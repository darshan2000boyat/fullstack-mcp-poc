// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';
import getTimeframeDate from '../../utils/getTimeframeDate';

import formatDateToString from '../../utils/formatDate';

const useAdModuleDashboardStats = ({

                            status,
                            type,
                            time,
                                       search
                          }) => {
  const { get } = useFetchClient();
  const timeframeDate = getTimeframeDate(time);
    const cleanStatus = status?.filter(Boolean);

  const filters = {
      ...(type !== '' && { ads: { ad_type: type } }),
      ...(cleanStatus?.length > 0 && { campaign_status: cleanStatus }),
      ...(search && { campaign_name: { $containsi: search } }),
      ...(time && { start_date:timeframeDate  }),
  };


  const query = qs.stringify(
      {
        filters,
      },
      { encodeValuesOnly: true }
  );

  const { data, error, isLoading, mutate } = useSWR(['overall-dash-stats',status, type, time, search], () =>
    get(`/${pluginId}/campaign/stat-overall?${query}`,)
  );
  return {
    stats: data?.data?.data?.stats || [],
  };
};

export default useAdModuleDashboardStats;
