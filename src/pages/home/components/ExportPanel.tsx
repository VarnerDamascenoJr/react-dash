import type { ExportPanelProps } from '../home.types';
import { Button, Paper, Stack, Typography } from '@mui/material';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { useTranslation } from 'react-i18next';

export default function ExportPanel({
  canExportEventTypesPng,
  canExportEventsCsv,
  canExportWindowsCsv,
  canExportWindowsPng,
  exportMessage,
  id,
  onExportEventTypesPng,
  onExportEventsCsv,
  onExportJson,
  onExportWindowsCsv,
  onExportWindowsPng,
}: ExportPanelProps) {
  const { t } = useTranslation('home');
  return (
    <Paper
      className="exportPanel"
      aria-label={t('exportPanel.ariaLabel')}
      component="section"
      elevation={0}
      id={id}
    >
      <Stack className="exportPanel__copy">
        <Typography component="span" variant="overline">
          {t('exportPanel.title')}
        </Typography>
        <Typography component="strong" variant="subtitle1">
          {t('exportPanel.subtitle')}
        </Typography>
        <Typography component="small" variant="caption" role="status">
          {exportMessage || t('exportPanel.defaultMessage')}
        </Typography>
      </Stack>
      <Stack className="exportActions" direction="row">
        <Button
          startIcon={<DataObjectOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportJson}
        >
          {t('exportPanel.json')}
        </Button>
        <Button
          disabled={!canExportEventsCsv}
          startIcon={<TableChartOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportEventsCsv}
        >
          {t('exportPanel.csvEvents')}
        </Button>
        <Button
          disabled={!canExportWindowsCsv}
          startIcon={<TableChartOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportWindowsCsv}
        >
          {t('exportPanel.csvWindows')}
        </Button>
        <Button
          disabled={!canExportWindowsPng}
          startIcon={<ImageOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportWindowsPng}
        >
          {t('exportPanel.pngWindows')}
        </Button>
        <Button
          disabled={!canExportEventTypesPng}
          startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportEventTypesPng}
        >
          {t('exportPanel.pngEventTypes')}
        </Button>
      </Stack>
    </Paper>
  );
}
