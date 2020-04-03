import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { pingActions, pingSelectors } from '../store/ping';

const Ping = () => {
    const dispatch = useDispatch();

    const pingResponse = useSelector(pingSelectors.pingResponse);
    const pingRequestOngoing = useSelector(pingSelectors.pingRequestOngoing);
    const pingSuccess = useSelector(pingSelectors.pingSuccess);
    const pingError = useSelector(pingSelectors.pingError);

    const pingServer = () => {
        setNumberOfPings(numberOfPings + 1);
        dispatch(pingActions.ping())
    };

    const [numberOfPings, setNumberOfPings] = useState(0);

    return (
        <div className="container mt-3">
            <h1>Ping!</h1>
            <div className="d-flex flex-column justify-content-center">
                {(numberOfPings === 0) && (
                    <p>No response from the server yet. Try pinging it!</p>
                )}
                {(numberOfPings > 0) && (
                    <p>Pinged the server {numberOfPings} times!</p>
                )}
                <button 
                    onClick={pingServer} 
                    disabled={pingRequestOngoing}
                    type="button"
                    className="btn btn-primary mb-3"
                >
                    Hello Server!
                </button>
                {pingRequestOngoing && (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>  
                    </div>
                )}
                {!pingRequestOngoing && pingSuccess && pingResponse && (
                    <div className="alert alert-success" role="alert">
                        <h4>Success!</h4>
                        <p>The server responded with: {pingResponse}</p>
                    </div>
                )}
                {!pingRequestOngoing && pingError && (
                    <div className="alert alert-danger" role="alert">
                        <h4>Error!</h4>
                        <p>{pingError.message}</p>
                    </div>   
                )}
            </div>
        </div>
    );
};

export default Ping;