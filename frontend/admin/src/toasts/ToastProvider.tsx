import React, { useState } from 'react';
import ToastContext from './ToastContext';
import styled from 'styled-components';
import { Toast as BootstrapToast } from 'react-bootstrap';

interface Toast {
    title: string,
    message: string,
    autoHide: boolean,
    onClose: () => void,
}

const ToastProvider: React.FC = props => {
    const [toasts, setToasts] = useState<{ [key: string]: Toast }>({});
    const addToast = (title: string, message: string, autoHide: boolean = true) => {
        const id = Math.random().toString() + Date.now().toString();
        setToasts({
            ...toasts,
            [id]: {
                title: title,
                message: message,
                autoHide: autoHide,
                onClose: () => removeToast(id),
            },
        });
    };

    const removeToast = (id: string) => {
        setToasts(values => {
            const newToasts = Object.assign({}, values);
            delete newToasts[id];
            return newToasts;
        });
    };

    return <ToastContext.Provider value={{ show: addToast }}>
        <ToastContainer>
            {Object.entries(toasts).map(([id, toast]) =>
                <ToastContent key={id} {...toast} />,
            )}
        </ToastContainer>
        {props.children}
    </ToastContext.Provider>;
};

export default ToastProvider;

const ToastContainer = styled.div`
    position: fixed;
    z-index: 1000;
    padding-top: 6rem;
    padding-right: 1rem;
    top: 0;
    right: 0;
`;

const ToastBody = styled(BootstrapToast.Body)`
    white-space: pre-line;
`;

const ToastContentInternal: React.FC<Toast> = props => {
    return <BootstrapToast onClose={props.onClose} delay={3000} autohide={props.autoHide}>
        <BootstrapToast.Header>
            <strong className="mr-auto">{props.title}</strong>
        </BootstrapToast.Header>
        <ToastBody>{props.message}</ToastBody>
    </BootstrapToast>;
};

const ToastContent = React.memo(ToastContentInternal);
