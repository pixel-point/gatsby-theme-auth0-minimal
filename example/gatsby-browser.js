import React from 'react';
import { useAuth } from 'gatsby-theme-auth0-minimal';
// import Spinner from "./src/components/spinner"

// const protectedRoutes = [`/account`, `/auth/callback`]

const CheckLoading = ({ children }) => {
  const [isLoading] = useAuth();

  return isLoading ? <p>Loading...</p> : <>{children}</>;
};

export const wrapRootElement = ({ element }) => (
  <CheckLoading>{element}</CheckLoading>
);
