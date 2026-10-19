export interface MetricListItem {
  id: string;
  label: string;
  value: string;
}

export interface MetricListProps {
  items: MetricListItem[];
  emptyText: string;
}
