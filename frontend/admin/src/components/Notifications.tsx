import React from 'react'
import { useToast } from "toasts/useToast";
import { useEvents } from "events/useEvents";

const Notifications: React.FC = () => {
    const toast = useToast();
    useEvents('notification', event => {
        const { title, message } = JSON.parse(event.data);
        toast(title, message, false);
    });
    return null;
};

export default Notifications

interface ServerNotification {
    title: string
    message: string
}
