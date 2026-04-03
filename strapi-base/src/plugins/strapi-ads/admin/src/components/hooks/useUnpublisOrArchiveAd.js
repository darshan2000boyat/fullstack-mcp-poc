// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import { CheckCircle } from '@strapi/icons';
import { toast } from 'sonner';
import pluginId from '../../pluginId';

const SUCCESS_MESSAGES = {
  inactive: 'Ad Successfully Unpublished!',
  archived: 'Ad Successfully Archived!',
  unarchived: 'Ad Successfully Unarchived!',
};

const useUnpublishOrArchiveAd = () => {
  const { post } = useFetchClient();

  const updateAdStatus = async ({
    adId,
    status, // 'inactive' | 'archived' | 'live'
    onComplete,
    messageKey, // optional override for success message key
  }) => {
    try {
      const selected = status === 'live' ? true : false;
      const result = await post(`/${pluginId}/ad/${adId}/update-status`, {
        data: { ad_status: status, selected },
      });

      const message = SUCCESS_MESSAGES[messageKey || status];
      toast.success(message, {
        icon: <CheckCircle color="success500" />,
        position: 'top-center',
        style: { background: '#eafbe7' },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ?? error.message ?? 'Something went wrong!',
        {
          position: 'top-center',
        }
      );
    } finally {
      onComplete?.();
    }
  };

  return { updateAdStatus };
};

export default useUnpublishOrArchiveAd;
