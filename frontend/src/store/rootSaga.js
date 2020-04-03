import { all } from 'redux-saga/effects';

import * as pingApi from '../apis/ping';
import { pingSaga } from './ping';

export default function* rootSaga() {
    yield all([
        pingSaga(pingApi),
    ]);
}