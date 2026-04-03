// @ts-nocheck
import { Box, Flex, Loader, Typography } from '@strapi/design-system';
import { format } from 'date-fns';
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CustomBadge from '../../components/elements/badge';
import CustomIconButton from '../../components/elements/customIconButton';
import StatusBadge from '../../components/elements/statusBadge';
import useDarkMode from '../../components/hooks/useDarkMode';
import Analytics from '../../components/Icons/Analytics';
import {
  GanttContext,
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from '../../components/ui/shadcn-io/gantt';
import ActionMenu from './actionMenu';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Add CSS animation for popover
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -100%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -100%) scale(1);
    }
  }
`;
if (!document.head.querySelector('#popover-animations')) {
  style.id = 'popover-animations';
  document.head.appendChild(style);
}

// Reusable Ad Details Component
const AdDetailsCard = ({ ad, isDarkMode }) => (
  <Flex
    background="neutral0"
    gap={2}
    alignItems="center"
    // width="100%"
    style={{
      padding: '4px 8px',
      borderRadius: '16px',
      border: isDarkMode ? '1px solid rgba(255,255,255)' : '1px solid rgba(0,0,0)',
    }}
  >
    <Box
      as="img"
      src={ad.img || ''}
      alt={ad.name}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '6px',
        objectFit: 'cover',
      }}
    />
    <Flex direction="column" gap={1} alignItems="flex-start">
      <Typography
        variant="omega"
        fontWeight="regular"
        textColor="neutral800"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '20px',
          fontSize: '14px',
          fontWeight: '400',
        }}
        title={ad.name}
      >
        {ad.name}
      </Typography>
      <Flex gap={1} alignItems="center">
        {ad.status && (
          <StatusBadge
            size="s"
            status={
              ad.status === 'live' && ad.startAt && new Date(ad.startAt) > new Date()
                ? 'live-scheduled'
                : ad.status
            }
          />
        )}
        {ad.adType && <CustomBadge variant="draft">{ad.adType}</CustomBadge>}
        {ad.adSpot && <CustomBadge variant="grayOutline">{ad.adSpot}</CustomBadge>}
      </Flex>
      <Typography variant="pi" textColor="neutral600">
        {ad.startAt && !isNaN(ad.startAt) ? format(new Date(ad.startAt), 'dd/MM/yyyy') : ''}
        {' - '}
        {ad.endAt && !isNaN(ad.endAt) ? format(new Date(ad.endAt), 'dd/MM/yyyy') : ''}
      </Typography>
    </Flex>
  </Flex>
);

// Wrapper component to access GanttContext
const TimelineContent = ({
  groupedFeatures,
  filters,
  history,
  popoverPosition,
  setPopoverPosition,
  openPopoverId,
  setOpenPopoverId,
  isDarkMode,
  handleViewFeature,
  handleViewAd,
  handleCreateMarker,
  handleMoveFeature,
  onScrollToToday,
  hasMore,
  loadMore,
  isLoading,
}) => {
  const gantt = useContext(GanttContext);
  const sidebarRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Expose scrollToToday function
  useEffect(() => {
    if (gantt.scrollToFeature && onScrollToToday) {
      onScrollToToday.current = () => {
        const todayFeature = {
          id: 'today-scroll',
          startAt: new Date(),
        };
        gantt.scrollToFeature(todayFeature);
      };
    }
  }, [gantt.scrollToFeature, onScrollToToday]);

  // Infinite scrolling for sidebar
  useEffect(() => {
    const sidebar = document.querySelector('[data-roadmap-ui="gantt-sidebar"]');
    if (!sidebar) return;

    sidebarRef.current = sidebar;

    const handleScroll = () => {
      const scrollContainer = gantt.ref?.current;
      if (!scrollContainer) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      console.log('[TIMELINE SCROLL]', {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollPercentage: scrollPercentage.toFixed(2),
        hasMore,
        isLoadingMore,
        isLoading,
      });

      if (!hasMore) {
        console.log('[TIMELINE SCROLL] Not loading - no more data');
        return;
      }
      if (isLoading || isLoadingMore) {
        console.log('[TIMELINE SCROLL] Not loading - already loading');
        return;
      }

      // Only trigger if user has scrolled (scrollTop > 0) AND reached 80%
      if (scrollTop > 0 && scrollPercentage > 0.8) {
        console.log('[TIMELINE SCROLL] Triggering loadMore at', scrollPercentage.toFixed(2));
        setIsLoadingMore(true);
        loadMore();
      }
    };

    const scrollContainer = gantt.ref?.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [gantt.ref, hasMore, loadMore, isLoading, isLoadingMore]);

  // Reset isLoadingMore when loading completes
  useEffect(() => {
    if (!isLoading && isLoadingMore) {
      console.log('[TIMELINE LOADING] Loading completed, resetting isLoadingMore');
      // Add a small delay to prevent rapid-fire consecutive loads
      const timer = setTimeout(() => {
        console.log('[TIMELINE LOADING] isLoadingMore reset to false');
        setIsLoadingMore(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isLoadingMore]);

  // Reset isLoadingMore when filters change (groupedFeatures length drops significantly)
  const prevFeaturesLength = useRef(groupedFeatures.length);
  useEffect(() => {
    // If features array was reset (went back to small size), reset loading state
    if (prevFeaturesLength.current > 20 && groupedFeatures.length <= 20) {
      console.log('[TIMELINE FEATURES] Features reset detected, resetting isLoadingMore');
      setIsLoadingMore(false);
    }
    prevFeaturesLength.current = groupedFeatures.length;
  }, [groupedFeatures.length]);

  return (
    <>
      <GanttSidebar>
        {groupedFeatures.map((campaignData) => (
          <GanttSidebarGroup
            key={campaignData.id}
            header={
              <Box width="100%">
                <StatusBadge
                  status={
                    campaignData.campaign_status === 'active' &&
                    campaignData.startAt &&
                    new Date(campaignData.startAt) > new Date()
                      ? 'active-scheduled'
                      : campaignData.campaign_status
                  }
                />
                <Flex
                  className="gap-2"
                  style={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Flex direction="column" alignItems="flex-start">
                    <Typography
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '16px',
                        lineHeight: '20px',
                        fontWeight: '600',
                        maxWidth: '180px',
                      }}
                      title={campaignData.name}
                    >
                      {campaignData.name}
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: 400,
                        fontSize: '10px',
                        lineHeight: '20px',
                        color: '#62627B',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        maxWidth: '180px',
                      }}
                      title={campaignData.description}
                    >
                      {campaignData.description}
                    </Typography>
                  </Flex>
                  <Flex className="gap-2">
                    {campaignData?.campaign_status !== 'draft' && (
                      <CustomIconButton
                        onClick={() => history.push(`campaigns/report/${campaignData.id}`)}
                        ariaLabel="View Analytics"
                      >
                        <Analytics />
                      </CustomIconButton>
                    )}
                    <ActionMenu cacheKey="timeline-view" data={campaignData} filters={filters} />
                  </Flex>
                </Flex>
              </Box>
            }
          >
            {campaignData.ads.map((ad) => (
              <GanttSidebarItem feature={ad} key={ad.id} onSelectItem={handleViewFeature} />
            ))}
          </GanttSidebarGroup>
        ))}
      </GanttSidebar>

      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {groupedFeatures.map((campaignData) => (
            <GanttFeatureListGroup key={campaignData.id}>
              {campaignData.ads.map((ad) => (
                <div key={ad.id} style={{ width: '100%', marginBottom: '4px' }}>
                  <GanttFeatureItem {...ad}>
                    <Flex
                      gap={2}
                      alignItems="center"
                      width="100%"
                      style={{
                        overflow: 'hidden',
                        height: '100%',
                        padding: '0 4px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleViewAd(ad.id, ad.campaignId)}
                      onMouseEnter={(e) => {
                        setPopoverPosition({ x: e.clientX, y: e.clientY });
                        setOpenPopoverId(ad.id);
                      }}
                      onMouseLeave={() => {
                        setOpenPopoverId(null);
                      }}
                    >
                      <Box
                        as="img"
                        src={ad.img || ''}
                        alt={ad.name}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="omega"
                        fontWeight="medium"
                        textColor="neutral800"
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {ad.name}
                      </Typography>
                    </Flex>
                  </GanttFeatureItem>
                  {openPopoverId === ad.id && (
                    <div
                      onMouseEnter={() => setOpenPopoverId(ad.id)}
                      onMouseLeave={() => setOpenPopoverId(null)}
                      onClick={() => handleViewAd(ad.id, ad.campaignId)}
                      style={{
                        position: 'fixed',
                        top: popoverPosition.y,
                        left: popoverPosition.x,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 9999,
                        marginTop: '-8px',
                        transition:
                          'opacity 0.2s ease-in-out, top 0.15s ease-out, left 0.15s ease-out',
                        opacity: 1,
                        animation: 'fadeIn 0.2s ease-in-out',
                        cursor: 'pointer',
                      }}
                    >
                      <AdDetailsCard ad={ad} isDarkMode={isDarkMode} />
                    </div>
                  )}
                </div>
              ))}
            </GanttFeatureListGroup>
          ))}
        </GanttFeatureList>
        <GanttToday />
        <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
      </GanttTimeline>
    </>
  );
};

const TimelineView = forwardRef(
  ({ filters, isLoading, hasMore, loadMore, paginatedCampaigns = [] }, ref) => {
    const history = useHistory();
    const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
    const [openPopoverId, setOpenPopoverId] = useState(null);
    const isDarkMode = useDarkMode();
    const scrollToTodayRef = useRef(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Expose scrollToToday method via ref
    useImperativeHandle(ref, () => ({
      scrollToToday: () => {
        if (scrollToTodayRef.current) {
          scrollToTodayRef.current();
        }
      },
    }));

    // Detect Strapi sidebar state (collapsed or open)
    useEffect(() => {
      const detectSidebarState = () => {
        // Try to find the Strapi sidebar element
        const strapiSidebar = document.querySelector('nav');
        if (strapiSidebar) {
          const width = strapiSidebar.offsetWidth;
          // Sidebar is collapsed if width is less than 200px
          setIsSidebarCollapsed(width < 200);
        }
      };

      // Initial detection
      detectSidebarState();

      // Watch for sidebar changes using MutationObserver
      const observer = new MutationObserver(detectSidebarState);
      const targetNode = document.body;

      if (targetNode) {
        observer.observe(targetNode, {
          attributes: true,
          attributeFilter: ['class', 'style'],
          subtree: true,
        });
      }

      // Also listen for resize events
      window.addEventListener('resize', detectSidebarState);

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', detectSidebarState);
      };
    }, []);

    // Transform campaigns directly for rendering - preserves API order
    const groupedFeatures =
      paginatedCampaigns?.map((c) => {
        const adsArray = Array.isArray(c.ads) ? c.ads : [];

        return {
          id: c.id,
          name: capitalize(c.campaign_name),
          startAt: c.min_date ? new Date(c.min_date) : null,
          endAt: c.max_date ? new Date(c.max_date) : null,
          campaign_status: c?.campaign_status,
          description: c.campaign_id,
          // Map ads as features for this group
          ads: adsArray.map((ad) => ({
            id: ad.id,
            campaignId: c.id,
            name: capitalize(ad.ad_name),
            startAt: ad.ad_start_date ? new Date(ad.ad_start_date) : null,
            endAt: ad.ad_end_date ? new Date(ad.ad_end_date) : null,
            img: ad.ad_image?.url ?? '',
            adType: ad?.ad_type?.title ?? null,
            adSpot: ad?.ad_spot?.ad_spot_title ?? null,
            status: c?.campaign_status === 'draft' ? 'draft' : ad?.ad_status,
            description: ad.ad_description,
          })),
        };
      }) || [];

    // console.log('Grouped Features:', groupedFeatures);

    const handleViewFeature = (id) => {
      // This is for sidebar - just logs, scrolling is handled by GanttSidebarItem
      console.log(`Feature selected: ${id}`);
    };

    const handleViewAd = (adId, campaignId) => {
      history.push(`campaigns/edit/${campaignId}?ad=${adId}`);
    };

    const handleCreateMarker = (date) => console.log(`Create marker: ${date.toISOString()}`);

    const handleMoveFeature = (id, startAt, endAt) => {
      if (!endAt) {
        return;
      }

      // Note: Since groupedFeatures is now derived directly from paginatedCampaigns,
      // moving features would require updating the parent state
      // This functionality may need to be implemented at the parent level
      console.log(`Move feature: ${id} from ${startAt} to ${endAt}`);
    };

    const handleAddFeature = (date) => console.log(`Add feature: ${date.toISOString()}`);

    // Map view modes to Gantt range
    const getRangeFromViewMode = (mode) => {
      switch (mode) {
        case 'daily':
          return 'daily';
        case 'weekly':
          return 'weekly';
        case 'monthly':
          return 'monthly';
        case 'yearly':
          return 'quarterly';
        default:
          return 'daily';
      }
    };

    // Show overlay loader when loading (initial or filter change)
    const showOverlayLoader = isLoading && (!hasMore || groupedFeatures.length === 0);

    if (!isLoading && groupedFeatures.length === 0) {
      return (
        <div
          style={{ height: '50vh', width: '100%' }}
          className="flex flex-col gap-4 items-center justify-center"
        >
          <div className="text-gray-500 text-lg">No content found</div>
        </div>
      );
    }

    return (
      <div
        style={{
          width: isSidebarCollapsed ? 'calc(100vw - 133px)' : 'calc(100vw - 269px)',
          height: '72vh',
          paddingTop: '16px',
          position: 'relative',
        }}
      >
        {/* Loading overlay for initial load and filter changes */}
        {showOverlayLoader && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)',
              zIndex: 1001,
              backdropFilter: 'blur(2px)',
            }}
          >
            <Loader />
          </div>
        )}

        <GanttProvider className="border" range={getRangeFromViewMode(filters.viewMode)} zoom={100}>
          <TimelineContent
            groupedFeatures={groupedFeatures}
            filters={filters}
            history={history}
            popoverPosition={popoverPosition}
            setPopoverPosition={setPopoverPosition}
            openPopoverId={openPopoverId}
            setOpenPopoverId={setOpenPopoverId}
            isDarkMode={isDarkMode}
            handleViewFeature={handleViewFeature}
            handleViewAd={handleViewAd}
            handleCreateMarker={handleCreateMarker}
            handleMoveFeature={handleMoveFeature}
            onScrollToToday={scrollToTodayRef}
            hasMore={hasMore}
            loadMore={loadMore}
            isLoading={isLoading}
          />
        </GanttProvider>

        {/* Infinite scroll loading indicator - bottom badge */}
        {isLoading && hasMore && groupedFeatures.length > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              padding: '8px 16px',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Flex alignItems="center" gap={2}>
              <Loader small />
              <Typography variant="pi" textColor="neutral600">
                Loading more...
              </Typography>
            </Flex>
          </div>
        )}
      </div>
    );
  }
);

TimelineView.displayName = 'TimelineView';

export default TimelineView;
