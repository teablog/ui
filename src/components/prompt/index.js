import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

function Prompt({ open, close, content = "" }) {
    return (
        <div>
            <Dialog
                keepMounted
                open={open && content != ""}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} color="secondary">知道了～</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Prompt