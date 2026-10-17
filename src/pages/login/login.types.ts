export type LoginFeedback = '' | 'invalidCredentials' | 'authFailed';

export interface LoginRedirectState {
  from?: { pathname?: string };
}
