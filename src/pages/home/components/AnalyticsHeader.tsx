import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { homeCopy } from '../copy';
import { formatDateTime } from '../formatters';

interface AnalyticsHeaderProps {
  generatedAt: string;
  loadMessage: string;
  service: string;
  source: 'fixture' | 'api';
}

export default function AnalyticsHeader({
  generatedAt,
  loadMessage,
  service,
  source,
}: AnalyticsHeaderProps) {
  return (
    <Paper className="analyticsHeader" component="section" elevation={0}>
      <Box className="analyticsHeader__copy">
        <Typography
          className="analyticsHeader__eyebrow"
          component="span"
          variant="overline"
        >
          {homeCopy.header.eyebrow}
        </Typography>
        <Typography component="h2" variant="h3">
          {homeCopy.header.title}
        </Typography>
        <Typography component="p" variant="body1">
          {service} - gerado em {formatDateTime(generatedAt)}
        </Typography>
      </Box>
      <Stack className={`sourceBadge ${source}`}>
        <Typography component="span" variant="overline">
          {homeCopy.header.source}
        </Typography>
        <Chip
          className="sourceBadge__chip"
          label={
            source === 'api' ? homeCopy.source.api : homeCopy.source.fixture
          }
          size="small"
        />
        <Typography component="small" variant="caption">
          {loadMessage}
        </Typography>
      </Stack>
    </Paper>
  );
}
