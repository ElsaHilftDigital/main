import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuthentication } from './useAuthentication';

const LoginRoute = ({ children, ...rest }) => {
    const isLoggedIn = !!useAuthentication();

    const renderRedirect = (location) => {
        return <Redirect to={{ pathname: '/admin/purchases', state: { from: location }}} />;
    };
    return (
        <>
        {isLoggedIn && (
            renderRedirect('/admin')
        )}
        {!isLoggedIn && (
            <Route {...rest} render={() => children} />
        )}
        </>
    );
};

export default LoginRoute;