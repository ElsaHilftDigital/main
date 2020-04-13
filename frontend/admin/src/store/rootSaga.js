import { all } from 'redux-saga/effects';

import * as authenticationApi from '../apis/authentication';
import * as customerApi from '../apis/customer';
import * as purchaseApi from '../apis/purchase';
import * as volunteerApi from '../apis/volunteer';
import * as moderatorApi from '../apis/moderator';
import { authenticationSaga } from './authentication';
import { customerSaga } from './customer';
import { purchaseSaga } from './purchase';
import { volunteerSaga } from './volunteer';
import { moderatorSaga } from './moderator';

export default function* rootSaga() {
    yield all([
        authenticationSaga(authenticationApi),
        customerSaga(customerApi),
        purchaseSaga(purchaseApi),
        volunteerSaga(volunteerApi),
        moderatorSaga(moderatorApi),
    ]);
}
