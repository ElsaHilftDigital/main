import React from 'react';

import { useAuthentication } from '../../useAuthentication';
import Dashboard from './Dashboard';
import AdminLogin from './AdminLogin';

const AdminHome = () => {
    const isLoggedIn = !!useAuthentication();

    return (
        <>
            {isLoggedIn && (
                <Dashboard />
            )}
            {!isLoggedIn && (
                <AdminLogin />
            )}
        </>
    );
};

export default AdminHome;