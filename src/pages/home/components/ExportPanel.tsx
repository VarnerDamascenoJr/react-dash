import Button from '@mui/material/Button';
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
    <section className="exportPanel" aria-label={homeCopy.exportPanel.ariaLabel}>
      <div>
        <span>{homeCopy.exportPanel.title}</span>
        <strong>{homeCopy.exportPanel.subtitle}</strong>
        <small>
          {exportMessage || homeCopy.exportPanel.defaultMessage}
        </small>
      </div>
      <div className="exportActions">
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
      </div>
    </section>
  );
}
