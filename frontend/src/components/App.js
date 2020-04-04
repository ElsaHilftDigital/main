import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import About from './public/About';
import Header from './Header';
import Home from './public/Home';
import Login from './public/Login';
import RegisterVolunteer from './public/RegisterVolunteer';
import AdminHome from './admin/home/AdminHome';
import Customer from './admin/customer/Customer';
import Volunteer from './admin/volunteer/Volunteer';
import NewRequest from './admin/new-request/NewRequest';


const App = (props) => {
    return (
        <Provider store={props.store}>
            <Router history={history}>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/register" component={RegisterVolunteer} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/admin/new-request" component={NewRequest} />
                    <Route exact path="/admin/customers" component={Customer} />
                    <Route exact path="/admin/volunteers" component={Volunteer} />
                    <Route exact path="/admin" component={AdminHome} />
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;