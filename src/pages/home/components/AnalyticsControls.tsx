import { Box, Button, TextField } from '@mui/material';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import type { SalesAnalyticsSettings } from '../../../config/salesApi';
import { homeCopy } from '../copy';

interface AnalyticsControlsProps {
  apiKey: string;
  id?: string;
  isLoading: boolean;
  settings: SalesAnalyticsSettings;
  onApiKeyChange: (value: string) => void;
  onSettingsChange: (changes: Partial<SalesAnalyticsSettings>) => void;
  onLoadApi: () => void;
}

export default function AnalyticsControls({
  apiKey,
  id,
  isLoading,
  settings: { baseUrl, end, limit, salesEventId, start },
  onApiKeyChange,
  onSettingsChange,
  onLoadApi,
}: AnalyticsControlsProps) {
  return (
    <Box
      aria-label="Configurar fonte de dados"
      className="controlPanel"
      component="section"
      id={id}
    >
      <TextField
        label={homeCopy.controls.baseUrl}
        placeholder={homeCopy.placeholders.baseUrl}
        size="small"
        value={baseUrl}
        onChange={(event) => onSettingsChange({ baseUrl: event.target.value })}
      />
      <TextField
        label={homeCopy.controls.salesEvent}
        placeholder={homeCopy.placeholders.salesEvent}
        size="small"
        value={salesEventId}
        onChange={(event) => onSettingsChange({ salesEventId: event.target.value })}
      />
      <TextField
        label={homeCopy.controls.start}
        placeholder={homeCopy.placeholders.start}
        size="small"
        value={start}
        onChange={(event) => onSettingsChange({ start: event.target.value })}
      />
      <TextField
        label={homeCopy.controls.end}
        placeholder={homeCopy.placeholders.end}
        size="small"
        value={end}
        onChange={(event) => onSettingsChange({ end: event.target.value })}
      />
      <TextField
        label={homeCopy.controls.limit}
        inputProps={{ min: 1 }}
        size="small"
        type="number"
        value={limit}
        onChange={(event) => onSettingsChange({ limit: Number(event.target.value) })}
      />
      <TextField
        label={homeCopy.controls.apiKey}
        placeholder={homeCopy.placeholders.apiKey}
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
        {isLoading ? homeCopy.controls.loading : homeCopy.controls.loadApi}
      </Button>
    </Box>
  );
}
