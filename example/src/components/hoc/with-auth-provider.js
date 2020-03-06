/* eslint-disable */
import React from 'react';
import { AuthProvider } from 'gatsby-theme-auth0-minimal';

export default ({ element }) => {
  return <AuthProvider>{element}</AuthProvider>;
};
