import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
        dispatch(authenticationActions.login({ username: 'user', password: 'password'}));
    };

    const signOut = () => {
        dispatch(authenticationActions.logout());
    };

    return (
        <>
            {isSignedIn && (
                <button onClick={signOut} className="btn btn-secondary">
                    Ausloggen
                </button>
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