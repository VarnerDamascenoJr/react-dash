import type { ReactNode } from 'react';

export interface EmptyStateProps {
  text: string;
}

export interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export interface MetricListItem {
  id: string;
  label: string;
  value: string;
}

export interface MetricListProps {
  items: MetricListItem[];
  emptyText: string;
}

export interface SectionPanelProps {
  children: ReactNode;
  className?: string;
  component?: 'article' | 'section';
  emptyMetricLabel?: string;
  eyebrow: string;
  id?: string;
  metric?: string;
  title: string;
}
