import { Button, ModalBody, ModalFooter, ModalHeader, ModalLayout } from '@strapi/design-system';
import * as React from 'react';
import styled from 'styled-components';

const HighZIndexModal = styled(ModalLayout)`
  & > div {
    /* ModalWrapper */
    z-index: 9999 !important;
  }
`;

export default function CustomModal({
  isOpen,
  bodyAlign = 'center',
  setIsOpen,
  onSubmit,
  children,
  label,
  onCancel = () => setIsOpen(false),
  disabled = false,
  endActionOkayLabel = false,
  submitButtonLabel = '',
}) {
  return (
    <>
      {isOpen && (
        <HighZIndexModal width="32rem" maxWidth="90%" onClose={onCancel} labelledBy={label}>
          <ModalHeader closeLabel="Close modal">
            <span></span>{' '}
          </ModalHeader>

          <ModalBody style={{ textAlign: bodyAlign, padding: '62px 25px' }}>{children}</ModalBody>

          <ModalFooter
            startActions={
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            }
            endActions={
              <Button disabled={disabled} variant="primary" onClick={onSubmit}>
                {submitButtonLabel ? submitButtonLabel : endActionOkayLabel ? 'Okay' : 'Confirm'}
              </Button>
            }
          />
        </HighZIndexModal>
      )}
    </>
  );
}
