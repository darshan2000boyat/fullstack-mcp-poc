// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import { CheckCircle } from '@strapi/icons';
import pluginId from '../../pluginId';
import { toast } from 'sonner';
import { mutate } from 'swr';

const SUCCESS_MESSAGES = {
  inactive: 'Campaign Successfully Unpublished!',
  archived: 'Campaign Successfully Archived!',
  unarchived: 'Campaign Successfully Unarchived!',
};

const useUnpublishOrArchiveCampaign = () => {
  const { post } = useFetchClient();

  const updateCampaignStatus = async ({
    campaignId,
    status, // 'inactive' | 'archived'
    onComplete,
    messageKey, // optional override for success message key
  }) => {
    try {
      const result = await post(`/${pluginId}/campaign/${campaignId}/update-status`, {
        data: { campaign_status: status },
      });

      mutate(['campaigns']);
      mutate(['campaign', campaignId]);

      const message = SUCCESS_MESSAGES[messageKey || status];
      toast.success(message, {
        icon: <CheckCircle color="success500" />,
        position: 'top-center',
        style: { background: '#eafbe7' },
      });
    } catch (error) {
      console.log(error);
      toast.error('Failed to Update Campaign!', {
        icon: <CheckCircle color="danger500" />,
        position: 'top-center',
        style: { background: '#fbeaf7' },
      });
    } finally {
      onComplete?.();
    }
  };

  return { updateCampaignStatus };
};

export default useUnpublishOrArchiveCampaign;
