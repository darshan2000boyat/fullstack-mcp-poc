/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import { Box } from '@strapi/design-system';
import { AnErrorOccurred, useFetchClient } from '@strapi/helper-plugin';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { Toaster } from '../../components/ui/sonner';
import '../../global.tailwind.css';
import pluginId from '../../pluginId';
import AdList from '../Ads/ad-list';
import AdReport from '../Ads/ad-report';
import CampaignAnalyticsReport from '../Campaign/campaign-analytics-reports';
import CampaignReport from '../Campaign/campaign-report';
import CreateCampaign from '../Campaign/create-campaign';
import EditCampaign from '../Campaign/edit-campaign';
import ViewCampaign from '../Campaign/view-campaign';
import HomePage from '../HomePage';

const App = () => {
  const { get } = useFetchClient();

  // Add dark mode class to body based on system preference
  useEffect(() => {
    const updateDarkMode = (e) => {
      const isDarkMode = e ? e.matches : window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    };

    // Set initial state
    updateDarkMode();

    // Listen for system theme changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', updateDarkMode);

    return () => {
      darkModeQuery.removeEventListener('change', updateDarkMode);
      document.body.classList.remove('dark-mode');
    };
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher: (url) => get(url),
      }}
    >
      <Toaster />
      <Box padding="30px">
        <Switch>
          <Route path={`/plugins/${pluginId}/campaigns`} component={HomePage} exact />
          <Route path={`/plugins/${pluginId}/campaigns/create`} component={CreateCampaign} />
          <Route path={`/plugins/${pluginId}/campaigns/edit/:id`} component={EditCampaign} />
          <Route path={`/plugins/${pluginId}/campaigns/view/:id`} component={ViewCampaign} />
          <Route path={`/plugins/${pluginId}/campaigns/report/:id`} component={CampaignReport} />
          <Route
            path={`/plugins/${pluginId}/campaign-analytics`}
            component={CampaignAnalyticsReport}
          />
          <Route path={`/plugins/${pluginId}/ads/report/:id`} component={AdReport} />
          <Route path={`/plugins/${pluginId}/ads`} component={AdList} />
          <Route component={AnErrorOccurred} />
        </Switch>
      </Box>
    </SWRConfig>
  );
};

export default App;
