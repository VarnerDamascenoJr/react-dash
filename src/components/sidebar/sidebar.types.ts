import type { ReactNode } from 'react';

export interface SidebarNavItem {
  className?: string;
  end?: boolean;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  to?: string;
}

export interface SidebarNavSectionProps {
  items: SidebarNavItem[];
  title: string;
}

export interface SidebarNavEntryProps {
  item: SidebarNavItem;
}
