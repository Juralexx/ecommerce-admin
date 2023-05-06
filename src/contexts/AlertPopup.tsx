import { Alert } from '@/components/global';
import useAlert from './useAlert';

const AlertPopup = () => {
    const { text, type } = useAlert();

    if (text && type) {
        return (
            <Alert type={type} style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 100, boxShadow: 2 }}>
                {text}
            </Alert>
        );
    } else {
        return <></>;
    }
};

export default AlertPopup;