import React from 'react';
import { useSelector } from 'react-redux';

import { authenticationSelectors } from '../../../store/authentication';
import Dashboard from './Dashboard';
import AdminLogin from './AdminLogin';

const AdminHome = () => {
    const isLoggedIn = !!useSelector(authenticationSelectors.currentUser);

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