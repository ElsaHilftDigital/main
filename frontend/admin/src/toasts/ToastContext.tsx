import React from 'react';

const ToastContext = React.createContext({ show: (title: string, message: string, autoHide: boolean = true) => {}});

export default ToastContext;
