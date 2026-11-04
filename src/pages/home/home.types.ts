import type { RefObject } from 'react';
import type {
  AnalyticsEventRow,
  AnalyticsExportErrorCode,
  EventTypeDistributionPoint,
  FunnelStepRow,
  SalesAnalyticsDataSource,
  SurvivalSummaryRow,
  WindowSeriesPoint,
} from '../../analytics';
import type { SalesAnalyticsSettings } from '../../config/salesApi.types';

export interface AnalyticsControlsProps {
  apiKey: string;
  id?: string;
  isLoading: boolean;
  settings: SalesAnalyticsSettings;
  onApiKeyChange: (value: string) => void;
  onSettingsChange: (changes: Partial<SalesAnalyticsSettings>) => void;
  onLoadApi: () => void;
}

export interface AnalyticsHeaderProps {
  generatedAt: string;
  loadMessage: string;
  service: string;
  source: SalesAnalyticsDataSource;
}

export interface AnalyticsChartsProps {
  eventTypeData: EventTypeDistributionPoint[];
  eventTypesChartRef: RefObject<HTMLDivElement>;
  eventsChartRef: RefObject<HTMLDivElement>;
  id?: string;
  windowSeries: WindowSeriesPoint[];
}

export interface EventsTableProps {
  id?: string;
  rows: AnalyticsEventRow[];
}

export interface ExportPanelProps {
  canExportEventTypesPng: boolean;
  canExportEventsCsv: boolean;
  canExportWindowsCsv: boolean;
  canExportWindowsPng: boolean;
  exportMessage: string;
  id?: string;
  onExportEventTypesPng: () => void;
  onExportEventsCsv: () => void;
  onExportJson: () => void;
  onExportWindowsCsv: () => void;
  onExportWindowsPng: () => void;
}

export interface InsightPanelsProps {
  funnelId?: string;
  funnelRows: FunnelStepRow[];
  survivalId?: string;
  survivalRows: SurvivalSummaryRow[];
}

export interface KpiGridProps {
  items: Array<{
    label: string;
    value: string;
  }>;
}

export type ExportFeedback =
  | { kind: 'success'; key: 'json' | 'csvEvents' | 'csvWindows' | 'png' }
  | { kind: 'error'; key: AnalyticsExportErrorCode | 'unknown' };
