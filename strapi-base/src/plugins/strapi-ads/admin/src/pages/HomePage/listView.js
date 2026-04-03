// @ts-nocheck
import {
  Button,
  Flex,
  Loader,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
} from '@strapi/design-system';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { CarretDown, CarretUp, Plus } from '@strapi/icons';
// import { EmptyDocuments } from "@strapi/icons/symbols";
import { format } from 'date-fns';

import Analytics from '../../components/Icons/Analytics';
import CustomIconButton from '../../components/elements/customIconButton';
import DashboardCard from '../../components/elements/dashboardcard';
import StatusBadge from '../../components/elements/statusBadge';
import useAdModuleDashboardStats from '../../components/hooks/useAdModuleDashboardStats';
import { formatNumber } from '../../utils/utils';
import ActionMenu from './actionMenu';
const TrStyles = 'text-xl uppercase font-bold';
const TdStyles = 'text-2xl';

const ListView = ({ paginatedCampaigns, handleSortChange, sort, isLoading, filters }) => {
  const history = useHistory();
  const { stats } = useAdModuleDashboardStats({
    status:filters.status,
    type:filters.type,
    time:filters.time,
    search:filters.search,
  });
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleRowClick = (event, campaignId) => {
    // Prevent navigation if clicking on buttons or interactive elements
    const target = event.target;
    const isInteractiveElement =
      target.closest('button') || target.closest('a') || target.closest('[role="button"]');

    if (!isInteractiveElement) {
      history.push(`campaigns/edit/${campaignId}`);
    }
  };

  return (
    <>
      <div
        style={{
          padding: '24px',
        }}
      >
        <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {stats?.length > 0 && stats?.map((stat) => <DashboardCard key={stat.type} data={stat} />)}
        </div>
      </div>

      <Table
        className="ads-table w-max min-w-full"
        colCount={7}
        rowCount={paginatedCampaigns?.length}
      >
        <Thead>
          <Tr className={TrStyles}>
            <Th onClick={() => handleSortChange('campaign_name')} style={{ paddingInline: 24 }}>
              <div className="flex gap-2 items-center cursor-pointer">
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Campaign
                </Typography>
                {sort.field === 'campaign_name' &&
                  (sort.order === 'ASC' ? (
                    <CarretDown className="size-2" />
                  ) : (
                    <CarretUp className="size-2" />
                  ))}
              </div>
            </Th>
            <Th onClick={() => handleSortChange('min_date')}>
              <div className="flex gap-2 items-center cursor-pointer">
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Date
                </Typography>
                {sort.field === 'min_date' &&
                  (sort.order === 'ASC' ? (
                    <CarretDown className="size-2" />
                  ) : (
                    <CarretUp className="size-2" />
                  ))}
              </div>
            </Th>
            <Th onClick={() => handleSortChange('campaign_status')}>
              <div className="flex gap-2 items-center cursor-pointer">
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Status
                </Typography>
                {sort.field === 'campaign_status' &&
                  (sort.order === 'ASC' ? (
                    <CarretDown className="size-2" />
                  ) : (
                    <CarretUp className="size-2" />
                  ))}
              </div>
            </Th>
            <Th>
              <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                Ads
              </Typography>
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
                  Avg. CTR
                </Typography>
                {sort.field === 'ctr' &&
                  (sort.order === 'ASC' ? (
                    <CarretDown className="size-2" />
                  ) : (
                    <CarretUp className="size-2" />
                  ))}
              </div>
            </Th>
            <Th onClick={() => handleSortChange('campaign_entity_name')}>
              <div className="flex gap-2 items-center cursor-pointer">
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Entity Name
                </Typography>
                {sort.field === 'campaign_entity_name' &&
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
          {paginatedCampaigns?.length > 0 ? (
            paginatedCampaigns?.map((c, idx) => (
              <Tr
                key={idx}
                onClick={(e) => handleRowClick(e, c.id)}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
                background={hoveredRow === idx ? 'neutral100' : 'transparent'}
                style={{
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <Td className={TdStyles} style={{ paddingInline: 24 }}>
                  <div className="flex flex-col">
                    <Typography
                      style={{
                        fontSize: 14,
                        lineheight: '20px',
                        fontWeight: 400,
                        // maxWidth: 200,
                        // whiteSpace: 'nowrap',
                        // overflow: 'hidden',
                        // textOverflow: 'ellipsis',
                      }}
                      title={c.campaign_name}
                    >
                      {c.campaign_name && c.campaign_name.length > 25
                        ? c.campaign_name.slice(0, 25) + '…'
                        : c.campaign_name}
                    </Typography>
                    {/* <Typography
                      textColor="neutral600"
                      style={{ fontSize: 10, lineheight: '20px', fontWeight: 400 }}
                    >
                      {c.campaign_id && c.campaign_id.length > 25
                        ? c.campaign_id.slice(0, 25) + '…'
                        : c.campaign_id}
                    </Typography> */}
                  </div>
                </Td>

                <Td className={TdStyles}>
                  <Typography style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}>
                    {c?.min_date ? format(new Date(c?.min_date), 'dd/MM/yyyy') : ''} -{' '}
                    {c?.max_date ? format(new Date(c?.max_date), 'dd/MM/yyyy') : ''}
                  </Typography>
                </Td>
                {/* Campaign status */}
                <Td className={TdStyles}>
                  <StatusBadge
                    status={
                      c?.campaign_status === 'active' && c?.min_date && new Date(c.min_date) > new Date()
                        ? 'active-scheduled'
                        : c?.campaign_status
                    }
                  />
                </Td>
                <Td className={TdStyles}>
                  <div className="flex flex-col">
                    <Typography style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}>
                      {formatNumber(c?.ads?.length < 10 ? `0${c?.ads?.length}` : c?.ads?.length)}
                    </Typography>
                    <Typography
                      textColor="neutral600"
                      style={{ fontSize: 10, lineheight: '20px', fontWeight: 400 }}
                    >
                      Advertisments
                    </Typography>
                  </div>
                </Td>
                <Td className={TdStyles}>
                  <Typography style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}>
                    {formatNumber(c?.total_impressions) ?? 0}
                  </Typography>
                </Td>
                <Td className={TdStyles}>
                  <Typography style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}>
                    {formatNumber(c?.total_clicks) ?? 0}
                  </Typography>
                </Td>
                <Td className={TdStyles}>
                  <Typography style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}>
                    {c?.ctr ? `${c?.ctr}%` : '0%'}
                  </Typography>
                </Td>
                <Td className={TdStyles}>
                  <Typography style={{ fontSize: 14, lineheight: '20px', fontWeight: 400 }}>
                    {c.campaign_entity_name && c.campaign_entity_name.length > 20
                      ? c.campaign_entity_name.slice(0, 20) + '…'
                      : c.campaign_entity_name}
                  </Typography>
                </Td>
                {/* Action menu for campaign */}
                <Td
                  background={hoveredRow === idx ? 'neutral100' : 'neutral0'}
                  className="sticky right-0 "
                  style={{
                    paddingInline: 18,
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <Flex justifyContent="left" className="gap-2">
                    {c?.campaign_status !== 'draft' && (
                      <CustomIconButton
                        onClick={() => history.push(`campaigns/report/${c.id}`)}
                        ariaLabel="View Analytics"
                      >
                        <Analytics />
                      </CustomIconButton>
                    )}

                    <ActionMenu cacheKey="list-view" data={c} filters={filters} />
                  </Flex>
                </Td>
              </Tr>
            ))
          ) : isLoading ? (
            <Tr>
              <Td colSpan={9}>
                <div
                  style={{ height: '50vh', width: '100%' }}
                  className="flex items-center justify-center"
                >
                  <Loader />
                </div>
              </Td>
            </Tr>
          ) : (
            <Tr>
              <Td colSpan={9}>
                <div
                  style={{ height: '50vh' }}
                  className="flex flex-col gap-4 items-center justify-center"
                >
                  {/* <EmptyDocuments className="size-40" /> */}
                  <div className="text-gray-500 text-lg">No content found</div>
                  <Button
                    variant="secondary"
                    startIcon={<Plus />}
                    onClick={() => history.push('campaigns/create')}
                  >
                    Create New Campaign
                  </Button>
                </div>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </>
  );
};

export default ListView;
