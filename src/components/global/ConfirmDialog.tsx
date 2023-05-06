import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from './Dialog';
import Button from './Button';
import Divider from './Divider';

const ConfirmDialog = (props: any) => {
    const { title, open, onClose, onConfirm, confirmButton, text } = props;

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle color='text.secondary'>
                {title}
            </DialogTitle>
            {text &&
                <DialogContent>
                    {text}
                </DialogContent>
            }
            <Divider />
            <DialogActions>
                <Button
                    variant="text"
                    onClick={onClose}
                >
                    Annuler
                </Button>
                <Button onClick={() => { onClose(); onConfirm(); }}>
                    {confirmButton}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;