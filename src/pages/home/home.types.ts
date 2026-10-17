import type { ReactNode, RefObject } from 'react';
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

export interface AnalyticsPanelProps {
  children: ReactNode;
  className?: string;
  component?: 'article' | 'section';
  emptyMetricLabel?: string;
  eyebrow: string;
  id?: string;
  metric?: string;
  title: string;
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

export interface ChartPanelProps {
  children: ReactNode;
  compact?: boolean;
  containerRef: RefObject<HTMLDivElement>;
  emptyMetricLabel: string;
  eyebrow: string;
  metric?: string;
  title: string;
  wide?: boolean;
}

export interface TimeSeriesAreaChartProps<TData extends object> {
  data: TData[];
  dataKey: ChartDataKey<TData, number>;
  gradientId: string;
  label: string;
  valueFormatter: (value: number) => string;
  stroke: string;
  tooltipLabelFormatter: (value: string) => string;
  xDataKey: ChartDataKey<TData, string>;
  xTickFormatter: (value: string) => string;
}

export interface VerticalDistributionBarChartProps<TData extends object> {
  barColor: string;
  categoryKey: ChartDataKey<TData, string>;
  data: TData[];
  label: string;
  valueFormatter: (value: number) => string;
  valueKey: ChartDataKey<TData, number>;
  yAxisWidth?: number;
}

export type ChartDataKey<TData extends object, TValue> = Extract<{
  [TKey in keyof TData]-?: TData[TKey] extends TValue ? TKey : never;
}[keyof TData], string>;

export type ExportFeedback =
  | { kind: 'success'; key: 'json' | 'csvEvents' | 'csvWindows' | 'png' }
  | { kind: 'error'; key: AnalyticsExportErrorCode | 'unknown' };

export interface EmptyStateProps {
  text: string;
}
