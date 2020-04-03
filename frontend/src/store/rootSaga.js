import { all } from 'redux-saga/effects';

import * as pingApi from '../apis/ping';
import * as volunteerApi from '../apis/volunteer';
import { pingSaga } from './ping';
import { volunteerSaga } from './volunteer';

export default function* rootSaga() {
    yield all([
        pingSaga(pingApi),
        volunteerSaga(volunteerApi),
    ]);
}