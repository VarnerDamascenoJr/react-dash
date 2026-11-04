import { Alert, Button, Paper, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { LoginFormProps } from '../login.types';

export default function LoginForm({
  values,
  error,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: LoginFormProps) {
  const { t } = useTranslation('login');
  const errorId = error ? 'login-error' : undefined;

  return (
    <Paper
      component="form"
      elevation={0}
      className="loginForm"
      onSubmit={onSubmit}
      aria-busy={isSubmitting}
      aria-describedby="login-demo-hint"
    >
      <TextField
        id="login-email"
        name="email"
        type="email"
        label={t('email')}
        autoComplete="username"
        required
        fullWidth
        disabled={isSubmitting}
        value={values.email}
        error={error === 'invalidCredentials'}
        inputProps={{ 'aria-describedby': errorId }}
        InputLabelProps={{ shrink: true }}
        onChange={(event) => onFieldChange('email', event.target.value)}
      />
      <TextField
        id="login-password"
        name="password"
        type="password"
        label={t('password')}
        autoComplete="current-password"
        required
        fullWidth
        disabled={isSubmitting}
        value={values.password}
        error={error === 'invalidCredentials'}
        inputProps={{ 'aria-describedby': errorId }}
        InputLabelProps={{ shrink: true }}
        onChange={(event) => onFieldChange('password', event.target.value)}
      />
      {error && (
        <Alert id="login-error" severity="error" variant="outlined">
          {t(error)}
        </Alert>
      )}
      <Button
        className="loginForm__submit"
        type="submit"
        variant="contained"
        disabled={isSubmitting}
      >
        {t(isSubmitting ? 'authenticating' : 'submit')}
      </Button>
    </Paper>
  );
}
