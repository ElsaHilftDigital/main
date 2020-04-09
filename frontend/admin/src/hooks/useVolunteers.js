import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { volunteerActions, volunteerSelectors } from '../store/volunteer';


export const useVolunteers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(volunteerActions.getVolunteers());
    }, [dispatch])

    return {
        volunteers: useSelector(volunteerSelectors.selectVolunteers),
        requestOngoing: useSelector(volunteerSelectors.selectGetVolunteersRequestOngoing),
        error: useSelector(volunteerSelectors.selectGetVolunteersError),
    };
};