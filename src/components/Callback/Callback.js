import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { useAuth0 } from "@auth0/auth0-react";
import { Redirect } from "react-router-dom";

function Callback(props) {
  const [claims, setClaims] = useState(null);

  const Authenticated = useAuth0().isAuthenticated;
  const Loading = useAuth0().isLoading;
  useAuth0().getIdTokenClaims()
    .then(response => {
      setClaims(response);
    })
    .catch(error => {
      console.log("Error trying to get claims: " + error);
    });
  

  const RedirectTo = () => {
    const userRole = process.env.REACT_APP_AUTH0_USER_ROLE_ATTRIBUTE;
    if (Authenticated && !Loading && claims !== undefined && claims !== null) {
      const adminRoles = ['Admin', 'Customer', 'Employee'];
      const travellerRoles = ['SelfEmployedTraveller', 'Traveller'];
      const role = claims[userRole][0];

      if(adminRoles.includes(role)) {
        return(
          <Redirect to="/admin" />
        );
      } else if(travellerRoles.includes(role)) {
        return(
          <Redirect to="/traveller-admin" />
        );
      } else {
        return(
          <Redirect to="/landing-page" />
        );
      }
    }
    return(
      <div>
        Loading user profile.
      </div>
    );
  }
  
  return (
    <RedirectTo />
  );
}

export default withRouter(Callback);