import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, styled, alpha } from '@mui/material';

// Define styled components for the Dashboard
export const StatsCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  background: 'linear-gradient(135deg, rgba(9, 14, 44, 0.6) 0%, rgba(26, 16, 53, 0.7) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(79, 124, 255, 0.2)',
  overflow: 'hidden',
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 12px 20px -10px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

export const ChartCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  background: 'linear-gradient(135deg, rgba(9, 14, 44, 0.6) 0%, rgba(26, 16, 53, 0.7) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(79, 124, 255, 0.2)',
  overflow: 'hidden',
  height: '100%',
  padding: theme.spacing(2),
}));

export const TransactionItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  marginBottom: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.2s, background 0.2s',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-2px)',
  },
}));

export const GlowingValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.6)}`,
  fontWeight: 600,
}));

export const PositiveValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const NegativeValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

// Define props for ApexCharts component
export interface ChartProps {
  options?: any;
  series?: any;
  type?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';
  width?: string | number;
  height?: string | number;
}

// Fallback component when chart is loading
const ChartFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%" minHeight={200}>
    <CircularProgress />
  </Box>
);

// Create a fallback chart component
const FallbackChart = () => (
  <Box p={3}>
    <Typography color="text.secondary">Chart unavailable</Typography>
  </Box>
);

// Define a type-safe wrapper for ApexCharts
// This approach avoids the complex type issues with lazy imports
// Dynamically load the chart component instead of using React.lazy
const Chart: React.FC<ChartProps> = ({ options, series, type = 'line', height = 350, width = '100%' }) => {
  const [ApexChartComponent, setApexChartComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Dynamically import the ApexCharts component
    import('react-apexcharts')
      .then(module => {
        setApexChartComponent(() => module.default);
        setIsLoading(false);
      })
      .catch(error => {
        console.warn('Error loading ApexCharts:', error);
        setLoadError(true);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <ChartFallback />;
  }

  if (loadError || !ApexChartComponent) {
    return <FallbackChart />;
  }

  // Render the ApexCharts component with the provided props
  return (
    <ApexChartComponent
      options={options}
      series={series}
      type={type}
      height={height}
      width={width}
    />
  );
};

export default Chart; 