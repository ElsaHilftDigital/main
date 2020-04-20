import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import AdminLogin from './home/AdminLogin';
import CustomerList from './customer/CustomerList';
import CustomerDetail from './customer/CustomerDetail';
import VolunteerList from './volunteer/VolunteerList';
import VolunteerDetail from './volunteer/VolunteerDetail';
import NewRequest from './new-request/NewRequest';
import PurchaseList from './purchase/PurchaseList';
import PurchaseDetail from './purchase/PurchaseDetail';
import Header from '../components/Header';
import PrivateRoute from '../components/PrivateRoute';


const App = (props) => {
    return (
        <Provider store={props.store}>
            <Router history={history}>
                <Route path="/" component={Header}/>
                <Switch>
                    <Route exact path="/login"><AdminLogin/></Route>
                    <PrivateRoute exact path="/new-request"><NewRequest/></PrivateRoute>
                    <PrivateRoute exact path="/purchases"><PurchaseList/></PrivateRoute>
                    <PrivateRoute exact path="/purchase/:purchaseId"><PurchaseDetail/></PrivateRoute>
                    <PrivateRoute exact path="/customers"><CustomerList/></PrivateRoute>
                    <PrivateRoute exact path="/customer/:customerId"><CustomerDetail/></PrivateRoute>
                    <PrivateRoute exact path="/volunteers"><VolunteerList/></PrivateRoute>
                    <PrivateRoute exact path="/volunteer/:volunteerId"><VolunteerDetail/></PrivateRoute>
                    <Redirect to="/purchases"/>
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;