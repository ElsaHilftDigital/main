import { combineReducers } from 'redux';

import { pingReducer } from './ping';
import { volunteerReducer } from './volunteer';

const rootReducer = combineReducers({
    ping: pingReducer,
    volunteer: volunteerReducer,
});

export default rootReducer;