import React, { Fragment, useState } from 'react';

import { connect } from 'react-redux';
// import { resetEmail } from '../Redux/actions/userActions';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const ChangeEmail = (props) => {

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [newEmail, setNewEmail] = useState('');

    const handleSubmit = () => {
        // if (newEmail.trim() !== '')
            // props.resetEmail(newEmail);
    }

    return (<Fragment>
        <Button variant="outlined" color="primary" onClick={handleClickOpen} size='large'>
            Emaili Dəyiş
      </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth='sm'>
            <DialogContent>

                <TextField
                    // autoFocus
                    margin="dense"
                    id="newEmail"
                    label="Yeni Email"
                    fullWidth
                    autoComplete='off'
                    defaultValue={newEmail}
                    onBlur={(e) => setNewEmail(e.currentTarget.value)}
                />

            </DialogContent>
            <DialogActions className='DialogActions'>
                <Button onClick={handleClose} color="primary">
                    Çıxış
          </Button>
                <Button onClick={handleSubmit} color="primary">
                    Dəyiş
          </Button>
            </DialogActions>
        </Dialog>
    </Fragment>)
}

const mapStateToProps = (state) => ({
    // user: state.user,
    // UI: state.UI
    // credentials: state.user.credentials
})

const mapActionsToProps = {  };

ChangeEmail.propTypes = {
    resetEmail: PropTypes.func.isRequired
}


export default connect(mapStateToProps, mapActionsToProps)(ChangeEmail);