import { useContext, useMemo, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './login.scss';
import { AuthContext, DemoAuthenticationError } from '../../context/authContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/language/LanguageSelector';
import type { LoginFeedback, LoginRedirectState } from './login.types';
import { demoLoginEmail, demoLoginPassword } from '../../config/auth';

const Login = () => {
  const { t } = useTranslation('login');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState(demoLoginEmail);
  const [password, setPassword] = useState(demoLoginPassword);
  const [error, setError] = useState<LoginFeedback>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = useMemo(() => {
    return (location.state as LoginRedirectState | null)?.from
      ?.pathname;
  }, [location.state]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(redirectPath || '/', { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof DemoAuthenticationError ? 'invalidCredentials' : 'authFailed'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginPage__panel">
        <div className="loginPage__language"><LanguageSelector /></div>
        <div className="loginPage__brand">
          <span className="brandMark">RD</span>
          <div>
            <strong>React Dash</strong>
            <span>{t('subtitle')}</span>
          </div>
        </div>

        <div className="loginPage__hero">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1>{t('title')}</h1>
          <p>
            {t('description')}
          </p>
        </div>

        <form className="loginForm" onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label htmlFor="email">{t('email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? <p className="errorMessage" role="alert">{t(error)}</p> : null}
          <button type="submit" disabled={isSubmitting}>
            {t(isSubmitting ? 'authenticating' : 'submit')}
          </button>
        </form>

        <div className="loginPage__demoHint">
          <span>{t('demoAccess')}</span>
          <strong>{demoLoginEmail} / {demoLoginPassword}</strong>
        </div>
      </div>
      <div className="loginPage__aside">
        <div className="insightCard">
          <span className="eyebrow">{t('asideEyebrow')}</span>
          <h2>{t('asideTitle')}</h2>
          <ul>
            <li>{t('features.analytics')}</li>
            <li>{t('features.demo')}</li>
            <li>{t('features.exports')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
