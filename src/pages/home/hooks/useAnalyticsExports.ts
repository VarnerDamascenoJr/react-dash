import { useRef, useState } from 'react';
import {
  buildEventCsvRows,
  buildExportFileName,
  buildWindowCsvRows,
  downloadChartPng,
  downloadCsv,
  downloadJson,
  type SalesAnalyticsDocument,
} from '../../../analytics';
import { homeCopy } from '../copy';

export function useAnalyticsExports(document: SalesAnalyticsDocument) {
  const [exportMessage, setExportMessage] = useState('');
  const eventsChartRef = useRef<HTMLDivElement>(null);
  const eventTypesChartRef = useRef<HTMLDivElement>(null);

  const fileName = (suffix: string, extension: string) =>
    buildExportFileName(document.generatedAt, suffix, extension);

  const exportJson = () => {
    downloadJson(fileName('export', 'json'), document);
    setExportMessage(homeCopy.exportStatus.json);
  };

  const exportEventsCsv = () => {
    downloadCsv(fileName('events', 'csv'), buildEventCsvRows(document));
    setExportMessage(homeCopy.exportStatus.csvEvents);
  };

  const exportWindowsCsv = () => {
    downloadCsv(fileName('windows', 'csv'), buildWindowCsvRows(document));
    setExportMessage(homeCopy.exportStatus.csvWindows);
  };

  const exportPng = async (suffix: string, container: HTMLElement | null) => {
    try {
      await downloadChartPng(fileName(suffix, 'png'), container);
      setExportMessage(homeCopy.exportStatus.png);
    } catch (error) {
      setExportMessage(
        error instanceof Error ? error.message : 'Falha ao exportar PNG.'
      );
    }
  };

  return {
    exportMessage,
    eventsChartRef,
    eventTypesChartRef,
    exportJson,
    exportEventsCsv,
    exportWindowsCsv,
    exportWindowsPng: () => exportPng('events-chart', eventsChartRef.current),
    exportEventTypesPng: () =>
      exportPng('event-types-chart', eventTypesChartRef.current),
  };
}
