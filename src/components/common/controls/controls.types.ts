import type { IconButtonProps } from '@mui/material';

export interface TooltipIconButtonProps extends Omit<IconButtonProps, 'aria-label'> {
  label: string;
}
