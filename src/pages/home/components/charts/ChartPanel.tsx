import type { ReactNode, RefObject } from 'react';
import { Box } from '@mui/material';
import AnalyticsPanel from '../AnalyticsPanel';

interface ChartPanelProps {
  children: ReactNode;
  compact?: boolean;
  containerRef: RefObject<HTMLDivElement>;
  emptyMetricLabel: string;
  eyebrow: string;
  metric?: string;
  title: string;
  wide?: boolean;
}

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
