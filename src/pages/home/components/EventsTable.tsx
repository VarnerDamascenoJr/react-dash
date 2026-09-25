import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { AnalyticsEventRow } from '../../../analytics';
import { homeCopy } from '../copy';
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
    <Paper className="panel eventPanel" component="section" elevation={0}>
      <Stack className="panelHeader" direction="row">
        <Box>
          <Typography component="span" variant="overline">
            {homeCopy.panels.events.eyebrow}
          </Typography>
          <Typography component="h3" variant="h6">
            {homeCopy.panels.events.title}
          </Typography>
        </Box>
        <Typography component="strong" variant="h5">
          {formatInteger(rows.length)}
        </Typography>
      </Stack>
      <DataGrid
        autoHeight
        columns={eventColumns}
        density="compact"
        disableRowSelectionOnClick
        localeText={{
          noRowsLabel: homeCopy.panels.eventsTable.noRows,
          toolbarColumns: homeCopy.panels.eventsTable.toolbarColumns,
          toolbarFilters: homeCopy.panels.eventsTable.toolbarFilters,
        }}
        pageSizeOptions={[5, 10, 25]}
        rows={rows}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
      />
    </Paper>
  );
}
