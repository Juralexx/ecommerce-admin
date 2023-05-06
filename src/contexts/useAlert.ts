import React from 'react';
import { AlertContext } from '../contexts/AlertContext';

const useAlert = () => React.useContext(AlertContext);

export default useAlert;