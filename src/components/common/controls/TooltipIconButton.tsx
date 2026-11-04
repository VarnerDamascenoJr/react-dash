import { IconButton, Tooltip } from '@mui/material';
import type { TooltipIconButtonProps } from './controls.types';

export default function TooltipIconButton({
  label,
  children,
  ...buttonProps
}: TooltipIconButtonProps) {
  return (
    <Tooltip title={label}>
      <IconButton {...buttonProps} aria-label={label}>
        {children}
      </IconButton>
    </Tooltip>
  );
}
