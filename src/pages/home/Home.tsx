import { useMemo } from 'react';
import {
  buildAnalyticsKpis,
  buildEventRows,
  buildFunnelRows,
  buildSurvivalSummaryRows,
  buildWindowSeries,
} from '../../analytics';
import AnalyticsCharts from './components/AnalyticsCharts';
import AnalyticsControls from './components/AnalyticsControls';
import AnalyticsHeader from './components/AnalyticsHeader';
import EventsTable from './components/EventsTable';
import ExportPanel from './components/ExportPanel';
import InsightPanels from './components/InsightPanels';
import KpiGrid from './components/KpiGrid';
import { homeCopy } from './copy';
import { formatCurrency, formatInteger } from './formatters';
import { homeSectionIds } from './sections';
import { useSalesAnalytics } from './hooks/useSalesAnalytics';
import { useAnalyticsExports } from './hooks/useAnalyticsExports';
import './home.scss';

const Home = () => {
  const {
    document,
    source,
    loadMessage,
    settings,
    updateSettings,
    apiKey,
    setApiKey,
    isLoading,
    loadApi,
  } = useSalesAnalytics();
  const exports = useAnalyticsExports(document);

  const kpis = useMemo(() => buildAnalyticsKpis(document), [document]);
  const windowSeries = useMemo(() => buildWindowSeries(document), [document]);
  const eventRows = useMemo(() => buildEventRows(document), [document]);
  const funnelRows = useMemo(() => buildFunnelRows(document), [document]);
  const survivalRows = useMemo(
    () => buildSurvivalSummaryRows(document),
    [document]
  );

  const eventTypeData = useMemo(
    () =>
      Object.entries(document.summary.eventTypeCounts).map(([name, total]) => ({
        name,
        total,
      })),
    [document]
  );

  return (
    <div className="homePage" id={homeSectionIds.overview}>
      <AnalyticsHeader
        generatedAt={document.generatedAt}
        loadMessage={loadMessage}
        service={document.source.service}
        source={source}
      />

      <AnalyticsControls
        apiKey={apiKey}
        id={homeSectionIds.settings}
        isLoading={isLoading}
        settings={settings}
        onApiKeyChange={setApiKey}
        onSettingsChange={updateSettings}
        onLoadApi={loadApi}
      />

      <ExportPanel
        canExportEventTypesPng={eventTypeData.length > 0}
        canExportEventsCsv={document.events.length > 0}
        canExportWindowsCsv={document.windows.length > 0}
        canExportWindowsPng={windowSeries.length > 0}
        exportMessage={exports.exportMessage}
        id={homeSectionIds.exports}
        onExportEventTypesPng={exports.exportEventTypesPng}
        onExportEventsCsv={exports.exportEventsCsv}
        onExportJson={exports.exportJson}
        onExportWindowsCsv={exports.exportWindowsCsv}
        onExportWindowsPng={exports.exportWindowsPng}
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
        eventTypesChartRef={exports.eventTypesChartRef}
        eventsChartRef={exports.eventsChartRef}
        id={homeSectionIds.windows}
        windowSeries={windowSeries}
      />

      <InsightPanels
        funnelId={homeSectionIds.funnel}
        funnelRows={funnelRows}
        survivalId={homeSectionIds.survival}
        survivalRows={survivalRows}
      />

      <EventsTable id={homeSectionIds.events} rows={eventRows} />
    </div>
  );
};

export default Home;
