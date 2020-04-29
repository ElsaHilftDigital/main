import { all } from 'redux-saga/effects';

import * as customerApi from '../apis/customer';
import * as purchaseApi from '../apis/purchase';
import * as volunteerApi from '../apis/volunteer';
import * as moderatorApi from '../apis/moderator';
import { customerSaga } from './customer';
import { purchaseSaga } from './purchase';
import { volunteerSaga } from './volunteer';

export default function* rootSaga() {
    yield all([
        customerSaga(customerApi),
        purchaseSaga(purchaseApi),
        volunteerSaga(volunteerApi),
    ]);
}
