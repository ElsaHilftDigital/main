import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import history from '../history';
import { authenticationActions, authenticationSelectors } from '../store/authentication';

const useAuthentication = () => {
    const dispatch = useDispatch();

    const currentUser = useSelector(authenticationSelectors.currentUser);
    const currUsername = currentUser ? currentUser.username : null;
    useEffect(() => {
        dispatch(authenticationActions.getAuthInstance());
    }, [dispatch, currUsername])

    return useSelector(authenticationSelectors.currentUser);
};

const Authentication = () => {
    const dispatch = useDispatch();

    const currentUser = useAuthentication();

    const signIn = () => {
        history.push('/login');
    };

    const signOut = () => {
        dispatch(authenticationActions.logout());
    };

    return (
        <>
            {currentUser && (
                <>
                    <span className="text-light font-weight-bold mr-3">{`Hallo, ${currentUser.username}!`}</span>
                    <button onClick={signOut} className="btn btn-secondary">
                        Ausloggen
                    </button>
                </>
            )}
            {!currentUser && (
                <button onClick={signIn} className="btn btn-secondary">
                    Einloggen
                </button>
            )}
        </>
    );
};

export default Authentication;