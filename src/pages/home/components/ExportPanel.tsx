import Button from '@mui/material/Button';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

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
    <section className="exportPanel" aria-label="Exportar dados analiticos">
      <div>
        <span>Exportacoes</span>
        <strong>Dados e graficos</strong>
        <small>
          {exportMessage ||
            'Baixe o documento bruto, CSVs ou os graficos visiveis.'}
        </small>
      </div>
      <div className="exportActions">
        <Button
          startIcon={<DataObjectOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportJson}
        >
          JSON bruto
        </Button>
        <Button
          disabled={!canExportEventsCsv}
          startIcon={<TableChartOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportEventsCsv}
        >
          CSV eventos
        </Button>
        <Button
          disabled={!canExportWindowsCsv}
          startIcon={<TableChartOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportWindowsCsv}
        >
          CSV janelas
        </Button>
        <Button
          disabled={!canExportWindowsPng}
          startIcon={<ImageOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportWindowsPng}
        >
          PNG janelas
        </Button>
        <Button
          disabled={!canExportEventTypesPng}
          startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
          type="button"
          variant="outlined"
          onClick={onExportEventTypesPng}
        >
          PNG tipos
        </Button>
      </div>
    </section>
  );
}
