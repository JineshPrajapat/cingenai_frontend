import { useDispatch } from 'react-redux';
import { showSnackbar } from '../features/ui/uiSlice';

export const useNotify = () => {
  const dispatch = useDispatch();
  return {
    success: (message) => dispatch(showSnackbar({ message, severity: 'success' })),
    error: (message) => dispatch(showSnackbar({ message, severity: 'error' })),
    warning: (message) => dispatch(showSnackbar({ message, severity: 'warning' })),
    info: (message) => dispatch(showSnackbar({ message, severity: 'info' })),
  };
};