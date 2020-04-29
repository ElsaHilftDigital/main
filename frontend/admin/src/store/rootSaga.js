import { all } from 'redux-saga/effects';

import * as purchaseApi from '../apis/purchase';
import * as volunteerApi from '../apis/volunteer';
import { purchaseSaga } from './purchase';
import { volunteerSaga } from './volunteer';

export default function* rootSaga() {
    yield all([
        purchaseSaga(purchaseApi),
        volunteerSaga(volunteerApi),
    ]);
}
