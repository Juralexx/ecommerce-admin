import React from 'react';

interface AlertProps {
    text: string,
    type: 'success' | 'info' | 'warning' | 'error' | ''
}

const ALERT_TIME = 5000;
const initialState: AlertProps = {
    text: '',
    type: '',
};

export const AlertContext = React.createContext({
    ...initialState,
    setAlert: (text: AlertProps['text'], type: AlertProps['type']) => { },
})

const AlertProvider = ({ children }: any) => {
    const [text, setText] = React.useState<AlertProps['text']>('');
    const [type, setType] = React.useState<AlertProps['type']>('');

    const setAlert = (text: AlertProps['text'], type: AlertProps['type']) => {
        setText(text);
        setType(type);

        setTimeout(() => {
            setText('');
            setType('');
        }, ALERT_TIME);
    };

    return (
        <AlertContext.Provider value={{ text, type, setAlert }}>
            {children}
        </AlertContext.Provider>
    )
};

export default AlertProvider;
