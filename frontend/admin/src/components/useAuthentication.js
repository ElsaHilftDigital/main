import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { authenticationActions, authenticationSelectors } from '../store/authentication';


export const useAuthentication = () => {
    const dispatch = useDispatch();

    const currentUser = useSelector(authenticationSelectors.currentUser);
    const currUsername = currentUser ? currentUser.username : null;
    useEffect(() => {
        dispatch(authenticationActions.getAuthInstance());
    }, [dispatch, currUsername])

    return useSelector(authenticationSelectors.currentUser);
};