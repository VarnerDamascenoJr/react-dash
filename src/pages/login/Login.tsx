import { Box, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/common/controls/LanguageSelector';
import Brand from '../../components/common/branding/Brand';
import { demoLoginEmail, demoLoginPassword } from '../../config/auth';
import LoginForm from './components/LoginForm';
import { useLoginForm } from './hooks/useLoginForm';
import './login.scss';

const Login = () => {
  const { t } = useTranslation('login');
  const { values, error, isSubmitting, updateField, handleSubmit } = useLoginForm();

  return (
    <Box component="main" className="loginPage">
      <Stack className="loginPage__panel">
        <Box className="loginPage__language">
          <LanguageSelector />
        </Box>
        <Brand className="loginPage__brand" subtitle={t('subtitle')} />

        <Box component="header" className="loginPage__hero">
          <Typography component="span" variant="overline" className="eyebrow">
            {t('eyebrow')}
          </Typography>
          <Typography component="h1" variant="h2" fontWeight={700}>
            {t('title')}
          </Typography>
          <Typography>{t('description')}</Typography>
        </Box>

        <LoginForm
          values={values}
          error={error}
          isSubmitting={isSubmitting}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
        />

        <Stack className="loginPage__demoHint" id="login-demo-hint">
          <Typography component="span" variant="body2">{t('demoAccess')}</Typography>
          <Typography component="strong" variant="inherit" fontWeight={700}>
            {demoLoginEmail} / {demoLoginPassword}
          </Typography>
        </Stack>
      </Stack>
      <Box component="aside" className="loginPage__aside" aria-labelledby="login-overview-title">
        <Paper className="insightCard" elevation={0}>
          <Typography component="span" variant="overline" className="eyebrow">
            {t('asideEyebrow')}
          </Typography>
          <Typography component="h2" variant="h4" fontWeight={700} id="login-overview-title">
            {t('asideTitle')}
          </Typography>
          <Box component="ul">
            <Box component="li">{t('features.analytics')}</Box>
            <Box component="li">{t('features.demo')}</Box>
            <Box component="li">{t('features.exports')}</Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
