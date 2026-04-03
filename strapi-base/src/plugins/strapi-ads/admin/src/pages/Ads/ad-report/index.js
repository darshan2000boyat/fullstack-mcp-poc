// @ts-nocheck
import { Box, Button, Flex, Loader, Popover, Typography } from '@strapi/design-system';
import { More } from '@strapi/icons';
import Edit from '../../../components/Icons/Edit';

import React, { useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

import CustomBadge from '../../../components/elements/badge';
import DashboardCard from '../../../components/elements/dashboardcard';
import Archive from '../../../components/Icons/Archive';
import Download from '../../../components/Icons/Download';
import Pause from '../../../components/Icons/Pause';
import ClickThroughRateTrend from '../../Components/clickThroughRateTrend';
import ConfirmArchiveModal from '../../Components/confirmArchiveModal';
import ConfirmUnpublishModal from '../../Components/confirmUnpublishModal';
import PerformanceAnalytics from '../../Components/performanceAnalytics';

import BackButton from '../../../components/elements/backButton';
import CustomButton from '../../../components/elements/customButton';
import { format } from 'date-fns';

import previewImage from '../../../assets/previewImage.png';
import DateRangePicker from '../../../components/elements/form/dateRangePicker';
import StatusBadge from '../../../components/elements/statusBadge';
import useAd from '../../../components/hooks/useAd';
import useAdGraph from '../../../components/hooks/useAdGraph';
import useAdStats from '../../../components/hooks/useAdStats';
import useAdType from '../../../components/hooks/useAdType';
import useDarkMode from '../../../components/hooks/useDarkMode';
import useDownloadPdf from '../../../components/hooks/useDownloadPdf';
import useUnpublishOrArchiveAd from '../../../components/hooks/useUnpublisOrArchiveAd';
import pluginId from '../../../pluginId';
import { MAX_DAYS } from '../../../utils/constants';
import { useFetchClient } from '@strapi/helper-plugin';
import LastUpdatedTimeAndRefresh from '../../../components/elements/lastUpdatedTimeAndRefresh';
const PopoverItem = styled(Flex)`
  padding: 8px 16px;
  gap: 6px;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 9999;

  .loading-text {
    color: white;
    font-size: 16px;
  }
`;

const AdReport = () => {
  const { id } = useParams();
  const pdfRef = useRef();
  const downloadPdf = useDownloadPdf();

  const { adTypes } = useAdType();
  const [status, setStatus] = React.useState(['']);
  const [type, setType] = React.useState('');
  const [dateRange, setDateRange] = React.useState('');
  const [openMorePopover, setOpenMorePopover] = React.useState(false);
  const morePopoverRef = React.useRef(null);
  const [isOpenArchiveAdModal, setIsOpenArchiveAdModal] = React.useState(false);
  const [isOpenUnpublishAdModal, setIsOpenUnpublishAdModal] = React.useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = React.useState(false);
  const history = useHistory();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const { ad, mutate } = useAd(id);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const { stats } = useAdStats(id, startDate,endDate);

  const { adGraph, isLoading } = useAdGraph({ id, startDate, endDate });
  const isDarkMode = useDarkMode();
  // Initialize date range based on ad start/end dates
  React.useEffect(() => {
    if (ad?.ad_end_date && ad?.ad_start_date) {
      const today = new Date();
      const adEndDate = new Date(ad.ad_end_date);
      const adStartDate = new Date(ad.ad_start_date);

      // Calculate end_date: use ad.ad_end_date if it's less than today, else use today
      const calculatedEndDate = adEndDate < today ? adEndDate : today;

      // Calculate start_date: go back 365 days from end_date, but not before ad.ad_start_date
      const minus365 = new Date(calculatedEndDate);
      minus365.setDate(minus365.getDate() - MAX_DAYS);
      const calculatedStartDate = minus365 < adStartDate ? adStartDate : minus365;

      setEndDate(calculatedEndDate);
      setStartDate(calculatedStartDate);
    }
  }, [ad?.ad_end_date, ad?.ad_start_date]);

  const onStartDateChange = (date) => {
    if (!date || !ad) {
      setStartDate(date);
      return;
    }

    const adStartDate = new Date(ad.ad_start_date);
    const adEndDate = new Date(ad.ad_end_date);
    const currentEnd = endDate;

    // Ensure start date is not before ad start date
    if (date < adStartDate) {
      setStartDate(adStartDate);
      return;
    }

    // Ensure start date is not after ad end date
    if (date > adEndDate) {
      setStartDate(adEndDate);
      return;
    }

    // Calculate the difference in days between new start and current end
    const diffInMs = Math.abs(currentEnd - date);
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    // If range is within 365 days, allow it
    if (diffInDays <= MAX_DAYS) {
      setStartDate(date);
    } else {
      // Adjust end date to be 365 days from new start date
      const newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + MAX_DAYS);

      // Make sure end date doesn't exceed today or ad end date
      const today = new Date();
      const maxAllowedEnd = adEndDate < today ? adEndDate : today;

      if (newEndDate > maxAllowedEnd) {
        setEndDate(maxAllowedEnd);
        setStartDate(date);
      } else {
        setStartDate(date);
        setEndDate(newEndDate);
      }
    }
  };

  const onEndDateChange = (date) => {
    if (!date || !ad) {
      setEndDate(date);
      return;
    }

    const adStartDate = new Date(ad.ad_start_date);
    const adEndDate = new Date(ad.ad_end_date);
    const today = new Date();
    const maxAllowedEnd = adEndDate < today ? adEndDate : today;

    // Ensure end date is not after ad end date or today
    if (date > maxAllowedEnd) {
      setEndDate(maxAllowedEnd);
      return;
    }

    // Ensure end date is not before ad start date
    if (date < adStartDate) {
      setEndDate(adStartDate);
      return;
    }

    const currentStart = startDate;

    // Calculate the difference in days between current start and new end
    const diffInMs = Math.abs(date - currentStart);
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    // If range is within 365 days, allow it
    if (diffInDays <= MAX_DAYS) {
      setEndDate(date);
    } else {
      // Adjust start date to be 365 days before new end date
      const newStartDate = new Date(date);
      newStartDate.setDate(newStartDate.getDate() - MAX_DAYS);

      // Ensure start date is not before ad start date
      if (newStartDate < adStartDate) {
        setStartDate(adStartDate);
        setEndDate(date);
      } else {
        setStartDate(newStartDate);
        setEndDate(date);
      }
    }
  };
  const { updateAdStatus } = useUnpublishOrArchiveAd();

  const handleUnpublish = async () => {
    updateAdStatus({
      adId: ad?.id,
      status: 'inactive',
      onComplete: async () => {
        setIsOpenUnpublishAdModal(false);
        await mutate(['ad', id], undefined, { revalidate: true });
      },
    });
  };

  const handleArchive = async (action = 'archive') => {
    const status = action === 'unarchive' ? 'inactive' : 'archived';
    const messageKey = action === 'unarchive' ? 'unarchived' : 'archived';

    updateAdStatus({
      adId: ad?.id,
      status: status,
      messageKey: messageKey,
      onComplete: async () => {
        setIsOpenArchiveAdModal(false);
        await mutate(['ad', id], undefined, { revalidate: true });
      },
    });
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    // Wait for the button to be removed from DOM and re-render to complete
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      await downloadPdf(pdfRef, `${ad?.ad_name}-report.pdf`);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <Box>
      {isDownloadingPdf && (
        <LoadingOverlay>
          <Loader>Downloading PDF...</Loader>
          <Typography variant="omega" className="loading-text">
            Downloading PDF...
          </Typography>
        </LoadingOverlay>
      )}
      <ConfirmArchiveModal
        isOpen={isOpenArchiveAdModal}
        setIsOpen={setIsOpenArchiveAdModal}
        onSubmit={handleArchive}
        variant="ads"
      />
      <ConfirmUnpublishModal
        isOpen={isOpenUnpublishAdModal}
        setIsOpen={setIsOpenUnpublishAdModal}
        onSubmit={handleUnpublish}
        variant="ads"
      />
      <Flex padding={2} justifyContent="space-between" alignItems="center">
        <BackButton />
        <LastUpdatedTimeAndRefresh />
      </Flex>
      <Box ref={pdfRef} background="neutral100">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          background="neutral0"
          style={{ marginBottom: '2rem', paddingRight: '12px' }}
          hasRadius
        >
          <div
            className="flex items-center gap-2"
            style={{
              padding: '20px 12px',
              flex: 1,
              minWidth: 0,
            }}
          >
            <img
              src={ad?.ad_image?.url ?? previewImage}
              alt={ad?.ad_name || ''}
              style={{ width: 55, height: 55, borderRadius: 6 }}
            />
            <div className="flex flex-col gap-1">
              <Flex alignItems="center" gap={1}>
                <Typography variant="beta">{ad?.ad_name}</Typography>
                <div className=" flex items-center gap-1">
                  {ad?.ad_type && <CustomBadge variant="draft">{ad?.ad_type?.title}</CustomBadge>}
                  {ad?.ad_spot && (
                    <CustomBadge variant="grayOutline">{ad?.ad_spot?.ad_spot_title}</CustomBadge>
                  )}
                  <StatusBadge
                    status={
                      ad?.ad_status === 'live' &&
                      ad?.ad_start_date &&
                      new Date(ad.ad_start_date) > new Date()
                        ? 'live-scheduled'
                        : ad?.ad_status
                    }
                  />
                </div>
              </Flex>
              <Typography variant="pi" textColor="neutral600">
                {ad?.ad_start_date ? new Date(ad?.ad_start_date).toLocaleDateString('en-GB') : ''}
                {ad?.ad_end_date
                  ? ` - ${new Date(ad?.ad_end_date).toLocaleDateString('en-GB')}`
                  : ''}
              </Typography>
            </div>
          </div>
          <div className="flex gap-4 justify-end" style={{ width: '430px', flexShrink: 0 }}>
            {!isDownloadingPdf && (
              <>
                <Button
                  style={{
                    backgroundColor: 'var(--neutral100)',
                  }}
                  startIcon={<More />}
                  variant="tertiary"
                  size="L"
                  ref={morePopoverRef}
                  onClick={() => setOpenMorePopover(!openMorePopover)}
                >
                  More
                </Button>

                <CustomButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    history.push(
                      `/plugins/${pluginId}/campaigns/edit/${ad?.campaign?.id}?ad=${ad?.id}`
                    );
                  }}
                >
                  <Edit stroke={isDarkMode ? '#fff' : '#666687'} />
                  Edit
                </CustomButton>

                {openMorePopover && (
                  <Popover
                    source={morePopoverRef}
                    placement="bottom"
                    spacing={4}
                    onDismiss={() => setOpenMorePopover(false)}
                  >
                    <Flex direction="column">
                      <PopoverItem
                        role="button"
                        onClick={() => setIsOpenUnpublishAdModal(true)}
                        justifyContent="space-between"
                        gap={6}
                        className={ad?.ad_status !== 'live' ? 'disabled' : ''}
                      >
                        <Typography>Unpublish</Typography>
                        <Pause stroke={isDarkMode ? '#fff' : '#666687'} />
                      </PopoverItem>
                      {ad?.ad_status === 'archived' ? (
                        <PopoverItem
                          justifyContent="space-between"
                          role="button"
                          style={{ width: '100%' }}
                          onClick={() => handleArchive('unarchive')}
                        >
                          <Typography>Unarchive</Typography>
                          <Archive stroke={isDarkMode ? '#fff' : '#666687'} />
                        </PopoverItem>
                      ) : (
                        <PopoverItem
                          justifyContent="space-between"
                          role="button"
                          style={{ width: '100%' }}
                          onClick={() => setIsOpenArchiveAdModal(true)}
                          className={ad?.ad_status === 'archived' ? 'disabled' : ''}
                        >
                          <Typography>Archive</Typography>
                          <Archive stroke={isDarkMode ? '#fff' : '#666687'} />
                        </PopoverItem>
                      )}
                    </Flex>
                  </Popover>
                )}
              </>
            )}

            {/* <CustomButton onClick={() => {}}>
            <Analytics stroke="#32324d" />
            View Report
          </CustomButton> */}
            {/* <CustomButton onClick={() => history.push('ad-report')}>
            <Save stroke="#32324d" />
            Save
          </CustomButton> */}

            {!isDownloadingPdf && (
              <CustomButton onClick={handleDownloadPdf}>
                <Download stroke={isDarkMode ? '#fff' : '#000'} />
                Download PDF
              </CustomButton>
            )}
          </div>
        </Flex>
        <Flex
          direction="column"
          alignItems="unset"
          gap={6}
          background="neutral0"
          padding={5}
          shadow="filterShadow"
          hasRadius
        >
          {/* All campaigns row with filters */}
          <Flex
            direction="row"
            className="p-5"
            justifyContent="space-between"
            alignItems="center"
            gap={4}
          >
            <Typography variant="beta" fontWeight="bold" textColor="neutral900">
              Ad Performance Analytics
            </Typography>
            <div className="flex items-center gap-4">
              {isDownloadingPdf ? (
                <Typography variant="gamma" fontWeight="bold" textColor="neutral900">
                  Date Range:{' '}
                  {startDate && endDate
                    ? `${startDate.toLocaleDateString('en-GB')} - ${endDate.toLocaleDateString('en-GB')}`
                    : ''}
                </Typography>
              ) : (
                <>
                  <Typography
                    variant="gamma"
                    fontWeight="bold"
                    textColor="neutral900"
                    style={{ display: 'block' }}
                  >
                    Select Date Range
                  </Typography>
                  <Flex gap={3} wrap="wrap" alignItems="center" justifyContent="flex-end">
                    {ad?.ad_start_date && ad?.ad_end_date && (
                      <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={onStartDateChange}
                        onEndDateChange={onEndDateChange}
                        minDate={new Date(ad.ad_start_date)}
                        maxDate={
                          new Date(ad.ad_end_date) < new Date()
                            ? new Date(ad.ad_end_date)
                            : new Date()
                        }
                      />
                    )}
                    {/* <SingleSelect
                value={dateRange}
                onChange={(value) => setDateRange(String(value))}
                size="S"
              >
                {TIMEFRAME_OPTIONS.map((timeframe) => (
                  <SingleSelectOption key={timeframe?.value} value={timeframe?.value}>
                    {timeframe?.label}
                  </SingleSelectOption>
                ))}
              </SingleSelect> */}
                  </Flex>
                </>
              )}
            </div>
          </Flex>
          <Flex style={{ marginTop: 8, width: '100% !important' }} gap={4}>
            {stats?.length > 0 &&
              stats?.map((stat) => <DashboardCard key={stat.type} data={stat} />)}
          </Flex>

          <Flex alignItems="flex-start" style={{ width: '100%', gap: 15 }}>
            <Box style={{ width: '67%' }}>
              <Box padding={6} hasRadius background="neutral0" shadow="filterShadow">
                <Flex direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="beta" fontWeight="semi-bold" textColor="neutral900">
                    Overall Performance
                  </Typography>
                  {/* <Flex direction="row" alignItems="center" gap={5}>
                    <Flex gap={1} alignItems="center">
                      <span
                        style={{
                          display: 'inline-block',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#104EF5',
                        }}
                      ></span>
                      <Typography
                        as="span"
                        variant="omega"
                        style={{ textTransform: 'uppercase', fontWeight: 500 }}
                      >
                        Impressions
                      </Typography>
                    </Flex>
                    <Flex gap={1} alignItems="center">
                      <span
                        style={{
                          display: 'inline-block',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#008B7E',
                        }}
                      ></span>
                      <Typography
                        as="span"
                        variant="omega"
                        style={{ textTransform: 'uppercase', fontWeight: 500 }}
                      >
                        Clicks
                      </Typography>
                    </Flex>
                  </Flex> */}
                </Flex>
                <Box padding={4} style={{ paddingTop: 0 }} className="max-h-96">
                  <PerformanceAnalytics data={adGraph} isLoading={isLoading} />
                </Box>
              </Box>
              <Box padding={6} hasRadius background="neutral0" shadow="filterShadow">
                <Flex direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="beta" fontWeight="semi-bold" textColor="neutral900">
                    Click Through Rate (CTR) Trend
                  </Typography>
                  {/* <Flex direction="row" alignItems="center" gap={5}>
                    <Flex gap={1} alignItems="center">
                      <span
                        style={{
                          display: 'inline-block',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#104EF5',
                        }}
                      ></span>
                      <Typography
                        as="span"
                        variant="omega"
                        style={{ textTransform: 'uppercase', fontWeight: 500 }}
                      >
                        CTR (%)
                      </Typography>
                    </Flex>
                  </Flex> */}
                </Flex>
                <Box padding={4} style={{ paddingTop: 0 }} className="max-h-96">
                  <ClickThroughRateTrend data={adGraph} isLoading={isLoading} />
                </Box>
              </Box>
              {/* <Flex
                alignItems="center"
                justifyContent="space-between"
                marginTop={6}
                style={{ position: 'relative', zIndex: 50 }}
              >
                <Flex alignItems="center" gap={2}>
                  <SingleSelect
                    value={String(pageSize)}
                    onChange={(value) => {
                      setPageSize(Number(value));
                      setPage(1);
                    }}
                    size="S"
                  >
                    <SingleSelectOption value={10}>10</SingleSelectOption>
                    <SingleSelectOption value={20}>20</SingleSelectOption>
                    <SingleSelectOption value={50}>50</SingleSelectOption>
                    <SingleSelectOption value={100}>100</SingleSelectOption>
                  </SingleSelect>
                  <Typography variant="pi" textColor="neutral600" className="mr-2">
                    Entries per page:
                  </Typography>
                </Flex>
                {totalPages > 1 && (
                  <div className="w-min float-end mt-6">
                    <Pagination activePage={currentPage} pageCount={totalPages}>
                      <PreviousLink
                        as="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setPage(currentPage - 1);
                        }}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        Previous
                      </PreviousLink>
                      {(() => {
                        const links = [];
                        let start = Math.max(1, page - 2);
                        let end = Math.min(totalPages, page + 2);
                        if (start > 1) {
                          links.push(
                            <PageLink
                              key={1}
                              number={1}
                              as="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(1);
                              }}
                            >
                              1
                            </PageLink>
                          );
                          if (start > 2) links.push(<Dots key="dots-start">...</Dots>);
                        }
                        for (let i = start; i <= end; i++) {
                          links.push(
                            <PageLink
                              key={i}
                              number={i}
                              as="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(i);
                              }}
                              aria-current={i === currentPage ? 'page' : undefined}
                            >
                              {i}
                            </PageLink>
                          );
                        }
                        if (end < totalPages) {
                          if (end < totalPages - 1) links.push(<Dots key="dots-end">...</Dots>);
                          links.push(
                            <PageLink
                              key={totalPages}
                              number={totalPages}
                              as="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(totalPages);
                              }}
                            >
                              {totalPages}
                            </PageLink>
                          );
                        }
                        return links;
                      })()}
                      <NextLink
                        as="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setPage(currentPage + 1);
                        }}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                      >
                        Next
                      </NextLink>
                    </Pagination>
                  </div>
                )}
              </Flex> */}
            </Box>
            <Box
              style={{ width: '33%' }}
              padding={6}
              hasRadius
              background="neutral0"
              shadow="filterShadow"
            >
              <Typography
                variant="beta"
                fontWeight="semi-bold"
                textColor="neutral900"
                style={{ marginBottom: '1rem' }}
              >
                Ad Details
              </Typography>
              <Flex direction="column" alignItems="start" gap={4} marginTop={8}>
                <Flex
                  justifyContent="space-between"
                  alignItems="start"
                  style={{ width: '100%', gap: 15 }}
                >
                  <Typography
                    variant="delta"
                    fontWeight="semi-bold"
                    textColor="neutral900"
                    style={{ flexShrink: 0 }}
                  >
                    Campaign
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {ad?.campaign?.campaign_name || ''}
                  </Typography>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="start"
                  style={{ width: '100%', gap: 15 }}
                >
                  <Typography
                    variant="delta"
                    fontWeight="semi-bold"
                    textColor="neutral900"
                    style={{ flexShrink: 0 }}
                  >
                    Ad Name
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {ad?.ad_name || ''}
                  </Typography>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="start"
                  style={{ width: '100%', gap: 15 }}
                >
                  <Typography
                    variant="delta"
                    fontWeight="semi-bold"
                    textColor="neutral900"
                    style={{ flexShrink: 0 }}
                  >
                    Entity name
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {ad?.campaign?.campaign_entity_name || ''}
                  </Typography>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="start"
                  style={{ width: '100%', gap: 15 }}
                >
                  <Typography
                    variant="delta"
                    fontWeight="semi-bold"
                    textColor="neutral900"
                    style={{ flexShrink: 0 }}
                  >
                    Entity Registration
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {ad?.campaign?.campaign_entity_type
                      ? ad?.campaign?.campaign_entity_type === 'adgm_entity'
                        ? 'Strapi Entity'
                        : 'External Entity'
                      : ''}
                  </Typography>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="start"
                  style={{ width: '100%', gap: 15 }}
                >
                  <Typography
                    variant="delta"
                    fontWeight="semi-bold"
                    textColor="neutral900"
                    style={{ flexShrink: 0 }}
                  >
                    License Number
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {ad?.campaign?.campaign_entity_license_number || ''}
                  </Typography>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="start"
                  style={{ width: '100%', gap: 15 }}
                >
                  <Typography
                    variant="delta"
                    fontWeight="semi-bold"
                    textColor="neutral900"
                    style={{ flexShrink: 0 }}
                  >
                    Ad Types
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {ad?.ad_type?.title || ''}
                  </Typography>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="start"
                  style={{ width: '100%', gap: 15 }}
                >
                  <Typography
                    variant="delta"
                    fontWeight="semi-bold"
                    textColor="neutral900"
                    style={{ flexShrink: 0 }}
                  >
                    Format
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {ad?.ad_spot?.ad_spot_title || ''}
                  </Typography>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="start"
                  style={{ width: '100%', gap: 15 }}
                >
                  <Typography
                    variant="delta"
                    fontWeight="semi-bold"
                    textColor="neutral900"
                    style={{ flexShrink: 0 }}
                  >
                    Size
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {`${ad?.ad_type?.image_size?.width || ''} x ${ad?.ad_type?.image_size?.height || ''}`}
                  </Typography>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="start"
                  style={{ width: '100%', gap: 15 }}
                >
                  <Typography
                    variant="delta"
                    fontWeight="semi-bold"
                    textColor="neutral900"
                    style={{ flexShrink: 0 }}
                  >
                    Start date
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {ad?.ad_start_date
                      ? new Date(ad?.ad_start_date).toLocaleDateString('en-GB')
                      : ''}
                  </Typography>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="start"
                  style={{ width: '100%', gap: 15 }}
                >
                  <Typography
                    variant="delta"
                    fontWeight="semi-bold"
                    textColor="neutral900"
                    style={{ flexShrink: 0 }}
                  >
                    End date
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {ad?.ad_end_date
                      ? `${new Date(ad?.ad_end_date).toLocaleDateString('en-GB')}`
                      : ''}
                  </Typography>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="start"
                  style={{ width: '100%', gap: 15 }}
                >
                  <Typography
                    variant="delta"
                    fontWeight="semi-bold"
                    textColor="neutral900"
                    style={{ flexShrink: 0 }}
                  >
                    Link type
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {ad?.ad_external_url ? 'External' : 'Internal'}
                  </Typography>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default AdReport;
