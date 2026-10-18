import { Box, Typography } from '@mui/material';
import type { EmptyStateProps } from './feedback.types';
import './emptyState.scss';

export default function EmptyState({ text }: EmptyStateProps) {
  return (
    <Box className="emptyState">
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
}
