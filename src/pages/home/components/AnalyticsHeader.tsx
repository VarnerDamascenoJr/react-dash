import type { AnalyticsHeaderProps } from '../home.types';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAnalyticsFormatters } from '../useAnalyticsFormatters';

export default function AnalyticsHeader({
  generatedAt,
  loadMessage,
  service,
  source,
}: AnalyticsHeaderProps) {
  const { t } = useTranslation('home');
  const { formatDateTime } = useAnalyticsFormatters();
  return (
    <Paper className="analyticsHeader" component="section" elevation={0}>
      <Box className="analyticsHeader__copy">
        <Typography
          className="analyticsHeader__eyebrow"
          component="span"
          variant="overline"
        >
          {t('header.eyebrow')}
        </Typography>
        <Typography component="h2" variant="h3">
          {t('header.title')}
        </Typography>
        <Typography component="p" variant="body1">
          {t('header.generated', { service, date: formatDateTime(generatedAt) })}
        </Typography>
      </Box>
      <Stack className={`sourceBadge ${source}`}>
        <Typography component="span" variant="overline">
          {t('header.source')}
        </Typography>
        <Chip
          className="sourceBadge__chip"
          label={
            source === 'api' ? t('source.api') : t('source.fixture')
          }
          size="small"
        />
        <Typography component="small" variant="caption" role="status">
          {loadMessage}
        </Typography>
      </Stack>
    </Paper>
  );
}
