import { all } from 'redux-saga/effects';

import * as authenticationApi from '../apis/authentication';
import * as customerApi from '../apis/customer';
import * as volunteerApi from '../apis/volunteer';
import { authenticationSaga } from './authentication';
import { customerSaga } from './customer';
import { volunteerSaga } from './volunteer';

export default function* rootSaga() {
    yield all([
        authenticationSaga(authenticationApi),
        customerSaga(customerApi),
        volunteerSaga(volunteerApi),
    ]);
}