import { Flex, Typography } from '@strapi/design-system';
import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';

export default function WarnAtLeastOneAdShouldBeSelectedModal({
  isOpen,
  setIsOpen,
  onSubmit,
  disabled,
  onCancel,
}) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      onCancel={onCancel}
      disabled={disabled}
      submitButtonLabel="Unpublish Campaign"
      label="no-active-ads-warning-title"
    >
      <Flex direction="column" gap={2}>
        {/* <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          No Active Ads
        </Typography> */}
        <Typography style={{ fontSize: '16px' }}>
          At least one ad must be selected to keep this campaign active. If you continue without
          selecting any ads, this campaign will be unpublished
        </Typography>
      </Flex>
    </CustomModal>
  );
}
