/*

=========================================================
* Now UI Kit React - v1.4.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-kit-react
* Copyright 2020 Creative Tim (http://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-kit-react/blob/master/LICENSE.md)

* Designed by www.invisionapp.com Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// styles for this kit
import "assets/css/bootstrap.min.css";
import "assets/css/now-ui-kit.css";
import "assets/demo/demo.css";
import "assets/css/demo.css";
// pages for dashboard
import AdminLayout from "layouts/Admin.js";
// pages for this kit
import Index from "views/Index.js";
import NucleoIcons from "views/NucleoIcons.js";
//import LoginPage from "views/examples/LoginPage.js";
import LandingPage from "views/examples/LandingPage.js";
import ProfilePage from "views/examples/ProfilePage.js";
import RegistrationPage from "views/RegistrationPage.js";
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history.js';
import ProtectedRoute from './auth/protected-route.js'; 
import Callback from './components/Callback/Callback.js';


const AppWithRouterAccess = () => {
    return (
        <BrowserRouter>
            <Auth0ProviderWithHistory>
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => {
                            return (
                                <Redirect to="/landing-page" />
                            )
                        }}
                    />
                    <Route
                        path = "/callback"
                        render={(props) => <Callback auth={props.auth}/>}
                    />
                    <Route
                        path="/index"
                        render={(props) => <Index {...props} />}
                    />
                    <Route
                        path="/nucleo-icons"
                        render={(props) => <NucleoIcons {...props} />}
                    />
                    <Route
                        path="/landing-page"
                        render={(props) => <LandingPage {...props} />}
                    />
                    <Route
                        path="/profile-page"
                        render={(props) => <ProfilePage {...props} />}
                    />
                    <Route
                        path="/registration"
                        render={(props) => <RegistrationPage {...props} />}
                    />
                    <ProtectedRoute 
                        path="/admin"
                        component = {AdminLayout}
                        render={(props) => <AdminLayout {...props} />}
                    />
                    <ProtectedRoute 
                        path="/admin/dashboard"
                        component = {AdminLayout}
                        render={(props) => <AdminLayout {...props} />}
                    />
                </Switch>
            </Auth0ProviderWithHistory>
        </BrowserRouter>
    )
};

export default AppWithRouterAccess;