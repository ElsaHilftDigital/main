import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import AdminLogin from './admin/home/AdminLogin';
import CustomerList from './admin/customer/CustomerList';
import CustomerDetail from './admin/customer/CustomerDetail';
import VolunteerList from './admin/volunteer/VolunteerList';
import VolunteerDetail from './admin/volunteer/VolunteerDetail';
import NewRequest from './admin/new-request/NewRequest';
import PurchaseList from './admin/purchase/PurchaseList';
import PurchaseDetail from './admin/purchase/PurchaseDetail';
import Header from './Header';


const App = (props) => {
    return (
        <Provider store={props.store}>
            <Router history={history}>
                <Route path="/" component={Header}/>
                <Switch>
                    <Route exact path="/login"><AdminLogin/></Route>
                    <Route exact path="/new-request"><NewRequest/></Route>
                    <Route exact path="/purchases"><PurchaseList/></Route>
                    <Route exact path="/purchase/:purchaseId"><PurchaseDetail/></Route>
                    <Route exact path="/customers"><CustomerList/></Route>
                    <Route exact path="/customer/:customerId"><CustomerDetail/></Route>
                    <Route exact path="/volunteers"><VolunteerList/></Route>
                    <Route exact path="/volunteer/:volunteerId"><VolunteerDetail/></Route>
                    <Redirect to="/purchases"/>
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;