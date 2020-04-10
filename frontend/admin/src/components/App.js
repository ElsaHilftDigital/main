import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import AdminLogin from './admin/home/AdminLogin';
import Customer from './admin/customer/Customer';
import Volunteer from './admin/volunteer/Volunteer';
import NewRequest from './admin/new-request/NewRequest';
import PurchaseList from './admin/purchase/PurchaseList';
import PurchaseDetail from './admin/purchase/PurchaseDetail';
import Header from './Header';


const App = (props) => {
    return (
        <Provider store={props.store}>
            <Router history={history}>
                <Route path="/" component={Header} />
                <Switch>
                    <Route exact path="/admin" component={AdminLogin} />
                    <Route exact path="/admin/new-request" component={NewRequest} />
                    <Route exact path="/admin/purchases" component={PurchaseList}/>
                    <Route exact path="/admin/purchase/:purchaseId" component={PurchaseDetail}/>
                    <Route exact path="/admin/customers" component={Customer} />
                    <Route exact path="/admin/volunteers" component={Volunteer} />
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;