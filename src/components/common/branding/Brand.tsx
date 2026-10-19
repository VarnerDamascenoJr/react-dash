import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { BrandProps } from './branding.types';
import './brand.scss';

export default function Brand({ subtitle, className = '' }: BrandProps) {
  const { t } = useTranslation('shell');

  return (
    <Stack direction="row" className={`brandIdentity ${className}`}>
      <Box className="brandMark">{t('brand.mark')}</Box>
      <Stack className="brandText">
        <Typography component="strong" variant="inherit" fontWeight={700}>
          {t('brand.name')}
        </Typography>
        <Typography component="span" variant="inherit">{subtitle}</Typography>
      </Stack>
    </Stack>
  );
}
