import React from 'react';

export type Listener = (event: {data: any}) => void;

export interface EventManager {
    subscribe: (topic: string, listener: Listener) => void,
    unsubscribe: (topic: string, listener: Listener) => void,
}

const EventContext = React.createContext<EventManager | null>(null)

export default EventContext;