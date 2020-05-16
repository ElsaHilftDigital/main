import EventContext, { Listener } from "./EventContext";
import { useContext, useEffect } from "react";

export const useEvents = (topic: string, listener: Listener) => {
    const context = useContext(EventContext);
    useEffect(() => {
        context?.subscribe(topic, listener);
        return () => {
            context?.unsubscribe(topic, listener);
        }
    },[context, topic, listener]);
};