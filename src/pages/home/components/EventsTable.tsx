import { Box } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGrid, enUS, ptBR, type GridColDef } from '@mui/x-data-grid';
import type { AnalyticsEventRow } from '../../../analytics';
import { resolveLanguage } from '../../../i18n/preferences';
import { useAnalyticsFormatters } from '../useAnalyticsFormatters';
import AnalyticsPanel from './AnalyticsPanel';

interface EventsTableProps {
  id?: string;
  rows: AnalyticsEventRow[];
}

export default function EventsTable({ id, rows }: EventsTableProps) {
  const { t, i18n } = useTranslation('home');
  const { formatCurrency, formatDateTime } = useAnalyticsFormatters();
  const gridLocale = resolveLanguage(i18n.resolvedLanguage) === 'pt-BR' ? ptBR : enUS;
  const eventColumns = useMemo<GridColDef<AnalyticsEventRow>[]>(() => [
    {
      field: 'occurredAt',
      headerName: t('panels.eventsTable.columns.occurredAt'),
      valueFormatter: ({ value }) => formatDateTime(String(value)),
      flex: 1.3,
      minWidth: 180,
    },
    {
      field: 'eventType',
      headerName: t('panels.eventsTable.columns.eventType'),
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'saleId',
      headerName: t('panels.eventsTable.columns.saleId'),
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'status',
      headerName: t('panels.eventsTable.columns.status'),
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'provider',
      headerName: t('panels.eventsTable.columns.provider'),
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'amountCents',
      headerName: t('panels.eventsTable.columns.amountCents'),
      flex: 0.6,
      minWidth: 110,
      valueFormatter: ({ value }) => formatCurrency(Number(value || 0)),
    },
    {
      field: 'quantity',
      headerName: t('panels.eventsTable.columns.quantity'),
      width: 84,
    },
  ], [t, formatCurrency, formatDateTime]);

  return (
    <AnalyticsPanel
      className="eventPanel"
      component="section"
      eyebrow={t('panels.events.eyebrow')}
      id={id}
      metric={t('panels.events.count', { count: rows.length })}
      title={t('panels.events.title')}
    >
      <Box className="eventPanel__grid">
        <DataGrid
          autoHeight
          columns={eventColumns}
          density="compact"
          disableRowSelectionOnClick
          localeText={{
            ...gridLocale.components.MuiDataGrid.defaultProps.localeText,
            noRowsLabel: t('panels.eventsTable.noRows'),
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
