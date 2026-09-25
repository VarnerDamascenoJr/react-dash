import type { ReactNode, RefObject } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
    <Paper
      className={wide ? 'panel panelLarge' : 'panel'}
      component="article"
      elevation={0}
    >
      <Stack className="panelHeader" direction="row">
        <Box>
          <Typography component="span" variant="overline">
            {eyebrow}
          </Typography>
          <Typography component="h3" variant="h6">
            {title}
          </Typography>
        </Box>
        {metric ? (
          <Typography component="strong" variant="h5">
            {metric}
          </Typography>
        ) : (
          <Chip
            className="panelHeader__emptyMetric"
            label={emptyMetricLabel}
            size="small"
            variant="outlined"
          />
        )}
      </Stack>
      <Box
        className={compact ? 'chartFrame compact' : 'chartFrame'}
        ref={containerRef}
      >
        {children}
      </Box>
    </Paper>
  );
}
