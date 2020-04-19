import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { moderatorActions, moderatorSelectors } from '../store/moderator';

export const useModerators = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(moderatorActions.getModerators());
    }, [dispatch])

    return {
        moderators: useSelector(moderatorSelectors.selectModerators),
        requestOngoing: useSelector(moderatorSelectors.selectGetModeratorsRequestOngoing),
        error: useSelector(moderatorSelectors.selectGetModeratorsError),
    }
};
