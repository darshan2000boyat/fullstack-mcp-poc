import { Typography } from '@strapi/design-system';
import React, { useEffect, useRef, useState } from 'react';
import useSyncStat from '../../components/hooks/useSyncStat';
import useLastUpdatedDate from '../../components/hooks/useLastUpdatedDate';
import { format } from 'date-fns';

const LastUpdatedTimeAndRefresh = () => {
  const { lastUpdated, inProgress, mutate } = useLastUpdatedDate();
  const { handleSync, isLoading: isSyncing } = useSyncStat();
  const prevInProgress = useRef(inProgress);
  const [showSyncedMsg, setShowSyncedMsg] = useState(false);
  const pollingTimer = useRef(null);

  const handleRefreshStats = async () => {
    await handleSync();
    mutate();
  };

  // Poll for sync status if inProgress is true
  useEffect(() => {
    if (inProgress) {
      pollingTimer.current = setInterval(() => {
        mutate();
      }, 120000); // 120 seconds
    } else {
      if (pollingTimer.current) {
        clearInterval(pollingTimer.current);
        pollingTimer.current = null;
      }
    }
    return () => {
      if (pollingTimer.current) {
        clearInterval(pollingTimer.current);
        pollingTimer.current = null;
      }
    };
  }, [inProgress, mutate]);

  useEffect(() => {
    // Detect transition from inProgress true -> false
    if (prevInProgress.current && !inProgress) {
      setShowSyncedMsg(true);
    }
    prevInProgress.current = inProgress;
  }, [inProgress]);

  return (
    <Typography
      textColor="neutral600"
      style={{
        fontSize: '12px',
      }}
      variant="pi"
    >
      {showSyncedMsg
        ? 'Data is synced, refresh the page.'
        : inProgress
          ? 'Last updated : Sync in progress this will take a while'
          : lastUpdated
            ? `Last updated : ${format(new Date(lastUpdated), 'dd/MM/yyyy hh:mm a')}`
            : ''}
      {!inProgress && !showSyncedMsg && (
        <>
          &nbsp;{' '}
          <span
            onClick={!isSyncing && !inProgress ? handleRefreshStats : undefined}
            role="button"
            aria-disabled={isSyncing || inProgress}
            style={{
              color: isSyncing || inProgress ? '#b5b5b5' : '#4945FF',
              cursor: isSyncing || inProgress ? 'not-allowed' : 'pointer',
              textDecoration: 'underline',
              pointerEvents: isSyncing || inProgress ? 'none' : 'auto',
            }}
            title="Refresh data"
          >
            Refresh data
          </span>
        </>
      )}
    </Typography>
  );
};

export default LastUpdatedTimeAndRefresh;
