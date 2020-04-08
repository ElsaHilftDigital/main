import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { purchaseActions, purchaseSelectors } from "../../../store/purchase"

export const usePurchases = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(purchaseActions.getPurchases());
    }, [dispatch]);

    return {
        purchases: useSelector(purchaseSelectors.selectPurchases),
        requestOngoing: useSelector(purchaseSelectors.selectGetPurchasesRequestOngoing),
        error: useSelector(purchaseSelectors.selectGetPurchasesError),
    };
}