import { WebAuth } from 'auth0-js';
import { navigate } from '@reach/router';

const AUTH0_CONFIG = {
  // required
  domain: process.env.GATSBY_AUTH0_DOMAIN,
  clientID: process.env.GATSBY_AUTH0_CLIENTID,
  redirectUri: process.env.GATSBY_AUTH0_CALLBACK,
  // optional
  responseType: process.env.GATSBY_AUTH0_RESPONSE_TYPE || 'token id_token',
  scope: process.env.GATSBY_AUTH0_SCOPE || 'openid profile email',
  audience: process.env.GATSBY_AUTH0_AUDIENCE || false,
};

// an object in which we are going to store auth0 response tokens
// could be stored in localStorage but this way is more
// safe
const tokens = {
  idToken: undefined,
  accessToken: undefined,
};

// an object that holds user profile
let user = undefined;

let sessionStateCb = () => {};

// helper functions
const isBrowser = typeof window !== `undefined`;

const doIfAuthenticated = (authResult, cb = () => {}, elseCb = () => {}) => {
  if (authResult && authResult.accessToken && authResult.idToken) {
    cb();
  } else {
    elseCb();
  }
};

// changes callback in closure
// setSessionStateCb(cb: Function) -> void
export const setSessionStateCb = cb => (sessionStateCb = cb);

// instantiating Auth0 module
const authInstance = isBrowser ? new WebAuth(AUTH0_CONFIG) : {};

const setSession = (cb = () => {}) => (err, authResult) => {
  if (err) {
    switch (err.error) {
      case 'login_required':
        return login();
      default:
        // eslint-disable-next-line
        console.log('set session error', JSON.stringify(err));
        navigate('/');
        cb();
        return;
    }
  }

  doIfAuthenticated(authResult, () => {
    tokens.idToken = authResult.idToken;
    tokens.accessToken = authResult.accessToken;
    user = authResult.idTokenPayload;
    window.localStorage.setItem('isLoggedIn', true);
    cb();
    sessionStateCb({
      isLoggedIn: isAuthenticated(),
      userProfile: getUserProfile(),
      accessToken: getAccessToken(),
    });
  });
};

const localLogout = () => {
  if (!isBrowser) return;
  console.log('logging out locally');
  // Remove tokens and user profile
  tokens.accessToken = undefined;
  tokens.idToken = undefined;
  user = undefined;

  localStorage.removeItem('isLoggedIn');
  console.log('removed localstorage flag');
  sessionStateCb({
    isLoggedIn: isAuthenticated(),
    userProfile: getUserProfile(),
    accessToken: getAccessToken(),
  });
};

export const login = () => {
  if (!isBrowser) return;
  // Save postLoginUrl so we can redirect user back to where they left off after login screen
  localStorage.setItem('postLoginUrl', window.location.pathname);
  authInstance && authInstance.authorize();
};

export const getAccessToken = () => tokens.accessToken;

export const getUserProfile = () => user;

export const isAuthenticated = () => {
  if (!isBrowser) return false;
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const handleAuthentication = () =>
  new Promise((resolve, reject) => {
    authInstance &&
      authInstance.parseHash((err, authResult) => {
        if (err) {
          return reject(err);
        }
        doIfAuthenticated(authResult, () => {
          setSession()(err, authResult);
          const postLoginUrl = localStorage.getItem('postLoginUrl');
          localStorage.removeItem('postLoginUrl');
          if (postLoginUrl) {
            navigate(postLoginUrl);
          }
          return resolve(authResult);
        });
        return resolve();
      });
  });

export const checkSession = (cb = () => {}) => {
  const isLoggedIn = window.localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'false' || isLoggedIn === null || !tokens.idToken) {
    cb();
  }
  return new Promise(resolve => {
    authInstance &&
      authInstance.checkSession({}, (err, authResult) => {
        if (err && err.error === 'login_required') {
          console.log('check session error', err);
          // User has been logged out from Auth0 server.
          // Remove local session.
          localLogout();
          return resolve();
        }
        doIfAuthenticated(authResult, () => {
          setSession()(err, authResult);
          return resolve(authResult);
        });
        return resolve();
      });
  });
};

export const logout = () => {
  if (!isBrowser) return;
  authInstance &&
    authInstance.logout({
      returnTo: window.location.origin,
    });
  localLogout();
};
