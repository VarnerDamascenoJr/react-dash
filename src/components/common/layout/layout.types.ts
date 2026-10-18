import type { ReactNode } from 'react';

export interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
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
