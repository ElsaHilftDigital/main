import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import history from '../history';
import { authenticationActions, authenticationSelectors } from '../store/authentication';

const useAuthentication = () => {
    const dispatch = useDispatch();

    const currUsername = useSelector(authenticationSelectors.crrentUserUsername);
    useEffect(() => {
        dispatch(authenticationActions.getAuthInstance());
    }, [dispatch, currUsername])

    return useSelector(authenticationSelectors.currentUser);
};

const Authentication = () => {
    const dispatch = useDispatch();

    const currentUser = useAuthentication();
    const isSignedIn = !!currentUser && !currentUser.anonymous;

    const signIn = () => {
        history.push('/login');
    };

    return (
        <>
            {isSignedIn && (
                <span className="text-light font-weight-bold">{`Hallo, ${currentUser.username}!`}</span>
            )}
            {!isSignedIn && (
                <button onClick={signIn} className="btn btn-secondary">
                    Einloggen
                </button>
            )}
        </>
    );
};

export default Authentication;