import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import configureStore from './store/store';
import './styles/index.scss';

const store = configureStore({});

ReactDOM.render(
    <App store={store} />,
    document.getElementById('root')
);