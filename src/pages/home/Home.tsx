import { useEffect, useMemo, useRef, useState } from 'react';
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
  type SalesAnalyticsDocument,
} from '../../analytics';
import {
  loadSalesAnalyticsSettings,
  saveSalesAnalyticsSettings,
} from '../../config/salesApi';
import AnalyticsCharts from './components/AnalyticsCharts';
import AnalyticsControls from './components/AnalyticsControls';
import AnalyticsHeader from './components/AnalyticsHeader';
import EventsTable from './components/EventsTable';
import ExportPanel from './components/ExportPanel';
import InsightPanels from './components/InsightPanels';
import KpiGrid from './components/KpiGrid';
import { homeCopy } from './copy';
import { formatCurrency, formatInteger } from './formatters';
import './home.scss';

const Home = () => {
  const initialSettings = useMemo(
    () =>
      loadSalesAnalyticsSettings(
        localSalesAnalyticsFixture.source.salesEventId ?? ''
      ),
    []
  );
  const [document, setDocument] = useState<SalesAnalyticsDocument>(
    localSalesAnalyticsFixture
  );
  const [source, setSource] = useState<'fixture' | 'api'>('fixture');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState(initialSettings.baseUrl);
  const [salesEventId, setSalesEventId] = useState(initialSettings.salesEventId);
  const [start, setStart] = useState(initialSettings.start);
  const [end, setEnd] = useState(initialSettings.end);
  const [limit, setLimit] = useState(initialSettings.limit);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMessage, setLoadMessage] = useState<string>(
    homeCopy.loadStatus.fixture
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

  const eventTypeData = Object.entries(document.summary.eventTypeCounts).map(
    ([name, total]) => ({ name, total })
  );

  useEffect(() => {
    saveSalesAnalyticsSettings({
      baseUrl,
      end,
      limit,
      salesEventId,
      start,
    });
  }, [baseUrl, end, limit, salesEventId, start]);

  const handleLoadApi = async () => {
    setIsLoading(true);
    const result = await loadSalesAnalyticsExport(
      {
        end,
        limit,
        salesEventId,
        start,
      },
      { apiKey, baseUrl }
    );
    setDocument(result.document);
    setSource(result.source);
    setLoadMessage(
      result.source === 'api'
        ? homeCopy.loadStatus.api
        : result.error?.message ?? homeCopy.loadStatus.fallback
    );
    setIsLoading(false);
  };

  const exportFileName = (suffix: string, extension: string) =>
    buildExportFileName(document.generatedAt, suffix, extension);

  const handleExportJson = () => {
    downloadJson(exportFileName('export', 'json'), document);
    setExportMessage(homeCopy.exportStatus.json);
  };

  const handleExportEventsCsv = () => {
    downloadCsv(exportFileName('events', 'csv'), eventCsvRows);
    setExportMessage(homeCopy.exportStatus.csvEvents);
  };

  const handleExportWindowsCsv = () => {
    downloadCsv(exportFileName('windows', 'csv'), windowCsvRows);
    setExportMessage(homeCopy.exportStatus.csvWindows);
  };

  const handleExportPng = async (
    suffix: string,
    container: HTMLElement | null
  ) => {
    try {
      await downloadChartPng(exportFileName(suffix, 'png'), container);
      setExportMessage(homeCopy.exportStatus.png);
    } catch (error) {
      setExportMessage(error instanceof Error ? error.message : 'Falha ao exportar PNG.');
    }
  };

  return (
    <div className="homePage">
      <AnalyticsHeader
        generatedAt={document.generatedAt}
        loadMessage={loadMessage}
        service={document.source.service}
        source={source}
      />

      <AnalyticsControls
        apiKey={apiKey}
        baseUrl={baseUrl}
        end={end}
        isLoading={isLoading}
        limit={limit}
        salesEventId={salesEventId}
        start={start}
        onApiKeyChange={setApiKey}
        onBaseUrlChange={setBaseUrl}
        onEndChange={setEnd}
        onLimitChange={setLimit}
        onLoadApi={handleLoadApi}
        onSalesEventIdChange={setSalesEventId}
        onStartChange={setStart}
      />

      <ExportPanel
        canExportEventTypesPng={eventTypeData.length > 0}
        canExportEventsCsv={eventCsvRows.length > 0}
        canExportWindowsCsv={windowCsvRows.length > 0}
        canExportWindowsPng={windowSeries.length > 0}
        exportMessage={exportMessage}
        onExportEventTypesPng={() =>
          handleExportPng('event-types-chart', eventTypesChartRef.current)
        }
        onExportEventsCsv={handleExportEventsCsv}
        onExportJson={handleExportJson}
        onExportWindowsCsv={handleExportWindowsCsv}
        onExportWindowsPng={() =>
          handleExportPng('events-chart', eventsChartRef.current)
        }
      />

      <KpiGrid
        items={[
          { label: homeCopy.kpis.eventCount, value: formatInteger(kpis.eventCount) },
          {
            label: homeCopy.kpis.completedSales,
            value: formatInteger(kpis.completedSales),
          },
          {
            label: homeCopy.kpis.observedRevenue,
            value: formatCurrency(kpis.observedRevenueCents),
          },
          {
            label: homeCopy.kpis.issuedTickets,
            value: formatInteger(kpis.issuedTickets),
          },
          { label: homeCopy.kpis.checkIns, value: formatInteger(kpis.checkIns) },
        ]}
      />

      <AnalyticsCharts
        eventTypeData={eventTypeData}
        eventTypesChartRef={eventTypesChartRef}
        eventsChartRef={eventsChartRef}
        windowSeries={windowSeries}
      />

      <InsightPanels funnelRows={funnelRows} survivalRows={survivalRows} />

      <EventsTable rows={eventRows} />
    </div>
  );
};

export default Home;
