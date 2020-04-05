import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { volunteerActions, volunteerSelectors } from '../../store/volunteer';


export const useVolunteers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(volunteerActions.getAllVolunteers());
    }, [dispatch])

    return useSelector(volunteerSelectors.getAllVolunteers);
};