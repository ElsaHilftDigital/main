import React from 'react';

const ToastContext = React.createContext({ show: (title: string, message: string) => {}});

export default ToastContext;
