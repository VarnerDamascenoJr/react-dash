import { List, ListItem, ListItemText, Typography } from '@mui/material';
import EmptyState from './EmptyState';
import type { MetricListProps } from './common.types';
import './common.scss';

export default function MetricList({ items, emptyText }: MetricListProps) {
  if (items.length === 0) return <EmptyState text={emptyText} />;

  return (
    <List className="metricList" disablePadding>
      {items.map(({ id, label, value }) => (
        <ListItem disableGutters key={id}>
          <ListItemText
            primary={<Typography component="span" variant="body2">{label}</Typography>}
          />
          <Typography component="strong" variant="subtitle1">{value}</Typography>
        </ListItem>
      ))}
    </List>
  );
}
