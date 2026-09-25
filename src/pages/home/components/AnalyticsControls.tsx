import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

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
    <section className="controlPanel" aria-label="Configurar fonte de dados">
      <TextField
        label="Base URL"
        placeholder="/api"
        size="small"
        value={baseUrl}
        onChange={(event) => onBaseUrlChange(event.target.value)}
      />
      <TextField
        label="Sales event"
        placeholder="salesEventId"
        size="small"
        value={salesEventId}
        onChange={(event) => onSalesEventIdChange(event.target.value)}
      />
      <TextField
        label="Start"
        placeholder="2026-09-01T10:00:00Z"
        size="small"
        value={start}
        onChange={(event) => onStartChange(event.target.value)}
      />
      <TextField
        label="End"
        placeholder="2026-09-02T00:00:00Z"
        size="small"
        value={end}
        onChange={(event) => onEndChange(event.target.value)}
      />
      <TextField
        label="Limite"
        inputProps={{ min: 1 }}
        size="small"
        type="number"
        value={limit}
        onChange={(event) => onLimitChange(Number(event.target.value))}
      />
      <TextField
        label="API key"
        placeholder="X-API-Key"
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
        {isLoading ? 'Carregando' : 'Carregar API'}
      </Button>
    </section>
  );
}
