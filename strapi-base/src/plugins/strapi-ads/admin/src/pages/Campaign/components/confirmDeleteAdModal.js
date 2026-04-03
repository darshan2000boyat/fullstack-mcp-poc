import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';
import { Typography, Flex } from '@strapi/design-system';

export default function ConfirmDeleteAdModal({ isOpen, setIsOpen, onSubmit }) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      label="confirm-delete-title"
    >
      <Flex direction="column" gap={2}>
        <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          Delete Ad?
        </Typography>
        <Typography style={{ fontSize: '16px' }}>
          This will delete the selected Ad, making it permanently removed from the system.
        </Typography>
      </Flex>
    </CustomModal>
  );
}
