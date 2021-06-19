import React, { Fragment, useState } from 'react';

import { connect } from 'react-redux';
import { editUserDetails } from '../Redux/actions/userActions';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const EditDetails = (props) => {
    const { credentials } = props;

    const [open, setOpen] = useState(false);

    const [userDetails, setUserDetails] = useState({
        name: credentials.name,
        surname: credentials.surname,
        city: credentials.city,
        // biography: credentials.biography
    })

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = () => {
        props.editUserDetails(userDetails);
        handleClose();
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // useEffect(() => {
    //     setUserDetails({
    //         name: credentials.name,
    //         surname: credentials.surname,
    //         city: credentials.city,
    //         phoneNumber: credentials.phoneNumber
    //     })
    // }, [credentials])

    return (<Fragment>
        <Button variant="outlined" color="primary" onClick={handleClickOpen} size='large'>
            Düzəliş et
      </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth='sm'>
            <DialogContent>

                <TextField
                    // autoFocus
                    margin="dense"
                    name="name"
                    label="Ad"
                    fullWidth
                    autoComplete='off'
                    defaultValue={credentials.name}
                    onChange={handleChange}
                />
                <TextField
                    // autoFocus
                    margin="dense"
                    name="surname"
                    label="Soyad"
                    fullWidth
                    autoComplete='off'
                    defaultValue={credentials.surname}
                    onChange={handleChange}
                />
                <TextField
                    // autoFocus
                    margin="dense"
                    name="city"
                    label="Şəhər"

                    fullWidth
                    autoComplete='off'
                    defaultValue={credentials.city}
                    onChange={handleChange}
                />
                {/* <TextField
                    // autoFocus
                    margin="dense"
                    name="phoneNumber"
                    label="Nömrə"
                    type='tel'
                    pattern="[0-9]{2}-[0-9]{3}-[0-9]{2}-[0-9]{2}"
                    helperText='Düzgün yazılış qaydası: 051-534-23-53'
                    fullWidth
                    autoComplete='off'
                    defaultValue={credentials.phoneNumber}
                    onChange={handleChange}
                /> */}

               
                {/* </form> */}
            </DialogContent>
            <DialogActions className='DialogActions'>
                <Button onClick={handleClose} color="primary">
                    Çıxış
          </Button>
                <Button color="primary" onClick={handleSubmit}>
                    Düzəliş et
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

const mapActionsToProps = { editUserDetails };

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired
}


export default connect(null, mapActionsToProps)(EditDetails);