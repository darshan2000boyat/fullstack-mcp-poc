// @ts-nocheck

import React from 'react';
import { format, parseISO } from 'date-fns';
import { Typography, Box, Loader } from '@strapi/design-system';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useDarkMode from '../../components/hooks/useDarkMode';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const chartConfig = {
  ctr: {
    label: 'CTR (%)',
    color: '#104EF5',
  },
};

const formatCTRChartData = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData
    .map((item) => {
      try {
        const { label, impressions, clicks } = item || {};

        const impressionNum = Number(impressions) || 0;
        const clickNum = Number(clicks) || 0;
        const ctr = impressionNum > 0 ? (clickNum / impressionNum) * 100 : 0;

        return {
          date: label,
          ctr: Number(ctr.toFixed(2)),
        };
      } catch (error) {
        console.error('Error formatting CTR data:', error, item);
        return null;
      }
    })
    .filter(Boolean);
};

const ClickThroughRateTrend = ({ data, isLoading }) => {
  const isDarkMode = useDarkMode();

  const chartData = React.useMemo(() => formatCTRChartData(data), [data]);
  const labels = chartData.map((item) => item.date);
  const [visibleDatasets, setVisibleDatasets] = React.useState({
    ctr: true,
  });

  const labelColor = isDarkMode ? '#ffffff' : '#000000';

  if (isLoading) {
    return (
      <Box className="h-[350px] w-full flex items-center justify-center">
        <Loader />
      </Box>
    );
  }

  if (!chartData.length) {
    return (
      <Box className="h-[350px] w-full">
        <Typography className="flex items-center justify-center h-full text-neutral500">
          No analytics data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="h-[350px] w-full">
      <Line
        key={`ctr-chart-${isDarkMode}`}
        redraw={true}
        data={{
          labels,
          datasets: [
            {
              label: 'CTR',
              data: chartData.map((item) => item.ctr),
              borderWidth: 2,
              tension: 0,
              borderColor: chartConfig.ctr.color,
              backgroundColor: chartConfig.ctr.color,
              pointBackgroundColor: chartConfig.ctr.color,
              pointBorderColor: chartConfig.ctr.color,
              hidden: !visibleDatasets.ctr,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 0,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'end',
              onClick: (e, legendItem, legend) => {
                const datasetLabel = legendItem.text.toLowerCase();
                setVisibleDatasets((prev) => ({
                  ...prev,
                  [datasetLabel]: !prev[datasetLabel],
                }));
              },
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 15,
                boxWidth: 8,
                boxHeight: 8,
                font: {
                  size: 14,
                  weight: 'normal',
                },
                color: labelColor,
                generateLabels: (chart) => {
                  const datasets = chart.data.datasets;
                  return datasets.map((dataset, i) => ({
                    text: dataset.label === 'CTR' ? 'CTR (%)' : dataset.label.toUpperCase(),
                    fillStyle: dataset.backgroundColor,
                    strokeStyle: dataset.borderColor,
                    lineWidth: 2,
                    hidden: dataset.hidden,
                    index: i,
                    fontColor: labelColor,
                  }));
                },
              },
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: {
                size: 14,
                weight: 'bold',
              },
              bodyFont: {
                size: 13,
              },
              padding: 12,
              cornerRadius: 8,
              displayColors: true,
              boxWidth: 12,
              boxHeight: 12,
              boxPadding: 8,
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  return `${label}       ${value}%`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: true,
              },
              offset: true,
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false,
              },
              ticks: {
                display: true,
              },
              grace: '10%',
            },
          },
        }}
      />
    </Box>
  );
};

export default ClickThroughRateTrend;
