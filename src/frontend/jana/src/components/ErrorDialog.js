import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ICONS = {
  error: <ErrorOutlineIcon color="error" />,
  warning: <WarningAmberIcon color="warning" />,
  info: <InfoOutlinedIcon color="info" />,
};

const ErrorDialog = ({
  open,
  onClose,
  title = 'Error',
  message = 'Something went wrong.',
  type = 'error', // "error" | "warning" | "info"
  buttonLabel = 'OK',
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {ICONS[type] || ICONS.error}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          {buttonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
