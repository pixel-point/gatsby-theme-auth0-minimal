import { useCallback, useMemo } from 'react';
import { navigate } from '@reach/router';
import { useAuthContext } from '../components/hoc/auth-context-provider';

const useIsAuthenticated = expiresAt => {
  return useMemo(() => {
    return new Date().getTime() < expiresAt;
  }, [expiresAt]);
};

const useAuth = () => {
  const { auth0, authState, updateAuthState } = useAuthContext();
  const isAuthenticated = useIsAuthenticated(authState.expiresAt);

  const login = useCallback(() => {
    // Save postLoginUrl so we can redirect user back to where they left off after login screen
    localStorage.setItem('postLoginUrl', window.location.pathname);
    auth0.authorize();
  }, [auth0]);

  const scheduleRenewal = expiresAt => {
    if (!isAuthenticated || !expiresAt) return;
    // clear previous schedule
    if (authState.unschedule) authState.unschedule();
    // Use the delay in a timer to
    // run the refresh at the proper time
    const refreshAt = Math.max(1, expiresAt - 1000 * 30); // Refresh 30 seconds before expiry
    const activateTimer = setTimeout(() => {
      // Once the delay time from above is
      // reached, get a new JWT and schedule
      // additional refreshes
      checkSession();
    }, refreshAt);
    // set clear timeout cb to state to be able
    // remove schedule
    updateAuthState({
      ...authState,
      unschedule: () => clearTimeout(activateTimer),
    });
  };

  const setSession = useCallback(
    authResult => {
      localStorage.setItem('isLoggedIn', true);
      updateAuthState({
        accessToken: authResult.accessToken,
        idToken: authResult.idToken,
        expiresAt: authResult.expiresIn * 1000 + new Date().getTime(),
        user: authResult.idTokenPayload,
      });
      scheduleRenewal(authResult.expiresIn * 1000);
    },
    [updateAuthState]
  );

  const checkSession = useCallback(() => {
    auth0.checkSession({}, (err, authResult) => {
      if (err && err.error === 'login_required') {
        // User has been logged out from Auth0 server.
        // Remove local session.
        localLogout();
      } else if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(authResult);
      }
    });
  }, []);

  const localLogout = useCallback(() => {
    // Remove tokens and user profile
    updateAuthState({
      ...authState,
      accessToken: null,
      idToken: null,
      user: null,
      expiresAt: 0,
    });

    localStorage.removeItem('isLoggedIn');
  }, [updateAuthState]);

  const logout = useCallback(() => {
    localLogout();
    auth0.logout({
      returnTo: window.location.origin,
    });
  }, [auth0]);

  const handleAuthentication = useCallback(() => {
    auth0.parseHash((err, authResult) => {
      if (err) {
        navigate('/');
      } else if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(authResult);
        const postLoginUrl = localStorage.getItem('postLoginUrl');
        localStorage.removeItem('postLoginUrl');
        if (postLoginUrl) {
          navigate(postLoginUrl);
        }
      }
    });
  }, []);

  return {
    login,
    logout,
    handleAuthentication,
    checkSession,
    isAuthenticated,
    authState,
  };
};

export default useAuth;
