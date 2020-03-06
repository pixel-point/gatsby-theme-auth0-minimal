import React, { createContext, useState, useContext } from 'react';
import { WebAuth } from 'auth0-js';

const AUTH0_CONFIG = {
  // required
  domain: process.env.GATSBY_AUTH0_DOMAIN,
  clientID: process.env.GATSBY_AUTH0_CLIENTID,
  redirectUri: process.env.GATSBY_AUTH0_CALLBACK,
  // optional
  responseType: 'token id_token', // this value is not tweakable, @TODO: put link to doc with explanation
  scope: process.env.GATSBY_AUTH0_SCOPE || 'openid profile email',
  audience: process.env.GATSBY_AUTH0_AUDIENCE || false,
};

const generateAuth = () => new WebAuth(AUTH0_CONFIG);

// auth store
const AuthContext = createContext();

// an object in which we are going to store auth0 response tokens
// could be stored in localStorage but this way (i.e in memory) is more
// safe according to Auth0 itself
const useAuthState = () => {
  const [authState, updateAuthState] = useState({
    accessToken: null,
    idToken: null,
    userProfile: null,
    expiresAt: 0,
    // this is where we will store
    // reference to clearTimeout function
    // of scheduled token renewal functionality
    unschedule: null,
  });
  return {
    auth0: generateAuth(),
    authState,
    updateAuthState,
  };
};

export const AuthProvider = ({ children }) => {
  const value = useAuthState();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
