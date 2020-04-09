import { combineReducers } from 'redux';

import { authenticationReducer } from './authentication';
import { customerReducer } from './customer';
import { purchaseReducer } from './purchase';
import { volunteerReducer } from './volunteer';

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    customer: customerReducer,
    purchase: purchaseReducer,
    volunteer: volunteerReducer,
});

export default rootReducer;