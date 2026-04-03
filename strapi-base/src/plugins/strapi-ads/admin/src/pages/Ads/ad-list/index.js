// @ts-nocheck
import {
  Badge,
  Box,
  Button,
  Combobox,
  ComboboxOption,
  Flex,
  Loader,
  MultiSelect,
  MultiSelectOption,
  NextLink,
  PageLink,
  Pagination,
  PreviousLink,
  Searchbar,
  SingleSelect,
  SingleSelectOption,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/helper-plugin';
import { CarretDown, CarretUp } from '@strapi/icons';
import { format } from 'date-fns';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import CustomBadge from '../../../components/elements/badge';
import CustomIconButton from '../../../components/elements/customIconButton';
import StatusBadge from '../../../components/elements/statusBadge';
import useAds from '../../../components/hooks/useAds';
import useAdType from '../../../components/hooks/useAdType';
import useCampaigns from '../../../components/hooks/useCampaigns';
import Analytics from '../../../components/Icons/Analytics';
import pluginId from '../../../pluginId';
import { AD_STATUS_OPTIONS } from '../../../utils/constants';
import { truncate } from '../../../utils/utils';
import ExportReportCsvModal from '../../Campaign/components/exportReportCsvModal';
import AdActionMenu from '../adActionMenu';
import previewImage from '../../../assets/previewImage.png';
const TrStyles = 'text-xl uppercase font-bold';
const TdStyles = 'text-2xl';

const BadgeText = styled(Typography)`
  text-transform: none; /* override Strapi sigma */
`;

const AdList = () => {
  const history = useHistory();
  const { get } = useFetchClient();
  const [hoveredRow, setHoveredRow] = useState(null);

  const [campaign, setCampaign] = useState('');
  const [status, setStatus] = useState(['']);
  const [campaignSearch, setCampaignSearch] = useState('');
  const [debouncedCampaignSearch, setDebouncedCampaignSearch] = useState('');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isOpenExportReportCsvModal, setIsOpenExportReportCsvModal] = React.useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [sort, setSort] = useState({ field: 'ad_end_date', order: 'DESC' });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page when debounced search changes
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Debounce campaign search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCampaignSearch(campaignSearch);
      setActiveCampaignPage(1); // Reset campaign page when debounced search changes
      setAllCampaigns([]); // Clear campaigns to fetch fresh results
    }, 400);

    return () => clearTimeout(timer);
  }, [campaignSearch]);

  const { ads, pagination, isLoading, mutate } = useAds({
    page,
    pageSize,
    status,
    type,
    search: debouncedSearch,
    campaign,
    sort,
  });

  const handleSortChange = (field) => {
    setSort((prevSort) => ({
      field,
      order: prevSort.field === field ? (prevSort.order === 'ASC' ? 'DESC' : 'ASC') : 'ASC',
    }));
    setPage(1);
  };

  const { adTypes } = useAdType();
  const [activeCampaignPage, setActiveCampaignPage] = React.useState(1);
  const [activeCampaignPageOptions, setActiveCampaignPageOptions] = React.useState([]);
  const [allCampaigns, setAllCampaigns] = React.useState([]);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const loadMoreRef = React.useRef(null);

  const { campaigns, pagination: campaignPagination } = useCampaigns({
    page: activeCampaignPage ?? 1,
    pageSize: 20,
    search: debouncedCampaignSearch,
  });

  React.useEffect(() => {
    if (!campaigns) return;

    setAllCampaigns((prev) => {
      if (activeCampaignPage === 1) {
        return campaigns;
      }

      return [...prev, ...campaigns];
    });
    setIsLoadingMore(false);
  }, [campaigns, activeCampaignPage]);

  // Use refs to track the latest values without causing effect re-runs
  const isLoadingMoreRef = React.useRef(isLoadingMore);
  const activeCampaignPageRef = React.useRef(activeCampaignPage);
  const campaignPaginationRef = React.useRef(campaignPagination);

  React.useEffect(() => {
    isLoadingMoreRef.current = isLoadingMore;
    activeCampaignPageRef.current = activeCampaignPage;
    campaignPaginationRef.current = campaignPagination;
  }, [isLoadingMore, activeCampaignPage, campaignPagination]);

  // Scroll event listener for infinite scroll in Combobox dropdown
  React.useEffect(() => {
    const handleScroll = (e) => {
      const target = e.target;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      // Check if scrolled to bottom (with 10px threshold)
      if (scrollHeight - scrollTop <= clientHeight + 10) {
        if (
          !isLoadingMoreRef.current &&
          activeCampaignPageRef.current < campaignPaginationRef.current?.pageCount
        ) {
          setIsLoadingMore(true);
          setActiveCampaignPage((prev) => prev + 1);
        }
      }
    };

    // Find the combobox dropdown content element
    const findAndAttachScrollListener = () => {
      const listbox = document.querySelector('[role="listbox"]');

      if (listbox) {
        // Try to find the actual scrollable container
        // Check if listbox itself is scrollable
        const isScrollable = listbox.scrollHeight > listbox.clientHeight;

        if (isScrollable) {
          listbox.addEventListener('scroll', handleScroll);
          return listbox;
        }

        // Check for scrollable children
        const scrollableChild = Array.from(listbox.children).find(
          (child) => child.scrollHeight > child.clientHeight
        );

        if (scrollableChild) {
          scrollableChild.addEventListener('scroll', handleScroll);
          return scrollableChild;
        }

        listbox.addEventListener('scroll', handleScroll);
        return listbox;
      }
      return null;
    };

    // Use MutationObserver to detect when dropdown opens
    const observer = new MutationObserver(() => {
      findAndAttachScrollListener();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      // Cleaning up observers and event listeners
      observer.disconnect();
      const listbox = document.querySelector('[role="listbox"]');
      if (listbox) {
        listbox.removeEventListener('scroll', handleScroll);
        // Also remove from potential child
        Array.from(listbox.children).forEach((child) => {
          child.removeEventListener('scroll', handleScroll);
        });
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.pageCount || 1;
  const paginatedCampaigns = campaigns;

  useEffect(() => {
    if (currentPage > totalPages) setPage(1);
  }, [totalPages]);

  const handleRowClick = (event, adId, campaignId) => {
    // Prevent navigation if clicking on buttons or interactive elements
    const target = event.target;
    const isInteractiveElement =
      target.closest('button') || target.closest('a') || target.closest('[role="button"]');

    if (!isInteractiveElement) {
      history.push(`campaigns/edit/${campaignId}?ad=${adId}`);
    }
  };

  useEffect(() => {
    const pageWrapper = document.querySelector('.page-wrapper');
    const target = pageWrapper?.parentElement?.parentElement;
    const className = 'adgm-dashboard-wrapper';

    if (target) target.classList.add(className);

    return () => {
      if (target) target.classList.remove(className);
    };
  }, []);

  const handleDownloadCSV = async () => {
    try {
      const cleanStatus = status.filter(Boolean);

      const query = qs.stringify(
        {
          filters: {
            ...(type !== '' && { ad_type: type }),
            ...(campaign !== '' && {
              campaign,
            }),
            ...(cleanStatus.length > 0 && { ad_status: cleanStatus }),
            ...(search && { ad_name: { $containsi: search } }),
          },
        },
        { encodeValuesOnly: true }
      );

      const response = await get(`/${pluginId}/ad/generate-report?${query}`);
      window.open(response?.data?.downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setIsOpenExportReportCsvModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <ExportReportCsvModal
        isOpen={isOpenExportReportCsvModal}
        setIsOpen={setIsOpenExportReportCsvModal}
        onSubmit={handleDownloadCSV}
      />
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Flex direction="column" alignItems="flex-start">
          <Typography variant="alpha" className="h1 font-semibold" textColor="neutral900">
            Ad Management
          </Typography>
          <Typography variant="epsilon" className="text-2xl" textColor="neutral600">
            Abu Dhabi Global Market - Ads
          </Typography>
        </Flex>
        <Button
          style={{
            backgroundColor: 'var(--neutral100)',
          }}
          size="L"
          variant="tertiary"
          onClick={() => setIsOpenExportReportCsvModal(true)}
        >
          Export CSV
        </Button>
      </Flex>
      <Box className background="neutral0" hasRadius marginTop={6}>
        <div className="!p-6">
          {/* All campaigns row with filters */}
          <Flex
            direction="row"
            className="p-5"
            justifyContent="space-between"
            alignItems="center"
            gap={4}
          >
            <Typography variant="beta" fontWeight="bold" textColor="neutral900">
              {pagination?.total} Ads
            </Typography>
            <Flex gap={3} wrap="wrap" alignItems="center">
              <Searchbar
                name="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  // Page reset is handled by debounce effect
                }}
                onClear={() => {
                  setSearch('');
                  setDebouncedSearch(''); // Clear debounced search immediately
                  setPage(1);
                }}
                clearLabel="Clear search"
                placeholder="Search"
              >
                <></>
              </Searchbar>
              <Combobox
                placeholder="All Campaigns"
                value={campaign}
                onChange={(v) => {
                  setCampaign(v);
                  setPage(1);
                }}
                filterValue={campaignSearch} // Change from filter
                onFilterValueChange={(v) => {
                  setCampaignSearch(v ?? '');
                  setActiveCampaignPage(1);
                }} // Change from setFilter
              >
                <ComboboxOption key={0} value="">
                  All Campaigns
                </ComboboxOption>
                {allCampaigns?.map(
                  (
                    c // Change from filteredCampaignOptions
                  ) => (
                    <ComboboxOption key={c.id} value={c.id}>
                      {c.campaign_name}
                    </ComboboxOption>
                  )
                )}
                {activeCampaignPage < campaignPagination?.pageCount && (
                  <div ref={loadMoreRef} style={{ padding: '8px', textAlign: 'center' }}>
                    {isLoadingMore && <Loader small>Loading more campaigns...</Loader>}
                  </div>
                )}
              </Combobox>
              <MultiSelect
                value={status}
                onChange={(value) => {
                  const updatedStatus = value.filter((v) => v !== '');
                  setStatus(updatedStatus.length === 0 ? [''] : updatedStatus);
                  setPage(1);
                }}
                customizeContent={(value) =>
                  value
                    .map((v) => AD_STATUS_OPTIONS.find((opt) => opt.value === v)?.label)
                    .join(', ')
                }
              >
                {AD_STATUS_OPTIONS.map((status) => (
                  <MultiSelectOption key={status.value} value={status.value}>
                    {status.label}
                  </MultiSelectOption>
                ))}
              </MultiSelect>
              <SingleSelect
                value={type}
                onChange={(value) => {
                  setType(String(value));
                  setPage(1); // Reset page to 1
                }}
              >
                <SingleSelectOption key={0} value="">
                  All Types
                </SingleSelectOption>
                {adTypes.map((type) => (
                  <SingleSelectOption key={type?.id} value={type?.id}>
                    {type?.title}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
            </Flex>
          </Flex>
        </div>
        <Table colCount={7} rowCount={ads.length + 1} className="ads-table w-max min-w-full">
          <Thead>
            <Tr className={TrStyles}>
              <Th onClick={() => handleSortChange('ad_name')} style={{ paddingInline: 24 }}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Ad
                  </Typography>
                  {sort.field === 'ad_name' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th onClick={() => handleSortChange('ad_start_date')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Date
                  </Typography>
                  {sort.field === 'ad_end_date' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th onClick={() => handleSortChange('ad_status')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Status
                  </Typography>

                  {sort.field === 'ad_status' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th onClick={() => handleSortChange('campaign.campaign_name')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Campaign
                  </Typography>
                  {sort.field === 'campaign.campaign_name' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th onClick={() => handleSortChange('ad_external_url')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Link
                  </Typography>
                  {sort.field === 'ad_external_url' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>

              <Th onClick={() => handleSortChange('total_impressions')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Impressions
                  </Typography>
                  {sort.field === 'total_impressions' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th onClick={() => handleSortChange('total_clicks')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Clicks
                  </Typography>
                  {sort.field === 'total_clicks' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th onClick={() => handleSortChange('ctr')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    CTR
                  </Typography>
                  {sort.field === 'ctr' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th className="sticky right-0 px-6" background="neutral0">
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Action
                </Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {ads.length > 0 ? (
              ads.map((ad, idx) => (
                <Tr
                  key={idx}
                  onClick={(e) => handleRowClick(e, ad.id, ad.campaign?.id)}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                  background={hoveredRow === idx ? 'neutral100' : 'transparent'}
                  style={{ cursor: 'pointer', transition: 'background-color 0.2s ease' }}
                >
                  <Td className={TdStyles} style={{ paddingInline: 24 }}>
                    <div
                      className="flex items-center gap-2"
                      style={{
                        padding: '16px 0px',
                      }}
                      title={ad?.ad_name}
                    >
                      <img
                        src={ad?.ad_image?.url ?? previewImage}
                        alt={ad?.ad_name}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 6,
                          objectFit: 'cover',
                          aspectRatio: '1 / 1',
                        }}
                      />
                      <div className="flex flex-col gap-1">
                        <Typography style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}>
                          {truncate(ad?.ad_name, 20)}
                        </Typography>
                        <div className=" flex items-center gap-1">
                          {ad?.ad_type && (
                            <CustomBadge variant="draft">{ad.ad_type?.title}</CustomBadge>
                          )}
                          {ad?.ad_spot && (
                            <CustomBadge variant="grayOutline">
                              {ad.ad_spot?.ad_spot_title}
                            </CustomBadge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Td>
                  {/* Campaign date range (static for now) */}
                  <Td className={TdStyles}>
                    <Typography style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}>
                      {ad?.ad_start_date ? format(new Date(ad?.ad_start_date), 'dd/MM/yyyy') : ''} -{' '}
                      {ad?.ad_end_date ? format(new Date(ad?.ad_end_date), 'dd/MM/yyyy') : ''}
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <StatusBadge
                      status={
                        ad?.ad_status === 'live' &&
                        ad?.ad_start_date &&
                        new Date(ad.ad_start_date) > new Date()
                          ? 'live-scheduled'
                          : ad?.ad_status
                      }
                    />
                  </Td>
                  <Td className={TdStyles}>
                    <Typography
                      title={ad?.campaign?.campaign_name}
                      style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}
                    >
                      {truncate(ad?.campaign?.campaign_name, 20) || ''}
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <Badge
                      backgroundColor={ad?.ad_external_url ? 'primary100' : 'neutral150'}
                      textColor="neutral900"
                    >
                      <BadgeText>{ad?.ad_external_url ? 'External' : 'Internal'}</BadgeText>
                    </Badge>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}>
                      {ad?.total_impressions ?? 0}
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}>
                      {ad?.total_clicks ?? 0}
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}>
                      {ad?.ctr ? `${ad?.ctr}%` : '0%'}
                    </Typography>
                  </Td>
                  {/* Action menu for campaign */}
                  <Td
                    className="sticky right-0"
                    background={hoveredRow === idx ? 'neutral100' : 'neutral0'}
                    style={{ paddingInline: 18, transition: 'background-color 0.2s ease' }}
                  >
                    <Flex justifyContent="left" className="gap-2">
                      {ad?.ad_status !== 'draft' && ad?.campaign?.campaign_status !== 'draft' && (
                        <CustomIconButton
                          onClick={() => history.push(`ads/report/${ad.id}`)}
                          ariaLabel="View Analytics"
                        >
                          <Analytics />
                        </CustomIconButton>
                      )}
                      <AdActionMenu
                        data={ad}
                        onStatusChange={() => mutate()}
                        filters={{
                          page,
                          pageSize,
                          status,
                          type,
                          search,
                          campaign,
                          sort,
                        }}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : isLoading ? (
              <Tr>
                <Td colSpan={7}>
                  <div
                    style={{ height: '50vh' }}
                    className="flex flex-col gap-4 items-center justify-center"
                  >
                    <Loader />
                  </div>
                </Td>
              </Tr>
            ) : (
              <Tr>
                <Td colSpan={7}>
                  <div
                    style={{ height: '50vh' }}
                    className="flex flex-col gap-4 items-center justify-center"
                  >
                    <div className="text-gray-500 text-lg">No ads found</div>
                  </div>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      <Flex alignItems="center" justifyContent="space-between" marginTop={6}>
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
        {/* Pagination */}
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
              {/* Render page links dynamically, show up to 5 pages with Dots if needed */}
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
                  if (start > 2) links.push(<p>...</p>);
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
                  if (end < totalPages - 1) links.push(<p key="dots-end">...</p>);
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
      </Flex>
    </div>
  );
};

export default AdList;
