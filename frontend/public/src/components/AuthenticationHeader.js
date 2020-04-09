import React from 'react';
import { useDispatch } from 'react-redux';

import history from '../history';
import { authenticationActions } from '../store/authentication';
import { useAuthentication } from './useAuthentication';

const AuthenticationHeader = () => {
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
                    <button onClick={signOut} disabled className="btn" style={{backgroundColor:"rgb(230, 230, 255)"}}>
                        Ausloggen
                    </button>
                </>
            )}
            {!currentUser && (
                <button onClick={signIn} className="btn" style={{backgroundColor:"rgb(230, 230, 255)"}}>
                    Einloggen
                </button>
            )}
        </>
    );
};

export default AuthenticationHeader;