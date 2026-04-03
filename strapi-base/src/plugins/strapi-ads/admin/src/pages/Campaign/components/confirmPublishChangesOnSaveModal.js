import { Flex, Typography } from '@strapi/design-system';
import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';

export default function ConfirmPublishChangesOnSaveModal({
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
      bodyAlign="left"
      label="confirm-change-ad-type-title"
    >
      <Flex direction="column" gap={2}>
        <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          Active Campaign
        </Typography>
        <Typography>
          This campaign is currently active. Any live ad saved will be published immediately.
        </Typography>
      </Flex>
    </CustomModal>
  );
}
