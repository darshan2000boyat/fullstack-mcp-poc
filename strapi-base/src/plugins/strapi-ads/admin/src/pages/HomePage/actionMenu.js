// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import React from 'react';

import { Flex, IconButton, Typography } from '@strapi/design-system';
import { CheckCircle, More } from '@strapi/icons';
import { useHistory } from 'react-router-dom';
import { toast } from 'sonner';
import { mutate } from 'swr';
import Archive from '../../components/Icons/Archive';
import Duplicate from '../../components/Icons/Duplicate';
import Edit from '../../components/Icons/Edit';
import Eye from '../../components/Icons/Eye';
import Pause from '../../components/Icons/Pause';
import pluginId from '../../pluginId';
import ConfirmArchiveModal from '../Components/confirmArchiveModal';
import ConfirmUnpublishModal from '../Components/confirmUnpublishModal';

import PopoverItemButton from '../../components/elements/popoverItemButton';
import useDarkMode from '../../components/hooks/useDarkMode';
import useUnpublishOrArchiveCampaign from '../../components/hooks/useUnpublisOrArchiveCampaign';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
const ActionMenu = ({ data, filters, cacheKey = 'default' }) => {
  const history = useHistory();
  const [isOpenArchiveCampaignModal, setIsOpenArchiveCampaignModal] = React.useState(false);
  const [isOpenUnpublishCampaignModal, setIsOpenUnpublishCampaignModal] = React.useState(false);
  const [openPopover, setOpenPopover] = React.useState(false);
  const { get, put } = useFetchClient();
  const { updateCampaignStatus } = useUnpublishOrArchiveCampaign();
  const isDarkMode = useDarkMode();
  const handleDuplicate = async () => {
    try {
      const response = await get(`/${pluginId}/get-campaigns/duplicate/${data.id}`);
      history.push(`campaigns/edit/${response?.data?.id}`);
      await mutate(
        [
          cacheKey,
          'campaigns',
          true,
          filters?.page || 1,
          filters?.pageSize || 10,
          filters?.status || [''],
          filters?.type || '',
          filters?.time || '',
          filters?.search || '',
          filters?.sort || { field: 'campaign_name', order: 'ASC' },
        ],
        undefined,
        { revalidate: true }
      );
      toast.success('Campaign Successfully Duplicated!', {
        icon: <CheckCircle color="success500" />,
        position: 'top-center',
      });
      setOpenPopover(false);
    } catch (error) {
      toast.error('Failed to Duplicate Campaign!', {
        icon: <CheckCircle color="danger500" />,
        position: 'top-center',
      });
    }
  };
  const handleUnpublish = async () => {
    updateCampaignStatus({
      campaignId: data.id,
      status: 'inactive',
      onComplete: async () => {
        setIsOpenUnpublishCampaignModal(false);
        setOpenPopover(false);

        // Mutate with current filters
        await mutate(
          [
            cacheKey,

            'campaigns',
            true,
            filters?.page || 1,
            filters?.pageSize || 10,
            filters?.status || [''],
            filters?.type || '',
            filters?.time || '',
            filters?.search || '',
            filters?.sort || { field: 'campaign_name', order: 'ASC' },
          ],
          undefined,
          { revalidate: true }
        );
      },
    });
  };

  const handleArchive = async (action = 'archive') => {
    const status = action === 'unarchive' ? 'inactive' : 'archived';
    const messageKey = action === 'unarchive' ? 'unarchived' : 'archived';

    updateCampaignStatus({
      campaignId: data.id,
      status: status,
      messageKey: messageKey,
      onComplete: async () => {
        setIsOpenArchiveCampaignModal(false);
        setOpenPopover(false);

        // Mutate with current filters
        await mutate(
          [
            cacheKey,

            'campaigns',
            true,
            filters?.page || 1,
            filters?.pageSize || 10,
            filters?.status || [''],
            filters?.type || '',
            filters?.time || '',
            filters?.search || '',
            filters?.sort || { field: 'campaign_name', order: 'ASC' },
          ],
          undefined,
          { revalidate: true }
        );
      },
    });
  };

  return (
    <>
      <ConfirmArchiveModal
        isOpen={isOpenArchiveCampaignModal}
        setIsOpen={setIsOpenArchiveCampaignModal}
        onSubmit={handleArchive}
      />
      <ConfirmUnpublishModal
        isOpen={isOpenUnpublishCampaignModal}
        setIsOpen={setIsOpenUnpublishCampaignModal}
        onSubmit={handleUnpublish}
      />

      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger>
          <IconButton onClick={() => setOpenPopover((v) => !v)}>
            <More />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <Flex
            background="neutral0"
            direction="column"
            style={{ padding: '8px 0px', width: '155px' }}
          >
            <PopoverItemButton onClick={() => history.push(`campaigns/edit/${data.id}`)}>
              <Typography textColor="neutral800">View Details</Typography>
              <Eye stroke={isDarkMode ? '#ffffff' : '#666687'} />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => history.push(`campaigns/edit/${data.id}`)}>
              <Typography textColor="neutral800"> Edit Campaign</Typography>
              <Edit stroke={isDarkMode ? '#fff' : '#666687'} />
            </PopoverItemButton>
            <PopoverItemButton onClick={handleDuplicate}>
              <Typography textColor="neutral800"> Duplicate</Typography>
              <Duplicate stroke={isDarkMode ? '#fff' : '#666687'} />
            </PopoverItemButton>
            <PopoverItemButton
              disabled={data?.campaign_status !== 'active'}
              onClick={() => setIsOpenUnpublishCampaignModal(true)}
            >
              <Typography textColor="neutral800">Unpublish</Typography>
              <Pause stroke={isDarkMode ? '#fff' : '#666687'} />
            </PopoverItemButton>
            {data?.campaign_status === 'archived' ? (
              <PopoverItemButton onClick={() => handleArchive('unarchive')}>
                <Typography textColor="neutral800">Unarchive</Typography>
                <Archive stroke={isDarkMode ? '#fff' : '#666687'} />
              </PopoverItemButton>
            ) : (
              <PopoverItemButton
                disabled={data?.campaign_status === 'archived'}
                onClick={() => setIsOpenArchiveCampaignModal(true)}
              >
                <Typography textColor="neutral800">Archive</Typography>
                <Archive stroke={isDarkMode ? '#fff' : '#666687'} />
              </PopoverItemButton>
            )}
          </Flex>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ActionMenu;
