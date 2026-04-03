import React from 'react';
import { Badge } from '@strapi/design-system';

const StatusBadge = ({ status }) => {
  const getDisplayText = (status) => {
    if (status === 'active-scheduled') return 'Active - Scheduled';
    if (status === 'live-scheduled') return 'Live - Scheduled';
    return status;
  };

  return (
    <Badge
      width="fit-content"
      backgroundColor={
        status === 'live' ||
        status === 'active' ||
        status === 'active-scheduled' ||
        status === 'live-scheduled'
          ? 'success100'
          : status === 'draft' || status === 'New'
            ? 'neutral100'
            : status === 'inactive'
              ? 'warning100'
              : status === 'expired' || status === 'archived'
                ? 'danger100'
                : ''
      }
      textColor={
        status === 'live' ||
        status === 'active' ||
        status === 'active-scheduled' ||
        status === 'live-scheduled'
          ? 'success500'
          : status === 'draft' || status === 'New'
            ? 'neutral600'
            : status === 'inactive'
              ? 'warning500'
              : status === 'expired' || status === 'archived'
                ? 'danger500'
                : ''
      }
    >
      {getDisplayText(status)}
    </Badge>
  );
};

export default StatusBadge;
