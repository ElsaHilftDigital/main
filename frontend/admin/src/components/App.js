import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import AdminLogin from './admin/home/AdminLogin';
import Customer from './admin/customer/Customer';
import Volunteer from './admin/volunteer/Volunteer';
import NewRequest from './admin/new-request/NewRequest';
import PurchaseList from './admin/purchase/PurchaseList';
import PurchaseDetail from './admin/purchase/PurchaseDetail';
import Header from './Header';
import PrivateRoute from './PrivateRoute';


const App = (props) => {
    return (
        <Provider store={props.store}>
            <Router history={history}>
                <Route path="/" component={Header} />
                <Redirect exact from="/" to="/new-request"/>
                <Switch>
                    <Route exact path="/login" component={AdminLogin} />
                    <PrivateRoute exact path="/new-request" component={NewRequest} />
                    <PrivateRoute exact path="/purchases" component={PurchaseList}/>
                    <PrivateRoute exact path="/purchase/:purchaseId" component={PurchaseDetail}/>
                    <PrivateRoute exact path="/customers" component={Customer} />
                    <PrivateRoute exact path="/volunteers" component={Volunteer} />
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;