import { all } from 'redux-saga/effects';

import * as authenticationApi from '../apis/authentication';
import * as volunteerApi from '../apis/volunteer';
import { authenticationSaga } from './authentication';
import { volunteerSaga } from './volunteer';

export default function* rootSaga() {
    yield all([
        authenticationSaga(authenticationApi),
        volunteerSaga(volunteerApi),
    ]);
}