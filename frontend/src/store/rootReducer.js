import { combineReducers } from 'redux';

import { pingReducer } from './ping';

const rootReducer = combineReducers({
    ping: pingReducer,
});

export default rootReducer;