import type { SectionPanelProps } from './common.types';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import './common.scss';

export default function SectionPanel({
  children,
  className = '',
  component = 'article',
  emptyMetricLabel,
  eyebrow,
  id,
  metric,
  title,
}: SectionPanelProps) {
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
