import React from 'react';
import { Provider } from 'react-redux';

import Ping from './Ping';

const App = (props) => {
    return (
        <Provider store={props.store}>
            <Ping />
        </Provider>
    );
};

export default App;