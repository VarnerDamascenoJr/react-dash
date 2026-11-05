import type { ChartPanelProps } from './charts.types';
import { Box } from '@mui/material';
import SectionPanel from '../layout/SectionPanel';
import './charts.scss';

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
    <SectionPanel
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
    </SectionPanel>
  );
}
