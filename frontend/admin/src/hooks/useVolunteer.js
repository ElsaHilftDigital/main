import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { volunteerActions, volunteerSelectors } from '../store/volunteer';


export const useVolunteer = uuid => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(volunteerActions.getVolunteer(uuid));
    }, [dispatch, uuid])

    return {
        volunteer: useSelector(volunteerSelectors.selectCurrentVolunteer),
        requestOngoing: useSelector(volunteerSelectors.selectGetVolunteerRequestOngoing),
        error: useSelector(volunteerSelectors.selectGetVolunteerError),
    };
};