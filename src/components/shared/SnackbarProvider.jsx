import { Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar, selectSnackbar } from "../../features/ui/uiSlice";

export default function SnackbarProvider() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(selectSnackbar);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => dispatch(hideSnackbar())}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={() => dispatch(hideSnackbar())}
        severity={severity}
        variant="filled"
        sx={{ width: '100%', borderRadius: 2 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}


