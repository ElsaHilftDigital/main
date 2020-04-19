import { all } from 'redux-saga/effects';

import * as volunteerApi from '../apis/volunteer';
import { volunteerSaga } from './volunteer';

export default function* rootSaga() {
    yield all([
        volunteerSaga(volunteerApi),
    ]);
}