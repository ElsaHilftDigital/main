import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useCookies } from "react-cookie";

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
    const [cookies] = useCookies(['token']);
    const isAuthenticated = !!cookies.token;
    if (isAuthenticated) {
        return <Route {...rest}>{children}</Route>;
    } else {
        return <Redirect to="/login"/>
    }
};

export default PrivateRoute;