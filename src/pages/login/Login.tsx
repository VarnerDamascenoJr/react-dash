import { useContext, useMemo, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './login.scss';
import { AuthContext } from '../../context/authContext';
import { demoLoginEmail, demoLoginPassword } from '../../config/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState(demoLoginEmail);
  const [password, setPassword] = useState(demoLoginPassword);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = useMemo(() => {
    return (location.state as { from?: { pathname?: string } } | null)?.from
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
        submitError instanceof Error
          ? submitError.message
          : 'Unable to authenticate.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginPage__panel">
        <div className="loginPage__brand">
          <span className="brandMark">RD</span>
          <div>
            <strong>React Dash</strong>
            <span>Operations command center</span>
          </div>
        </div>

        <div className="loginPage__hero">
          <span className="eyebrow">Sign in to continue</span>
          <h1>Run your dashboard from a cleaner, faster control room.</h1>
          <p>
            This demo login now protects the internal routes and keeps the
            session persisted locally.
          </p>
        </div>

        <form className="loginForm" onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? <p className="errorMessage">{error}</p> : null}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Enter dashboard'}
          </button>
        </form>

        <div className="loginPage__demoHint">
          <span>Demo access</span>
          <strong>{demoLoginEmail} / {demoLoginPassword}</strong>
        </div>
      </div>
      <div className="loginPage__aside">
        <div className="insightCard">
          <span className="eyebrow">Live overview</span>
          <h2>Everything important, without the dashboard clutter.</h2>
          <ul>
            <li>Protected routes for the internal admin area.</li>
            <li>Persistent local session for demo sign-in.</li>
            <li>Sharper visual foundation for the next product steps.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
