import type { ReactNode } from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

interface AnalyticsPanelProps {
  children: ReactNode;
  className?: string;
  component?: 'article' | 'section';
  emptyMetricLabel?: string;
  eyebrow: string;
  id?: string;
  metric?: string;
  title: string;
}

export default function AnalyticsPanel({
  children,
  className = '',
  component = 'article',
  emptyMetricLabel,
  eyebrow,
  id,
  metric,
  title,
}: AnalyticsPanelProps) {
  const panelClassName = className ? `panel ${className}` : 'panel';

  return (
    <Paper className={panelClassName} component={component} elevation={0} id={id}>
      <Stack className="panelHeader" direction="row">
        <Box className="panelHeader__copy">
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
        ) : emptyMetricLabel ? (
          <Chip
            className="panelHeader__emptyMetric"
            label={emptyMetricLabel}
            size="small"
            variant="outlined"
          />
        ) : null}
      </Stack>
      {children}
    </Paper>
  );
}
