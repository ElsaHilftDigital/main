import React from 'react';
import EventContext, { EventManager, Listener } from "./EventContext";

class EventManagerImpl implements EventManager {
    private readonly url: string
    private eventSource?: EventSource

    constructor(url: string) {
        this.url = url;
    }

    subscribe(topic: string, listener: Listener): void {
        if (!this.eventSource) {
            this.eventSource = new EventSource(this.url);
        }
        this.eventSource.addEventListener(topic, listener as any);
    }

    unsubscribe(topic: string, listener: Listener): void {
        this.eventSource!.removeEventListener(topic, listener as any);
    }
}

interface Props {
    url: string
}

const EventProvider: React.FC<Props> = props => {
    return <EventContext.Provider value={new EventManagerImpl(props.url)}>
        {props.children}
    </EventContext.Provider>
}

export default EventProvider;