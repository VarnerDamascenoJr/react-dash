import type { AnalyticsChartsProps } from '../home.types';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAnalyticsFormatters } from '../useAnalyticsFormatters';
import ChartPanel from '../../../components/common/charts/ChartPanel';
import TimeSeriesAreaChart from '../../../components/common/charts/TimeSeriesAreaChart';
import VerticalDistributionBarChart from '../../../components/common/charts/VerticalDistributionBarChart';

export default function AnalyticsCharts({
  eventTypeData,
  eventTypesChartRef,
  eventsChartRef,
  id,
  windowSeries,
}: AnalyticsChartsProps) {
  const { t } = useTranslation('home');
  const { formatDateTime, formatInteger, formatShortTime } = useAnalyticsFormatters();
  const latestWindow = windowSeries[windowSeries.length - 1];

  return (
    <Box className="analyticsGrid" component="section" id={id}>
      <ChartPanel
        containerRef={eventsChartRef}
        emptyMetricLabel={t('emptyStates.chartMetric')}
        eyebrow={t('panels.windows.eyebrow')}
        metric={latestWindow ? formatInteger(latestWindow.totalEvents) : '0'}
        title={t('panels.windows.title')}
        wide
      >
        <TimeSeriesAreaChart
          data={windowSeries}
          dataKey="totalEvents"
          gradientId="eventsGradient"
          label={t('kpis.eventCount')}
          valueFormatter={formatInteger}
          stroke="#2c7be5"
          tooltipLabelFormatter={formatDateTime}
          xDataKey="windowStart"
          xTickFormatter={formatShortTime}
        />
      </ChartPanel>

      <ChartPanel
        compact
        containerRef={eventTypesChartRef}
        emptyMetricLabel={t('emptyStates.chartMetric')}
        eyebrow={t('panels.eventTypes.eyebrow')}
        title={t('panels.eventTypes.title')}
      >
        <VerticalDistributionBarChart
          barColor="#f05d5e"
          categoryKey="name"
          data={eventTypeData}
          label={t('kpis.eventCount')}
          valueFormatter={formatInteger}
          valueKey="total"
        />
      </ChartPanel>
    </Box>
  );
}
