// @ts-nocheck
import { Box, Loader, Typography } from '@strapi/design-system';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';
import useDarkMode from '../../components/hooks/useDarkMode';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const chartConfig = {
  impressions: {
    label: 'Impressions',
    color: '#104EF5',
  },
  clicks: {
    label: 'Clicks',
    color: '#008B7E',
  },
};

const formatChartData = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData
    .map((item) => {
      try {
        return {
          date: item.label,
          impressions: Number(item.impressions) || 0,
          clicks: Number(item.clicks) || 0,
        };
      } catch (error) {
        console.error('Error formatting chart data:', error, item);
        return null;
      }
    })
    .filter(Boolean);
};

const PerformanceAnalytics = ({ data, isLoading }) => {
  const isDarkMode = useDarkMode();

  const chartData = React.useMemo(() => formatChartData(data), [data]);
  const labels = chartData.map((item) => item.date);
  const [visibleDatasets, setVisibleDatasets] = React.useState({
    impressions: true,
    clicks: true,
  });

  const labelColor = isDarkMode ? '#ffffff' : '#000000';

  const chartOptions = {
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
                text: dataset.label.toUpperCase(),
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
              const value = context.parsed.y.toString();

              const spacing = label === 'Clicks' ? '               ' : '     ';
              return `${label}${spacing}${value}`;
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
  };

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
        key={`performance-chart-${isDarkMode}`}
        redraw={true}
        data={{
          labels,
          datasets: [
            {
              label: 'Impressions',
              data: chartData.map((item) => item.impressions),
              borderWidth: 2,
              tension: 0,
              borderColor: chartConfig.impressions.color,
              backgroundColor: chartConfig.impressions.color,
              pointBackgroundColor: chartConfig.impressions.color,
              pointBorderColor: chartConfig.impressions.color,
              hidden: !visibleDatasets.impressions,
            },
            {
              label: 'Clicks',
              data: chartData.map((item) => item.clicks),
              borderWidth: 2,
              tension: 0,
              borderColor: chartConfig.clicks.color,
              backgroundColor: chartConfig.clicks.color,
              hidden: !visibleDatasets.clicks,
            },
          ],
        }}
        options={chartOptions}
      />
    </Box>
  );
};

export default PerformanceAnalytics;
