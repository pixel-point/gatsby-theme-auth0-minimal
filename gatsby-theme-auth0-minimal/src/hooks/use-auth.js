// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import {
  setSessionStateCb,
  isAuthenticated,
  getUserProfile,
  checkSession,
} from '../utils/auth';

const useAuth = (stateCallback = () => {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [profile, setProfile] = useState(getUserProfile());

  useEffect(() => {
    // Override `stateCallback` in auth service
    setSessionStateCb(state => {
      stateCallback(state);
      setIsLoggedIn(state.isLoggedIn);
    });
    (async () => {
      await checkSession();
      try {
        const user = getUserProfile();
        setProfile(user);
      } catch (error) {
        // eslint-disable-next-line
        console.error(`Error: ${error}`);
      }
      setIsLoading(false);
    })();

    return () => {
      // Clean up sessionStateCallback
      setSessionStateCb(() => {});
    };
  }, []);

  return { isLoading, isLoggedIn, profile };
};

export default useAuth;
