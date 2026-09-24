import { useMemo, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import {
  buildAnalyticsKpis,
  buildEventCsvRows,
  buildExportFileName,
  buildWindowCsvRows,
  buildEventRows,
  buildFunnelRows,
  buildSurvivalSummaryRows,
  buildWindowSeries,
  downloadChartPng,
  downloadCsv,
  downloadJson,
  loadSalesAnalyticsExport,
  localSalesAnalyticsFixture,
  type AnalyticsEventRow,
  type SalesAnalyticsDocument,
} from '../../analytics';
import './home.scss';

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

const Home = () => {
  const [document, setDocument] = useState<SalesAnalyticsDocument>(
    localSalesAnalyticsFixture
  );
  const [source, setSource] = useState<'fixture' | 'api'>('fixture');
  const [apiKey, setApiKey] = useState('');
  const [salesEventId, setSalesEventId] = useState(
    localSalesAnalyticsFixture.source.salesEventId ?? ''
  );
  const [limit, setLimit] = useState(2000);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMessage, setLoadMessage] = useState(
    'Fixture local carregada para desenvolvimento reproduzivel.'
  );
  const [exportMessage, setExportMessage] = useState('');
  const eventsChartRef = useRef<HTMLDivElement>(null);
  const eventTypesChartRef = useRef<HTMLDivElement>(null);

  const kpis = useMemo(() => buildAnalyticsKpis(document), [document]);
  const windowSeries = useMemo(() => buildWindowSeries(document), [document]);
  const eventRows = useMemo(() => buildEventRows(document), [document]);
  const eventCsvRows = useMemo(() => buildEventCsvRows(document), [document]);
  const windowCsvRows = useMemo(() => buildWindowCsvRows(document), [document]);
  const funnelRows = useMemo(() => buildFunnelRows(document), [document]);
  const survivalRows = useMemo(() => buildSurvivalSummaryRows(document), [document]);

  const latestWindow = windowSeries[windowSeries.length - 1];
  const eventTypeData = Object.entries(document.summary.eventTypeCounts).map(
    ([name, total]) => ({ name, total })
  );

  const handleLoadApi = async () => {
    setIsLoading(true);
    const result = await loadSalesAnalyticsExport(
      {
        limit,
        salesEventId,
      },
      { apiKey }
    );
    setDocument(result.document);
    setSource(result.source);
    setLoadMessage(
      result.source === 'api'
        ? 'Dados carregados da API local do Sales.'
        : result.error?.message ?? 'API indisponivel; usando fixture local.'
    );
    setIsLoading(false);
  };

  const exportFileName = (suffix: string, extension: string) =>
    buildExportFileName(document.generatedAt, suffix, extension);

  const handleExportJson = () => {
    downloadJson(exportFileName('export', 'json'), document);
    setExportMessage('JSON exportado com o documento bruto.');
  };

  const handleExportEventsCsv = () => {
    downloadCsv(exportFileName('events', 'csv'), eventCsvRows);
    setExportMessage('CSV de eventos exportado.');
  };

  const handleExportWindowsCsv = () => {
    downloadCsv(exportFileName('windows', 'csv'), windowCsvRows);
    setExportMessage('CSV de janelas exportado.');
  };

  const handleExportPng = async (
    suffix: string,
    container: HTMLElement | null
  ) => {
    try {
      await downloadChartPng(exportFileName(suffix, 'png'), container);
      setExportMessage('PNG do grafico exportado.');
    } catch (error) {
      setExportMessage(error instanceof Error ? error.message : 'Falha ao exportar PNG.');
    }
  };

  return (
    <div className="homePage">
      <section className="analyticsHeader">
        <div className="analyticsHeader__copy">
          <span className="analyticsHeader__eyebrow">Sales Event Analytics</span>
          <h2>Coleta operacional pronta para analise.</h2>
          <p>
            {document.source.service} · gerado em{' '}
            {formatDateTime(document.generatedAt)}
          </p>
        </div>
        <div className={`sourceBadge ${source}`}>
          <span>Fonte</span>
          <strong>{source === 'api' ? 'API local' : 'Fixture local'}</strong>
          <small>{loadMessage}</small>
        </div>
      </section>

      <section className="controlPanel" aria-label="Configurar fonte de dados">
        <label>
          <span>Sales event</span>
          <input
            value={salesEventId}
            onChange={(event) => setSalesEventId(event.target.value)}
            placeholder="salesEventId"
          />
        </label>
        <label>
          <span>Limit</span>
          <input
            min={1}
            type="number"
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
          />
        </label>
        <label>
          <span>API key</span>
          <input
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="X-API-Key"
            type="password"
          />
        </label>
        <button type="button" onClick={handleLoadApi} disabled={isLoading}>
          <RefreshOutlinedIcon fontSize="small" />
          {isLoading ? 'Carregando' : 'Carregar API'}
        </button>
      </section>

      <section className="exportPanel" aria-label="Exportar dados analiticos">
        <div>
          <span>Exportacoes</span>
          <strong>Dados e graficos</strong>
          <small>{exportMessage || 'Baixe o documento bruto, CSVs ou os graficos visiveis.'}</small>
        </div>
        <div className="exportActions">
          <button type="button" onClick={handleExportJson}>
            JSON bruto
          </button>
          <button
            type="button"
            onClick={handleExportEventsCsv}
            disabled={eventCsvRows.length === 0}
          >
            CSV eventos
          </button>
          <button
            type="button"
            onClick={handleExportWindowsCsv}
            disabled={windowCsvRows.length === 0}
          >
            CSV janelas
          </button>
          <button
            type="button"
            onClick={() => handleExportPng('events-chart', eventsChartRef.current)}
            disabled={windowSeries.length === 0}
          >
            PNG janelas
          </button>
          <button
            type="button"
            onClick={() => handleExportPng('event-types-chart', eventTypesChartRef.current)}
            disabled={eventTypeData.length === 0}
          >
            PNG tipos
          </button>
        </div>
      </section>

      <section className="kpiGrid">
        <KpiCard label="Eventos coletados" value={formatInteger(kpis.eventCount)} />
        <KpiCard label="Vendas concluidas" value={formatInteger(kpis.completedSales)} />
        <KpiCard
          label="Receita observada"
          value={formatCurrency(kpis.observedRevenueCents)}
        />
        <KpiCard label="Tickets emitidos" value={formatInteger(kpis.issuedTickets)} />
        <KpiCard label="Check-ins" value={formatInteger(kpis.checkIns)} />
      </section>

      <section className="analyticsGrid">
        <article className="panel panelLarge">
          <div className="panelHeader">
            <div>
              <span>Janelas 5m</span>
              <h3>Eventos por janela</h3>
            </div>
            <strong>{latestWindow ? formatInteger(latestWindow.totalEvents) : '0'}</strong>
          </div>
          <div className="chartFrame" ref={eventsChartRef}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={windowSeries} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="eventsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2c7be5" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#2c7be5" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
                <XAxis dataKey="windowStart" tickFormatter={formatShortTime} />
                <YAxis allowDecimals={false} width={36} />
                <Tooltip labelFormatter={formatDateTime} />
                <Area
                  dataKey="totalEvents"
                  fill="url(#eventsGradient)"
                  name="Eventos"
                  stroke="#2c7be5"
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader">
            <div>
              <span>Tipos de evento</span>
              <h3>Distribuicao coletada</h3>
            </div>
          </div>
          <div className="chartFrame compact" ref={eventTypesChartRef}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventTypeData} layout="vertical" margin={{ left: 8, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
                <XAxis allowDecimals={false} type="number" />
                <YAxis dataKey="name" type="category" width={132} />
                <Tooltip />
                <Bar dataKey="total" fill="#f05d5e" name="Eventos" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="insightGrid">
        <article className="panel">
          <div className="panelHeader">
            <div>
              <span>Funil</span>
              <h3>Conversao com incerteza</h3>
            </div>
          </div>
          {funnelRows.length === 0 ? (
            <EmptyState text="Sem segmentos de funil neste export." />
          ) : (
            <ul className="metricList">
              {funnelRows.slice(0, 5).map((row) => (
                <li key={row.id}>
                  <span>
                    {row.from} → {row.to}
                  </span>
                  <strong>{formatPercent(row.conversionProbability)}</strong>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader">
            <div>
              <span>Sobrevivencia</span>
              <h3>Tempo ate evento</h3>
            </div>
          </div>
          {survivalRows.length === 0 ? (
            <EmptyState text="Sem analises de sobrevivencia neste export." />
          ) : (
            <ul className="metricList">
              {survivalRows.map((row) => (
                <li key={row.id}>
                  <span>{row.eventName}</span>
                  <strong>{formatSeconds(row.p50Seconds)}</strong>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="panel eventPanel">
        <div className="panelHeader">
          <div>
            <span>Eventos brutos</span>
            <h3>Tabela analitica</h3>
          </div>
          <strong>{formatInteger(eventRows.length)}</strong>
        </div>
        <DataGrid
          autoHeight
          columns={eventColumns}
          density="compact"
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          rows={eventRows}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
        />
      </section>
    </div>
  );
};

interface KpiCardProps {
  label: string;
  value: string;
}

function KpiCard({ label, value }: KpiCardProps) {
  return (
    <article className="kpiCard">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="emptyState">{text}</div>;
}

function formatInteger(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency',
  }).format(cents / 100);
}

function formatDateTime(value: string) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatShortTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatPercent(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
    style: 'percent',
  }).format(value);
}

function formatSeconds(value: number | null) {
  if (value === null) {
    return '-';
  }

  return `${formatInteger(value)}s`;
}

export default Home;
