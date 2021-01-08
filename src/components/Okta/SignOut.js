import React from 'react';
import { useOktaAuth } from '@okta/okta-react';

const issuer = 'https://dev-682545.okta.com/oauth2/default';
const redirectUri = `${window.location.origin}/`;


// Basic component with logout button
const Logout = () => { 
  const { authState, authService } = useOktaAuth();

  const logout = async () => {
    const idToken = authState.idToken;
    console.log(idToken);
    await authService.logout('/');

    // Clear remote session
    window.location.href = `${issuer}/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}`;
  };

  return (
    <a onClick={logout}>Logout</a>
  );
};

export default Logout;
