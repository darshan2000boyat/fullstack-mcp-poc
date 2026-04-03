import { Flex, Typography } from '@strapi/design-system';
import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';

export default function ConfirmChangeMediaTabModal({
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
      label="confirm-change-media-tab-title"
    >
      <Flex direction="column" gap={2}>
        <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          Change Media Tab?
        </Typography>
        <Typography style={{ fontSize: '16px' }}>
          Changing the media tab will remove the currently uploaded media. Please review your
          changes before continuing.
        </Typography>
      </Flex>
    </CustomModal>
  );
}
