import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { AnalyticsEventRow } from '../../../analytics';
import { formatCurrency, formatInteger } from '../formatters';

const eventColumns: GridColDef<AnalyticsEventRow>[] = [
  { field: 'occurredAt', headerName: 'Timestamp', flex: 1.3, minWidth: 180 },
  { field: 'eventType', headerName: 'Evento', flex: 1, minWidth: 150 },
  { field: 'saleId', headerName: 'Sale ID', flex: 0.8, minWidth: 120 },
  { field: 'status', headerName: 'Status', flex: 0.8, minWidth: 120 },
  { field: 'provider', headerName: 'Provider', flex: 0.8, minWidth: 120 },
  {
    field: 'amountCents',
    headerName: 'Valor',
    flex: 0.6,
    minWidth: 110,
    valueFormatter: ({ value }) => formatCurrency(Number(value || 0)),
  },
  { field: 'quantity', headerName: 'Qtd', width: 84 },
];

interface EventsTableProps {
  rows: AnalyticsEventRow[];
}

export default function EventsTable({ rows }: EventsTableProps) {
  return (
    <section className="panel eventPanel">
      <div className="panelHeader">
        <div>
          <span>Eventos brutos</span>
          <h3>Tabela analitica</h3>
        </div>
        <strong>{formatInteger(rows.length)}</strong>
      </div>
      <DataGrid
        autoHeight
        columns={eventColumns}
        density="compact"
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        rows={rows}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
      />
    </section>
  );
}
