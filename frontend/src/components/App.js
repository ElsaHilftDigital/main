import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import About from './public/About';
import Home from './public/Home';
import Login from './public/Login';
import RegisterVolunteer from './public/registration/RegisterVolunteer';
import AdminLogin from './admin/home/AdminLogin';
import Customer from './admin/customer/Customer';
import Volunteer from './admin/volunteer/Volunteer';
import NewRequest from './admin/new-request/NewRequest';
import Purchase from './admin/purchase/Purchase';
import Header from './Header';
import PrivateRoute from './PrivateRoute';
import LoginRoute from './LoginRoute';


const App = (props) => {
    return (
        <Provider store={props.store}>
            <Router history={history}>
                <Route path="/" component={Header} />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/register" component={RegisterVolunteer} />
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute exact path="/admin/new-request" component={NewRequest} />
                    <PrivateRoute exact path="/admin/purchases" component={Purchase} />
                    <PrivateRoute exact path="/admin/customers" component={Customer} />
                    <PrivateRoute exact path="/admin/volunteers" component={Volunteer} />
                    <LoginRoute exact path="/admin" component={AdminLogin} />
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;