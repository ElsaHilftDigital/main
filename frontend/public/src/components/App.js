import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import About from './public/About';
import Home from './public/Home';
import RegisterVolunteer from './public/registration/RegisterVolunteer';
import Header from './Header';


const App = (props) => {
    return (
        <Provider store={props.store}>
            <Router history={history}>
                <Route path="/" component={Header} />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/register" component={RegisterVolunteer} />
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;