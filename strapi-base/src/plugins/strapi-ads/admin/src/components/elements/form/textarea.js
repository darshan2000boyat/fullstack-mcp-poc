import React from 'react';
import { Textarea, Box, Flex, Typography } from '@strapi/design-system';
import { useFormContext, Controller } from 'react-hook-form';

const FormTextArea = ({
  name,
  label = 'Label',
  placeholder = '',
  error,
  disabled = false,
  style,
  maxLength,
  showCharCount = false,
  isViewMode = false,

  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const currentLength = field.value?.length || 0;
        const shouldShowCount = showCharCount && maxLength;
        if (isViewMode) {
          return (
            <Flex justifyContent="flex-start" alignItems="flex-start" direction="column">
              {label && (
                <Typography variant="pi" style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
                  {label}
                </Typography>
              )}
              <Typography
                style={{
                  fontSize: 14,
                  color: '#32324D',
                  padding: 0,
                  background: 'transparent',
                  border: 'none',
                }}
              >
                {field.value || '-'}
              </Typography>
            </Flex>
          );
        }

        return (
          <Box>
            {shouldShowCount && (
              <Flex justifyContent="space-between" marginBottom={1}>
                <Typography style={{ fontWeight: 600, fontSize: 12 }}>{label}</Typography>
                <Typography
                  variant="pi"
                  textColor={currentLength > maxLength ? 'danger600' : 'neutral400'}
                  style={{ fontSize: '12px' }}
                >
                  {currentLength}/{maxLength}
                </Typography>
              </Flex>
            )}
            <Textarea
              {...field}
              label={shouldShowCount ? '' : label}
              name={name}
              placeholder={placeholder}
              error={error}
              disabled={disabled}
              style={{
                ...(style || {}),
                ...(disabled
                  ? {
                      border: 'none !important',
                      boxShadow: 'none !important',
                      color: '#62627B',
                      cursor: 'not-allowed',
                    }
                  : {}),
              }}
              {...props}
            />
          </Box>
        );
      }}
    />
  );
};

export default FormTextArea;
