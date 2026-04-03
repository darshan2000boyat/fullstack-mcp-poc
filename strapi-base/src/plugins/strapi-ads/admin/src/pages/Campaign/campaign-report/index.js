// @ts-nocheck
import { Box, Button, Flex, Loader, Typography } from '@strapi/design-system';
import React, { useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb';
import pluginId from '../../../pluginId';
import LastUpdatedTimeAndRefresh from '../../../components/elements/lastUpdatedTimeAndRefresh';
import { format } from 'date-fns';
import styled from 'styled-components';
import BackButton from '../../../components/elements/backButton';
import DashboardCard from '../../../components/elements/dashboardcard';
import DateRangePicker from '../../../components/elements/form/dateRangePicker';
import StatusBadge from '../../../components/elements/statusBadge';
import useAdType from '../../../components/hooks/useAdType';
import useCampaignDetails from '../../../components/hooks/useCampaignDetails';
import useCampaignGraph from '../../../components/hooks/useCampaignGraph';
import useCampaignStats from '../../../components/hooks/useCampaignStats';
import useDownloadPdf from '../../../components/hooks/useDownloadPdf';
import { MAX_DAYS } from '../../../utils/constants';
import ClickThroughRateTrend from '../../Components/clickThroughRateTrend';
import PerformanceAnalytics from '../../Components/performanceAnalytics';
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

const CampaignReport = () => {
  const { id } = useParams();
  const pdfRef = useRef();
  const downloadPdf = useDownloadPdf();
  const { campaign } = useCampaignDetails(Number(id));
  const { adTypes } = useAdType();
  const [status, setStatus] = React.useState(['']);
  const [type, setType] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isDownloadingPdf, setIsDownloadingPdf] = React.useState(false);

  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const { stats } = useCampaignStats(Number(id),startDate,endDate);

  const { campaignGraph, isLoading } = useCampaignGraph({
    id: Number(id),
    startDate,
    endDate,
  });

  // Initialize date range based on campaign start/end dates
  React.useEffect(() => {
    if (campaign?.max_date && campaign?.min_date) {
      const today = new Date();
      const campaignEndDate = new Date(campaign.max_date);
      const campaignStartDate = new Date(campaign.min_date);

      // Calculate end_date: use campaign.max_date if it's less than today, else use today
      const calculatedEndDate = campaignEndDate < today ? campaignEndDate : today;

      // Calculate start_date: go back 365 days from end_date, but not before campaign.min_date
      const minus365 = new Date(calculatedEndDate);
      minus365.setDate(minus365.getDate() - MAX_DAYS);
      const calculatedStartDate = minus365 < campaignStartDate ? campaignStartDate : minus365;

      setEndDate(calculatedEndDate);
      setStartDate(calculatedStartDate);
    }
  }, [campaign?.max_date, campaign?.min_date]);

  const onStartDateChange = (date) => {
    if (!date || !campaign) {
      setStartDate(date);
      return;
    }

    const campaignStartDate = new Date(campaign.min_date);
    const campaignEndDate = new Date(campaign.max_date);
    const currentEnd = endDate;

    // Ensure start date is not before campaign start date
    if (date < campaignStartDate) {
      setStartDate(campaignStartDate);
      return;
    }

    // Ensure start date is not after campaign end date
    if (date > campaignEndDate) {
      setStartDate(campaignEndDate);
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

      // Make sure end date doesn't exceed today or campaign end date
      const today = new Date();
      const maxAllowedEnd = campaignEndDate < today ? campaignEndDate : today;

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
    if (!date || !campaign) {
      setEndDate(date);
      return;
    }

    const campaignStartDate = new Date(campaign.min_date);
    const campaignEndDate = new Date(campaign.max_date);
    const today = new Date();
    const maxAllowedEnd = campaignEndDate < today ? campaignEndDate : today;

    // Ensure end date is not after campaign end date or today
    if (date > maxAllowedEnd) {
      setEndDate(maxAllowedEnd);
      return;
    }

    // Ensure end date is not before campaign start date
    if (date < campaignStartDate) {
      setEndDate(campaignStartDate);
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

      // Ensure start date is not before campaign start date
      if (newStartDate < campaignStartDate) {
        setStartDate(campaignStartDate);
        setEndDate(date);
      } else {
        setStartDate(newStartDate);
        setEndDate(date);
      }
    }
  };
  const history = useHistory();

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    // Wait for the button to be removed from DOM and re-render to complete
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      await downloadPdf(pdfRef, `${campaign?.campaign_name}-report.pdf`);
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
      <Flex paddingLeft={2} paddingRight={2} justifyContent="space-between" alignItems="flex-end">
        <BackButton />
        <LastUpdatedTimeAndRefresh />
      </Flex>
      <Box padding={2} ref={pdfRef} background="neutral100">
        <Flex justifyContent="space-between" alignItems="flex-end" style={{ marginBottom: '2rem' }}>
          <Flex direction="column" alignItems="flex-start" style={{ flex: 1, minWidth: 0 }}>
            <Flex gap={2}>
              <p className="text-xs text-[#62627B] font-normal">
                {campaign?.min_date && format(new Date(campaign?.min_date), 'dd/MM/yyyy')}
                {campaign?.max_date && ' - '}{' '}
                {campaign?.max_date && format(new Date(campaign?.max_date), 'dd/MM/yyyy')}
              </p>
              <StatusBadge
                status={
                  campaign?.campaign_status === 'active' &&
                  campaign?.min_date &&
                  new Date(campaign.min_date) > new Date()
                    ? 'active-scheduled'
                    : campaign?.campaign_status
                }
              />
            </Flex>
            <Typography variant="alpha">{campaign?.campaign_name}</Typography>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Strapi</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      history.push(`/plugins/${pluginId}/campaigns`);
                    }}
                  >
                    Campaign Management{' '}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  onClick={(e) => {
                    history.push(`/plugins/${pluginId}/campaigns/edit/${campaign?.id}`);
                  }}
                >
                  <BreadcrumbLink>{campaign?.campaign_name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>Report</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Flex>

          <Flex justifyContent="flex-end" gap={4} style={{ width: '410px', flexShrink: 0 }}>
            {!isDownloadingPdf && (
              <>
                <Button
                  style={{
                    backgroundColor: 'var(--neutral100)',
                  }}
                  variant="tertiary"
                  onClick={() =>
                    history.push(`/plugins/${pluginId}/campaigns/edit/${campaign?.id}`)
                  }
                  size="L"
                >
                  View Campaign details
                </Button>
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
                    {campaign?.min_date && campaign?.max_date && (
                      <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={onStartDateChange}
                        onEndDateChange={onEndDateChange}
                        minDate={new Date(campaign.min_date)}
                        maxDate={
                          new Date(campaign.max_date) < new Date()
                            ? new Date(campaign.max_date)
                            : new Date()
                        }
                      />
                    )}
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
              <PerformanceAnalytics data={campaignGraph} isLoading={isLoading} />
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
              <ClickThroughRateTrend data={campaignGraph} isLoading={isLoading} />
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

export default CampaignReport;
