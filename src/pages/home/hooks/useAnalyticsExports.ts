import type { ExportFeedback } from '../home.types';
import { downloadCsv, downloadJson } from '../../../utils/download';
import { useRef, useState } from 'react';
import {
  AnalyticsExportError,
  buildEventCsvRows,
  buildExportFileName,
  buildWindowCsvRows,
  downloadChartPng,
  type SalesAnalyticsDocument,
} from '../../../analytics';
import { useTranslation } from 'react-i18next';

export function useAnalyticsExports(document: SalesAnalyticsDocument) {
  const { t } = useTranslation('home');
  const [feedback, setFeedback] = useState<ExportFeedback | null>(null);
  const eventsChartRef = useRef<HTMLDivElement>(null);
  const eventTypesChartRef = useRef<HTMLDivElement>(null);

  const fileName = (suffix: string, extension: string) =>
    buildExportFileName(document.generatedAt, suffix, extension);

  const exportJson = () => {
    downloadJson(fileName('export', 'json'), document);
    setFeedback({ kind: 'success', key: 'json' });
  };

  const exportEventsCsv = () => {
    downloadCsv(fileName('events', 'csv'), buildEventCsvRows(document));
    setFeedback({ kind: 'success', key: 'csvEvents' });
  };

  const exportWindowsCsv = () => {
    downloadCsv(fileName('windows', 'csv'), buildWindowCsvRows(document));
    setFeedback({ kind: 'success', key: 'csvWindows' });
  };

  const exportPng = async (suffix: string, container: HTMLElement | null) => {
    try {
      await downloadChartPng(fileName(suffix, 'png'), container);
      setFeedback({ kind: 'success', key: 'png' });
    } catch (error) {
      setFeedback({ kind: 'error', key: error instanceof AnalyticsExportError ? error.code : 'unknown' });
    }
  };

  return {
    exportMessage: feedback
      ? feedback.kind === 'success'
        ? t(`exportStatus.${feedback.key}`)
        : t(`exportErrors.${feedback.key}`)
      : '',
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
