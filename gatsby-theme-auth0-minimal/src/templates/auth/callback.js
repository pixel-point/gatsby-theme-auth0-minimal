import React, { useEffect } from 'react';
import Callback from '../../components/common/callback';
import useAuth from '../../hooks/use-auth';

const CallbackPage = ({ location }) => {
  const { handleAuthentication } = useAuth();
  useEffect(() => {
    if (/access_token|id_token|error/.test(location.hash)) {
      handleAuthentication();
    }
  }, []);

  return <Callback />;
};

export default CallbackPage;
