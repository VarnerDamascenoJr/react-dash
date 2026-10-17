import type { ReactNode } from 'react';

export type WidgetType = 'user' | 'order' | 'earnings' | 'balance';

export interface WidgetData {
  title: string;
  isMoney: boolean;
  link: string;
  icon: ReactNode;
}

export interface WidgetProps {
  type: WidgetType;
}
