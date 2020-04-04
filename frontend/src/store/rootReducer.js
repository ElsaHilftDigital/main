import { combineReducers } from 'redux';

import { authenticationReducer } from './authentication';
import { pingReducer } from './ping';
import { volunteerReducer } from './volunteer';

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    ping: pingReducer,
    volunteer: volunteerReducer,
});

export default rootReducer;