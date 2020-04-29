import { combineReducers } from 'redux';

import { customerReducer } from './customer';
import { purchaseReducer } from './purchase';
import { volunteerReducer } from './volunteer';

const rootReducer = combineReducers({
    customer: customerReducer,
    purchase: purchaseReducer,
    volunteer: volunteerReducer,
});

export default rootReducer;
