import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
//import { Loading } from "../components/index";

const ProtectedRoute = ({ component, ...args }) => (
  <Route
    component={withAuthenticationRequired(component, {
        returnTo: '/admin',
    })}
    {...args}
  />
);

export default ProtectedRoute;