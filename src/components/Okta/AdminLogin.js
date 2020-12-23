import React from 'react';
import { Redirect } from 'react-router-dom';
import AdminLayout from "layouts/Admin.js";
import { useOktaAuth } from '@okta/okta-react';

const AdmingLogin = (props) => {
    const { authState } = useOktaAuth();

    if(authState.isPending) {
        return <div>Loading...</div>;
    }

    return authState.isAuthenticated ? 
        <Redirect to={{ pathname: '/signin'}}/> :
        <AdminLayout {...props}/>;
}

export default AdmingLogin;