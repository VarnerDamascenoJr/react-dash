import { Box } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { AnalyticsEventRow } from '../../../analytics';
import { homeCopy } from '../copy';
import { formatCurrency, formatInteger } from '../formatters';
import AnalyticsPanel from './AnalyticsPanel';

const eventTableCopy = homeCopy.panels.eventsTable;

const eventColumns: GridColDef<AnalyticsEventRow>[] = [
  {
    field: 'occurredAt',
    headerName: eventTableCopy.columns.occurredAt,
    flex: 1.3,
    minWidth: 180,
  },
  {
    field: 'eventType',
    headerName: eventTableCopy.columns.eventType,
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'saleId',
    headerName: eventTableCopy.columns.saleId,
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'status',
    headerName: eventTableCopy.columns.status,
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'provider',
    headerName: eventTableCopy.columns.provider,
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'amountCents',
    headerName: eventTableCopy.columns.amountCents,
    flex: 0.6,
    minWidth: 110,
    valueFormatter: ({ value }) => formatCurrency(Number(value || 0)),
  },
  {
    field: 'quantity',
    headerName: eventTableCopy.columns.quantity,
    width: 84,
  },
];

interface EventsTableProps {
  rows: AnalyticsEventRow[];
}

export default function EventsTable({ rows }: EventsTableProps) {
  return (
    <AnalyticsPanel
      className="eventPanel"
      component="section"
      eyebrow={homeCopy.panels.events.eyebrow}
      metric={formatInteger(rows.length)}
      title={homeCopy.panels.events.title}
    >
      <Box className="eventPanel__grid">
        <DataGrid
          autoHeight
          columns={eventColumns}
          density="compact"
          disableRowSelectionOnClick
          localeText={{
            noRowsLabel: eventTableCopy.noRows,
            toolbarColumns: eventTableCopy.toolbarColumns,
            toolbarFilters: eventTableCopy.toolbarFilters,
          }}
          pageSizeOptions={[5, 10, 25]}
          rows={rows}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
        />
      </Box>
    </AnalyticsPanel>
  );
}
