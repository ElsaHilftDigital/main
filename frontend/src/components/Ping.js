import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { pingActions, pingSelectors } from '../store/ping';

const Ping = (props) => {
    const dispatch = useDispatch();
    const pingResponse = useSelector(pingSelectors.pingResponse);
    const pingServer = () => dispatch(pingActions.ping());

    return (
        <div className="container mt-5">
            <h1>Ping!</h1>
            <div className="d-flex flex-column justify-content-center">
                {!pingResponse ? (
                    <p>No response from the server yet. Try pinging it!</p>
                ) : (
                <p>The server responded with: {pingResponse}</p>
                )}
                <button 
                    onClick={pingServer} 
                    type="button"
                    className="btn btn-primary"
                >
                    Hello Server!
                </button>
            </div>
        </div>
    );
};

export default Ping;