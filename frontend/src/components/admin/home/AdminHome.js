import React from 'react';

import { useAuthentication } from '../../useAuthentication';
import Dashboard from './Dashboard';
import AdminLogin from './AdminLogin';
import history from '../../../history';

const AdminHome = () => {
    const isLoggedIn = !!useAuthentication();

    return (
        <>
            {isLoggedIn && (
                history.push("/admin/purchases")
            )}
            {!isLoggedIn && (
                <AdminLogin />
            )}
        </>
    );
};

export default AdminHome;