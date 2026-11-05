import { useContext, useRef, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { LoginFormValues } from '../../../auth/auth.types';
import { demoLoginEmail, demoLoginPassword } from '../../../config/auth';
import { AuthContext, DemoAuthenticationError } from '../../../context/authContext';
import type { LoginFeedback } from '../login.types';
import { getLoginRedirect } from '../loginRedirect';

export function useLoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState<LoginFormValues>({
    email: demoLoginEmail,
    password: demoLoginPassword,
  });
  const [error, setError] = useState<LoginFeedback>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const updateField = (field: keyof LoginFormValues, value: string) => {
    if (submittingRef.current) return;
    setValues((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current || !event.currentTarget.reportValidity()) return;

    // A ref also blocks repeated submit events before React renders disabled controls.
    submittingRef.current = true;
    setIsSubmitting(true);
    setError('');

    try {
      await login(values);
      navigate(getLoginRedirect(location.state), { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof DemoAuthenticationError
          ? 'invalidCredentials'
          : 'authFailed'
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return { values, error, isSubmitting, updateField, handleSubmit };
}
