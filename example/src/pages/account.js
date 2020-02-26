import React from 'react';
import { Router } from '@reach/router';
import { AuthService, useAuth } from 'gatsby-theme-auth0-minimal';
import { Link } from 'gatsby';

const Home = () => <p>Home</p>;
const MyAccount = () => <p>My Account</p>;
const Settings = () => <p>Settings</p>;
const Billing = () => <p>Billing</p>;

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const { isLoading, isLoggedIn } = useAuth();
  const content = isLoggedIn ? (
    <Component {...rest} />
  ) : (
    <div>
      <p>You have to login to view this page</p>
      <button
        type="button"
        onClick={e => {
          AuthService.login();
        }}
      >
        Login
      </button>
    </div>
  );
  return isLoading ? <p>Loading private route page...</p> : content;
};

const Account = () => {
  const { isLoading, isLoggedIn, profile } = useAuth();
  return isLoading ? (
    <p>Loading account data...</p>
  ) : (
    <>
      <nav>
        <Link to="/">Home</Link> <Link to="/account/">My Account</Link>{' '}
        <Link to="/account/settings/">Settings</Link>{' '}
        <Link to="/account/billing/">Billing</Link>{' '}
        {isLoggedIn ? (
          <a
            href="#logout"
            onClick={e => {
              e.preventDefault();
              AuthService.logout();
            }}
          >
            Log Out
          </a>
        ) : (
          <a
            href="#login"
            onClick={e => {
              e.preventDefault();
              AuthService.login();
            }}
          >
            Log In
          </a>
        )}
      </nav>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
      <Router>
        <Home path="/" />
        <MyAccount path="/account/" />
        <PrivateRoute path="/account/settings" component={Settings} />
        <PrivateRoute path="/account/billing" component={Billing} />
      </Router>
    </>
  );
};

export default Account;
