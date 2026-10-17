import type { ChartPanelProps } from '../../home.types';
import { Box } from '@mui/material';
import AnalyticsPanel from '../AnalyticsPanel';

export default function ChartPanel({
  children,
  compact = false,
  containerRef,
  emptyMetricLabel,
  eyebrow,
  metric,
  title,
  wide = false,
}: ChartPanelProps) {
  return (
    <AnalyticsPanel
      className={wide ? 'panelLarge' : ''}
      emptyMetricLabel={emptyMetricLabel}
      eyebrow={eyebrow}
      metric={metric}
      title={title}
    >
      <Box
        className={compact ? 'chartFrame compact' : 'chartFrame'}
        ref={containerRef}
      >
        {children}
      </Box>
    </AnalyticsPanel>
  );
}
