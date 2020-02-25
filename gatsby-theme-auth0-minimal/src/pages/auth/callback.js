import React, { useEffect } from 'react';
import { handleAuthentication } from '../../utils/auth';
import Callback from '../../components/callback';

const CallbackPage = props => {
  const { location } = props;

  useEffect(() => {
    if (/access_token|id_token|error/.test(location.hash)) {
      handleAuthentication();
    }
  }, []);

  return <Callback />;
};

export default CallbackPage;
