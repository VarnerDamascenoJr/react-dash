import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { resolveLanguage } from '../../i18n/preferences';
import './languageSelector.scss';

export default function LanguageSelector() {
  const { t, i18n } = useTranslation('shell');

  return (
    <TextField
      className="languageSelector"
      label={t('language')}
      select
      SelectProps={{ native: true }}
      size="small"
      value={resolveLanguage(i18n.resolvedLanguage)}
      onChange={(event) => { void i18n.changeLanguage(event.target.value); }}
    >
      <option lang="pt-BR" value="pt-BR">Português (BR)</option>
      <option lang="en-US" value="en-US">English (US)</option>
    </TextField>
  );
}
