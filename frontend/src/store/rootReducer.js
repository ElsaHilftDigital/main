import { combineReducers } from 'redux';

import { authenticationReducer } from './authentication';
import { volunteerReducer } from './volunteer';

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    volunteer: volunteerReducer,
});

export default rootReducer;