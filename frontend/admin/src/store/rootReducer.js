import { combineReducers } from 'redux';

import { volunteerReducer } from './volunteer';

const rootReducer = combineReducers({
    volunteer: volunteerReducer,
});

export default rootReducer;
