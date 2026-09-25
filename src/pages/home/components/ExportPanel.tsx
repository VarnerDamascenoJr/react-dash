import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { homeCopy } from '../copy';

interface ExportPanelProps {
  canExportEventTypesPng: boolean;
  canExportEventsCsv: boolean;
  canExportWindowsCsv: boolean;
  canExportWindowsPng: boolean;
  exportMessage: string;
  onExportEventTypesPng: () => void;
  onExportEventsCsv: () => void;
  onExportJson: () => void;
  onExportWindowsCsv: () => void;
  onExportWindowsPng: () => void;
}

export default function ExportPanel({
  canExportEventTypesPng,
  canExportEventsCsv,
  canExportWindowsCsv,
  canExportWindowsPng,
  exportMessage,
  onExportEventTypesPng,
  onExportEventsCsv,
  onExportJson,
  onExportWindowsCsv,
  onExportWindowsPng,
}: ExportPanelProps) {
  return (
    <Paper
      className="exportPanel"
      aria-label={homeCopy.exportPanel.ariaLabel}
      component="section"
      elevation={0}
    >
      <Stack className="exportPanel__copy">
        <Typography component="span" variant="overline">
          {homeCopy.exportPanel.title}
        </Typography>
        <Typography component="strong" variant="subtitle1">
          {homeCopy.exportPanel.subtitle}
        </Typography>
        <Typography component="small" variant="caption">
          {exportMessage || homeCopy.exportPanel.defaultMessage}
        </Typography>
      </Stack>
      <Stack className="exportActions" direction="row">
        <Button
          startIcon={<DataObjectOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportJson}
        >
          {homeCopy.exportPanel.json}
        </Button>
        <Button
          disabled={!canExportEventsCsv}
          startIcon={<TableChartOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportEventsCsv}
        >
          {homeCopy.exportPanel.csvEvents}
        </Button>
        <Button
          disabled={!canExportWindowsCsv}
          startIcon={<TableChartOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportWindowsCsv}
        >
          {homeCopy.exportPanel.csvWindows}
        </Button>
        <Button
          disabled={!canExportWindowsPng}
          startIcon={<ImageOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportWindowsPng}
        >
          {homeCopy.exportPanel.pngWindows}
        </Button>
        <Button
          disabled={!canExportEventTypesPng}
          startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportEventTypesPng}
        >
          {homeCopy.exportPanel.pngEventTypes}
        </Button>
      </Stack>
    </Paper>
  );
}
