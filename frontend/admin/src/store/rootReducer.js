import { combineReducers } from 'redux';

import { purchaseReducer } from './purchase';
import { volunteerReducer } from './volunteer';

const rootReducer = combineReducers({
    purchase: purchaseReducer,
    volunteer: volunteerReducer,
});

export default rootReducer;
