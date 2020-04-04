import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';

import history from '../history';
import About from './About';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Ping from './Ping';
import RegisterVolunteer from './RegisterVolunteer';


const App = (props) => {
    return (
        <Provider store={props.store}>
            <Router history={history}>
                <Route path="/" component={Header} />
                <Route exact path="/" component={Home} />
                <Route exact path="/ping" component={Ping} />
                <Route exact path="/about" component={About} />
                <Route exact path="/register" component={RegisterVolunteer} />
                <Route exact path="/login" component={Login} />
            </Router>
        </Provider>
    );
};

export default App;