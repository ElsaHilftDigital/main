import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute: React.FC = ({ children, ...rest }) => {
    const isAuthenticated = document.cookie.indexOf('token') !== -1;
    return <Route {...rest}
                  render={({ location }) => isAuthenticated
                      ? children
                      : <Redirect to={{ pathname: "/login", state: { from: location } }}/>}
    />;
};

export default PrivateRoute;