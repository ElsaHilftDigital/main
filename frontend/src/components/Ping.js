import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { pingActions, pingSelectors } from '../store/ping';

const Ping = (props) => {
    const dispatch = useDispatch();
    const pingResponse = useSelector(pingSelectors.pingResponse);
    const pingRequestOngoing = useSelector(pingSelectors.pingRequestOngoing);
    const pingServer = () => dispatch(pingActions.ping());

    return (
        <div className="container mt-5">
            <h1>Ping!</h1>
            <div className="d-flex flex-column justify-content-center">
                {pingRequestOngoing && (
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>  
                )}
                {!pingRequestOngoing && !pingResponse && (
                    <p>No response from the server yet. Try pinging it!</p>
                )}
                {!pingRequestOngoing && pingResponse && (
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