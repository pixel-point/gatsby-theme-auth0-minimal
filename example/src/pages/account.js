import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { useAuth } from 'gatsby-theme-auth0-minimal';
import { Link } from 'gatsby';

const Home = () => <p>Home</p>;
const MyAccount = () => <p>My Very Private Info</p>;
const Settings = () => <p>My personal Settings</p>;
const Billing = () => <p> My Billing info</p>;

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { login, isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <div>
      <p>You have to login to view this page</p>
      <button
        type="button"
        onClick={e => {
          login();
        }}
      >
        Login
      </button>
    </div>
  );
};

const Account = () => {
  const {
    checkSession,
    login,
    logout,
    isAuthenticated,
    authState: { user },
  } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      checkSession();
    }
  }, [checkSession]);

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/account/">My Account</Link>{' '}
        <Link to="/account/settings/">Settings</Link>{' '}
        <Link to="/account/billing/">Billing</Link>{' '}
        {isAuthenticated ? (
          <a
            href="#logout"
            onClick={e => {
              e.preventDefault();
              logout();
            }}
          >
            Log Out
          </a>
        ) : (
          <a
            href="#login"
            onClick={e => {
              e.preventDefault();
              login();
            }}
          >
            Log In
          </a>
        )}
      </nav>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Router>
        <Home path="/" />
        <PrivateRoute path="/account/" component={MyAccount} />
        <PrivateRoute path="/account/settings" component={Settings} />
        <PrivateRoute path="/account/billing" component={Billing} />
      </Router>
    </>
  );
};

export default Account;
