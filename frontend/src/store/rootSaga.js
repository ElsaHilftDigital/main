import { all } from 'redux-saga/effects';

import * as authenticationApi from '../apis/authentication';
import * as pingApi from '../apis/ping';
import * as volunteerApi from '../apis/volunteer';
import { authenticationSaga } from './authentication';
import { pingSaga } from './ping';
import { volunteerSaga } from './volunteer';

export default function* rootSaga() {
    yield all([
        authenticationSaga(authenticationApi),
        pingSaga(pingApi),
        volunteerSaga(volunteerApi),
    ]);
}