import React, { Fragment, useState } from 'react';

import { connect } from 'react-redux';
import { changePassword } from '../Redux/actions/userActions';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const ChangePassword = (props) => {

    const [open, setOpen] = useState(false);

    const { UI: { errors } } = props;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        if (passwordDetails.currentPassword.trim() !== '' &&
            passwordDetails.newPassword.trim() !== '' &&
            passwordDetails.repeatNewPassword.trim() !== '') {
            if (passwordDetails.newPassword === passwordDetails.repeatNewPassword) {
                props.changePassword(passwordDetails.currentPassword, passwordDetails.newPassword, handleClose);
                setError(null);
            }
            else {
                setError('Şifrənin təkrarı yeni şifrə ilə eyni deyildir.')
            }
        }
        else {
            setError('Boşluqları doldurun.')
        }

    }

    const [passwordDetails, setPasswordDetails] = useState({
        currentPassword: '',
        newPassword: '',
        repeatNewPassword: ''
    });

    const [error, setError] = useState(null);

    const [isSubmitted, setIsSubmitted] = useState(false);

    return (<Fragment>
        <Button variant="outlined" color="primary" onClick={handleClickOpen} size='large'>
            Parolu Dəyiş
      </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth='sm'>
            <DialogContent>

                <TextField
                    // autoFocus
                    margin="dense"
                    id="currentPassword"
                    label="Hal-hazırki Şifrə"
                    fullWidth
                    autoComplete='off'
                    defaultValue={passwordDetails.currentPassword}
                    onBlur={(e) => {
                        setPasswordDetails({ ...passwordDetails, currentPassword: e.currentTarget.value });
                        setIsSubmitted(false);
                    }}
                    error={passwordDetails.currentPassword.trim() === '' && isSubmitted || (!isSubmitted && errors && errors.general)}
                />
                <TextField
                    // autoFocus
                    margin="dense"
                    id="newPassword"
                    label="Yeni Şifrə"
                    fullWidth
                    autoComplete='off'
                    defaultValue={passwordDetails.newPassword}
                    onBlur={(e) => {
                        setPasswordDetails({ ...passwordDetails, newPassword: e.currentTarget.value });
                        setIsSubmitted(false);
                    }}
                    error={passwordDetails.newPassword.trim() === '' && isSubmitted}
                />
                <TextField
                    // autoFocus
                    margin="dense"
                    id="repeatNewPassword"
                    label="Yeni Şifrənin Təkrarı"
                    fullWidth
                    autoComplete='off'
                    defaultValue={passwordDetails.repeatNewPassword}
                    onBlur={(e) => {
                        setPasswordDetails({ ...passwordDetails, repeatNewPassword: e.currentTarget.value });
                        setIsSubmitted(false);
                    }}
                    error={passwordDetails.repeatNewPassword.trim() === '' && isSubmitted}
                />
                {(error || (!isSubmitted && errors && errors.general)) &&
                    <div className='helperText'>{error || errors.general}</div>
                }
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
    UI: state.UI
    // credentials: state.user.credentials
})

const mapActionsToProps = { changePassword };

ChangePassword.propTypes = {
    changePassword: PropTypes.func.isRequired
}


export default connect(mapStateToProps, mapActionsToProps)(ChangePassword);