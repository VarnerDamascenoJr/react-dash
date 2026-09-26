import { Box, Paper, Typography } from '@mui/material';

interface KpiGridProps {
  items: Array<{
    label: string;
    value: string;
  }>;
}

export default function KpiGrid({ items }: KpiGridProps) {
  return (
    <Box className="kpiGrid" component="section">
      {items.map((item) => (
        <Paper
          className="kpiCard"
          component="article"
          elevation={0}
          key={item.label}
        >
          <Typography component="span" variant="overline">
            {item.label}
          </Typography>
          <Typography component="strong" variant="h4">
            {item.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
