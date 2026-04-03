// @ts-nocheck
import { Box, Button, Flex, Loader, Typography } from '@strapi/design-system';
import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb';

import { useFetchClient } from '@strapi/helper-plugin';
import styled from 'styled-components';
import DashboardCard from '../../../components/elements/dashboardcard';
import DateRangePicker from '../../../components/elements/form/dateRangePicker';
import LastUpdatedTimeAndRefresh from '../../../components/elements/lastUpdatedTimeAndRefresh';
import useAdModuleStats from '../../../components/hooks/useAdModuleStats';
import useAdType from '../../../components/hooks/useAdType';
import useDownloadPdf from '../../../components/hooks/useDownloadPdf';
import useOverallGraph from '../../../components/hooks/useOverallGraph';
import { DEFAULT_DAYS, MAX_DAYS } from '../../../utils/constants';
import ClickThroughRateTrend from '../../Components/clickThroughRateTrend';
import PerformanceAnalytics from '../../Components/performanceAnalytics';
import ExportReportCsvModal from '../components/exportReportCsvModal';

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

const CampaignAnalyticsReport = () => {
  const { get } = useFetchClient();

  const getDefaultStartDate = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - DEFAULT_DAYS);
    return startDate;
  };

  const [startDate, setStartDate] = React.useState(getDefaultStartDate());
  const [endDate, setEndDate] = React.useState(new Date());

  const onStartDateChange = (date) => {
    if (!date) {
      setStartDate(date);
      return;
    }

    const currentEnd = endDate;

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

      // Make sure end date doesn't exceed today
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      if (newEndDate > today) {
        setEndDate(today);
        // Also adjust start date to maintain 365 days from today
        const adjustedStart = new Date(today);
        adjustedStart.setDate(adjustedStart.getDate() - MAX_DAYS);
        setStartDate(adjustedStart);
      } else {
        setStartDate(date);
        setEndDate(newEndDate);
      }
    }
  };

  const onEndDateChange = (date) => {
    if (!date) {
      setEndDate(date);
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
      setStartDate(newStartDate);
      setEndDate(date);
    }
  };

  const pdfRef = useRef();
  const downloadPdf = useDownloadPdf();
  const { adTypes } = useAdType();
  const [status, setStatus] = React.useState(['']);
  const [type, setType] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [dateRange, setDateRange] = React.useState(''); // Default to empty string for "All Time"
  const [isDownloadingPdf, setIsDownloadingPdf] = React.useState(false);

  const { stats } = useAdModuleStats({ startDate, endDate }); // Pass dateRange to stats hook too
  const { overallGraph, isLoading } = useOverallGraph({ startDate, endDate });

  const [isOpenExportReportCsvModal, setIsOpenExportReportCsvModal] = React.useState(false);
  const history = useHistory();

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    // Wait for the button to be removed from DOM and re-render to complete
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      await downloadPdf(pdfRef, 'Overall-Report.pdf');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div>
      {isDownloadingPdf && (
        <LoadingOverlay>
          <Loader>Downloading PDF...</Loader>
          <Typography variant="omega" className="loading-text">
            Downloading PDF...
          </Typography>
        </LoadingOverlay>
      )}
      <ExportReportCsvModal
        isOpen={isOpenExportReportCsvModal}
        setIsOpen={setIsOpenExportReportCsvModal}
        onSubmit={() => {}}
      />
      <Flex paddingRight={2} justifyContent="flex-end">
        <LastUpdatedTimeAndRefresh />
      </Flex>
      <Box padding={2} ref={pdfRef} background="neutral100">
        <Flex justifyContent="space-between" alignItems="flex-end" style={{ marginBottom: '2rem' }}>
          <Flex direction="column" alignItems="flex-start">
            <Typography variant="alpha">Analytics & Reports</Typography>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Strapi</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    history.push('campaigns');
                  }}
                >
                  <BreadcrumbLink>Campaign Management </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>Analytics & Report</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Flex>
          <Flex gap={2}>
            {!isDownloadingPdf && (
              <>
                <Button
                  style={{
                    backgroundColor: 'var(--neutral100)',
                  }}
                  variant="tertiary"
                  onClick={handleDownloadPdf}
                  size="L"
                >
                  Download PDF
                </Button>
              </>
            )}
          </Flex>
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
              Overall Campaign Stats
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
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      onStartDateChange={onStartDateChange}
                      onEndDateChange={onEndDateChange}
                      maxDate={new Date()}
                    />
                    {/* <SingleSelect
                value={dateRange}
                onChange={(value) => {
                  setDateRange(String(value));
                }}
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
          <Box padding={6} hasRadius background="neutral0" shadow="filterShadow">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="beta" fontWeight="semi-bold" textColor="neutral900">
                Performance Analytics
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
              <PerformanceAnalytics data={overallGraph} isLoading={isLoading} />
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
            <Box padding={4} style={{ paddingTop: 0 }} style={{ maxHeight: '384px' }}>
              <ClickThroughRateTrend data={overallGraph} isLoading={isLoading} />
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
        </Flex>
      </Box>
    </div>
  );
};

export default CampaignAnalyticsReport;
