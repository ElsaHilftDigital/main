import { combineReducers } from 'redux';

import { authenticationReducer } from './authentication';
import { customerReducer } from './customer';
import { volunteerReducer } from './volunteer';

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    customerReducer: customerReducer,
    volunteer: volunteerReducer,
});

export default rootReducer;