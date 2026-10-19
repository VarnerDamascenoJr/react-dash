import type { ReactNode, RefObject } from 'react';

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
