import React from 'react';
import { Redirect } from 'react-router-dom';
import LoginPage from '../../views/examples/LoginPage';
import { useOktaAuth } from '@okta/okta-react';

const SignIn = ({ issuer, scope }) => {
  const { authState } = useOktaAuth();

  if (authState.isPending) {
    return <div>Loading...</div>;
  }
  return authState.isAuthenticated ?
    <Redirect to={{ pathname: '/admin' }}/> :
    <LoginPage issuer={issuer} scope={scope} />;
};

export default SignIn;