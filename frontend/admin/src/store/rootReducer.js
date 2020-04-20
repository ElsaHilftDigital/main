import { combineReducers } from 'redux';

import { customerReducer } from './customer';
import { purchaseReducer } from './purchase';
import { volunteerReducer } from './volunteer';
import { moderatorReducer } from './moderator';

const rootReducer = combineReducers({
    customer: customerReducer,
    purchase: purchaseReducer,
    volunteer: volunteerReducer,
    moderator: moderatorReducer,
});

export default rootReducer;
