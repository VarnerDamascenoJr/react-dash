import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { homeCopy } from '../copy';

interface AnalyticsControlsProps {
  apiKey: string;
  baseUrl: string;
  end: string;
  isLoading: boolean;
  limit: number;
  salesEventId: string;
  start: string;
  onApiKeyChange: (value: string) => void;
  onBaseUrlChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onLimitChange: (value: number) => void;
  onLoadApi: () => void;
  onSalesEventIdChange: (value: string) => void;
  onStartChange: (value: string) => void;
}

export default function AnalyticsControls({
  apiKey,
  baseUrl,
  end,
  isLoading,
  limit,
  salesEventId,
  start,
  onApiKeyChange,
  onBaseUrlChange,
  onEndChange,
  onLimitChange,
  onLoadApi,
  onSalesEventIdChange,
  onStartChange,
}: AnalyticsControlsProps) {
  return (
    <Box
      aria-label="Configurar fonte de dados"
      className="controlPanel"
      component="section"
    >
      <TextField
        label={homeCopy.controls.baseUrl}
        placeholder={homeCopy.placeholders.baseUrl}
        size="small"
        value={baseUrl}
        onChange={(event) => onBaseUrlChange(event.target.value)}
      />
      <TextField
        label={homeCopy.controls.salesEvent}
        placeholder={homeCopy.placeholders.salesEvent}
        size="small"
        value={salesEventId}
        onChange={(event) => onSalesEventIdChange(event.target.value)}
      />
      <TextField
        label={homeCopy.controls.start}
        placeholder={homeCopy.placeholders.start}
        size="small"
        value={start}
        onChange={(event) => onStartChange(event.target.value)}
      />
      <TextField
        label={homeCopy.controls.end}
        placeholder={homeCopy.placeholders.end}
        size="small"
        value={end}
        onChange={(event) => onEndChange(event.target.value)}
      />
      <TextField
        label={homeCopy.controls.limit}
        inputProps={{ min: 1 }}
        size="small"
        type="number"
        value={limit}
        onChange={(event) => onLimitChange(Number(event.target.value))}
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
