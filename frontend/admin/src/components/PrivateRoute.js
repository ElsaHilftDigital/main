import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuthentication } from './useAuthentication';

const PrivateRoute = props => {
    const isLoggedIn = !!useAuthentication();

    const renderRedirect = (location) => {
        return <Redirect to={{ pathname: '/login', state: { from: location }}} />;
    };
    return (
        <>
        {!isLoggedIn && (
            renderRedirect('/login')
        )}
        {isLoggedIn && (
            <Route {...props} />
        )}
        </>
    );
};

export default PrivateRoute;