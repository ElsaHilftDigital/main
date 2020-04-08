import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { purchaseActions, purchaseSelectors } from "../../../store/purchase"

export const usePurchase = uuid => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(purchaseActions.getPurchase());
    }, [dispatch, uuid]);

    return {
        purchase: useSelector(purchaseSelectors.selectCurrentPurchase),
        requestOngoing: useSelector(purchaseSelectors.selectGetPurchaseRequestOngoing),
        error: useSelector(purchaseSelectors.selectGetPurchaseError),
    };
}