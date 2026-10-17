import type { FormEventHandler } from 'react';
import type { LoginFormValues } from '../../auth/auth.types';

export type LoginFeedback = '' | 'invalidCredentials' | 'authFailed';

export interface LoginFormProps {
  values: LoginFormValues;
  error: LoginFeedback;
  isSubmitting: boolean;
  onFieldChange: (field: keyof LoginFormValues, value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}
