import { Box, Typography } from '@mui/material';
import type { EmptyStateProps } from './common.types';
import './common.scss';

export default function EmptyState({ text }: EmptyStateProps) {
  return (
    <Box className="emptyState">
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
}
