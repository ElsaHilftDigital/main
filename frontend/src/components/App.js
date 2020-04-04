import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import About from './public/About';
import Header from './Header';
import Home from './public/Home';
import Login from './public/Login';
import Ping from './public/Ping';
import RegisterVolunteer from './public/RegisterVolunteer';


const App = (props) => {
    return (
        <Provider store={props.store}>
            <Router history={history}>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/ping" component={Ping} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/register" component={RegisterVolunteer} />
                    <Route exact path="/login" component={Login} />
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;