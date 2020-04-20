import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute: React.FC = ({ children, ...rest }) => {
    const isAuthenticated = document.cookie.indexOf('token') !== -1;
    return isAuthenticated
        ? <Route {...rest}>{children}</Route>
        : <Redirect to="/login"/>;
};

export default PrivateRoute;