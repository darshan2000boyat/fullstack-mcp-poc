import { Flex, Typography } from '@strapi/design-system';
import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';

export default function EditCampaignModal({
  isOpen,
  isPublish,
  setIsOpen,
  onSubmit,
  adsCount,
  disabled,
}) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      disabled={disabled}
      label="edit-campaign-title"
    >
      <Flex direction="column" gap={2}>
        <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          {isPublish ? 'Publish' : 'Unpublish'} {adsCount === 1 ? 'Ad' : 'Ads'}?
        </Typography>
        <Typography style={{ fontSize: '16px' }}>
          {`You're ready to ${isPublish ? 'publish' : 'unpublish'} ${adsCount} ${adsCount === 1 ? 'Ad' : 'Ads'}. Please double-check everything to ensure it's all set before you confirm.`}{' '}
        </Typography>
      </Flex>
    </CustomModal>
  );
}
