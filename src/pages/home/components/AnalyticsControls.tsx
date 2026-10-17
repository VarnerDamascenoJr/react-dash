import type { AnalyticsControlsProps } from '../home.types';
import { Box, Button, TextField } from '@mui/material';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useTranslation } from 'react-i18next';

export default function AnalyticsControls({
  apiKey,
  id,
  isLoading,
  settings: { baseUrl, end, limit, salesEventId, start },
  onApiKeyChange,
  onSettingsChange,
  onLoadApi,
}: AnalyticsControlsProps) {
  const { t } = useTranslation('home');
  return (
    <Box
      aria-label={t('controls.ariaLabel')}
      className="controlPanel"
      component="section"
      id={id}
    >
      <TextField
        label={t('controls.baseUrl')}
        placeholder={t('placeholders.baseUrl')}
        size="small"
        value={baseUrl}
        onChange={(event) => onSettingsChange({ baseUrl: event.target.value })}
      />
      <TextField
        label={t('controls.salesEvent')}
        placeholder={t('placeholders.salesEvent')}
        size="small"
        value={salesEventId}
        onChange={(event) => onSettingsChange({ salesEventId: event.target.value })}
      />
      <TextField
        label={t('controls.start')}
        placeholder={t('placeholders.start')}
        size="small"
        value={start}
        onChange={(event) => onSettingsChange({ start: event.target.value })}
      />
      <TextField
        label={t('controls.end')}
        placeholder={t('placeholders.end')}
        size="small"
        value={end}
        onChange={(event) => onSettingsChange({ end: event.target.value })}
      />
      <TextField
        label={t('controls.limit')}
        inputProps={{ min: 1 }}
        size="small"
        type="number"
        value={limit}
        onChange={(event) => onSettingsChange({ limit: Number(event.target.value) })}
      />
      <TextField
        label={t('controls.apiKey')}
        placeholder={t('placeholders.apiKey')}
        size="small"
        type="password"
        value={apiKey}
        onChange={(event) => onApiKeyChange(event.target.value)}
      />
      <Button
        disabled={isLoading}
        startIcon={<RefreshOutlinedIcon fontSize="small" />}
        type="button"
        variant="contained"
        onClick={onLoadApi}
      >
        {isLoading ? t('controls.loading') : t('controls.loadApi')}
      </Button>
    </Box>
  );
}
