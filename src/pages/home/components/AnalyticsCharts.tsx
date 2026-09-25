import type { RefObject } from 'react';
import Box from '@mui/material/Box';
import type { WindowSeriesPoint } from '../../../analytics';
import { homeCopy } from '../copy';
import { formatDateTime, formatInteger, formatShortTime } from '../formatters';
import ChartPanel from './charts/ChartPanel';
import TimeSeriesAreaChart from './charts/TimeSeriesAreaChart';
import VerticalDistributionBarChart from './charts/VerticalDistributionBarChart';

interface AnalyticsChartsProps {
  eventTypeData: Array<{
    name: string;
    total: number;
  }>;
  eventTypesChartRef: RefObject<HTMLDivElement>;
  eventsChartRef: RefObject<HTMLDivElement>;
  windowSeries: WindowSeriesPoint[];
}

export default function AnalyticsCharts({
  eventTypeData,
  eventTypesChartRef,
  eventsChartRef,
  windowSeries,
}: AnalyticsChartsProps) {
  const latestWindow = windowSeries[windowSeries.length - 1];

  return (
    <Box className="analyticsGrid" component="section">
      <ChartPanel
        containerRef={eventsChartRef}
        eyebrow={homeCopy.panels.windows.eyebrow}
        metric={latestWindow ? formatInteger(latestWindow.totalEvents) : '0'}
        title={homeCopy.panels.windows.title}
        wide
      >
        <TimeSeriesAreaChart
          data={windowSeries}
          dataKey="totalEvents"
          gradientId="eventsGradient"
          label={homeCopy.kpis.eventCount}
          stroke="#2c7be5"
          tooltipLabelFormatter={formatDateTime}
          xDataKey="windowStart"
          xTickFormatter={formatShortTime}
        />
      </ChartPanel>

      <ChartPanel
        compact
        containerRef={eventTypesChartRef}
        eyebrow={homeCopy.panels.eventTypes.eyebrow}
        title={homeCopy.panels.eventTypes.title}
      >
        <VerticalDistributionBarChart
          barColor="#f05d5e"
          categoryKey="name"
          data={eventTypeData}
          label={homeCopy.kpis.eventCount}
          valueKey="total"
        />
      </ChartPanel>
    </Box>
  );
}
