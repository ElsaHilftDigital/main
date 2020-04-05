import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { purchaseActions, purchaseSelectors } from "../../store/purchase"

export const usePurchases = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(purchaseActions.getAllPurchases());
    }, [dispatch]);

    return useSelector(purchaseSelectors.getPurchases);
}