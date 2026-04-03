import React from 'react';
import { Box } from '@strapi/design-system';

const CustomIconButton = ({ children, onClick, ariaLabel, isDark = false, disabled = false }) => (
  <Box
    as="button"
    onClick={onClick}
    aria-label={ariaLabel}
    disabled={disabled}
    background="neutral0"
    borderColor="neutral200"
    hasRadius
    padding={1}
    cursor={disabled ? 'not-allowed' : 'pointer'}
    style={{
      height: '32px',
      width: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </Box>
);

export default CustomIconButton;
