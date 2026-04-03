import { Flex, Typography } from '@strapi/design-system';
import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';

export default function ConfirmChangeAdTypeModal({
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
      label="confirm-change-ad-type-title"
    >
      <Flex direction="column" gap={2}>
        <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          Change Ad Type?
        </Typography>
        <Typography style={{ fontSize: '16px' }}>
          Changing the ad type will remove the currently uploaded image. Please review your changes
          before continuing.
        </Typography>
      </Flex>
    </CustomModal>
  );
}
