import { useFetchClient } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import { toast } from 'sonner';
import { useState } from 'react';
import { CheckCircle } from '@strapi/icons';

const useSyncStat = () => {
  const { post } = useFetchClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const res = await post(`/${pluginId}/campaign/sync-stats`);
      toast.success(res.data.message || 'Stats synced successfully.', {
        icon: <CheckCircle color="success500" />,
        position: 'top-center',
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ??
          error.message ??
          'An error occurred while syncing stats.',
        {
          position: 'top-center',
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSync, isLoading };
};

export default useSyncStat;
