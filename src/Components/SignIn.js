import React, { useState, useEffect, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Divider from '@material-ui/core/Divider';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';

// import axios from 'axios';
// import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

// Redux stuff
import { connect } from 'react-redux';
import { loginUser, resetPassword } from '../Redux/actions/userActions';
import red from '@material-ui/core/colors/red';

import { handleCloseSignIn } from '../Redux/actions/uiActions';

// import { firebase } from '../Firebase';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 'unset',
        position: 'relative'
    },
    close: {
        position: 'absolute',
        top: '11.5px',
        right: -5,
        cursor: 'pointer',
        fontSize: '1.75rem',
        color: 'rgb(155, 155, 155)'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: '#FF6600',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        backgroundColor: 'transparent'
    },
    submit: {
        margin: theme.spacing(1, 0, 2),
        position: 'relative'
    },
    link: {
        fontSize: '0.8rem',
        cursor: 'pointer',
        marginBottom: 5,
        color: '#003EEE',
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    errors: {
        color: red[500],
        textAlign: 'center'
    },
    progress: {
        position: 'absolute'
    },
    gmail: {
        borderColor: '#CA3838',
        color: '#CA3838',
        '&:hover': {
            borderColor: '#CA3838',
        }
        // borderWidth: '2px',
        // borderRadius: '8px'
    },
    bottomGrid: {
        margin: "10px 0"
    },
    alternatives: {
        margin: '6px -8px'
    },
    input: {
        marginTop: 0
    },
    resetPassText: {
        textAlign: 'center',
        color: ' #545454',
        cursor: 'default'
    }
}));

const SignIn = (props) => {
    const classes = useStyles();

    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
    })

    const [userInfoErrors, setUserInfoErrors] = useState({
        email: false,
        password: false,
    })

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let isValid = true;

        if (!isForgot) {
            Object.keys(userInfo).forEach(info => {
                if (userInfo[info].trim() === '') {
                    setUserInfoErrors(prevState => ({ ...prevState, [info]: true })); isValid = false;
                }
                else { setUserInfoErrors(prevState => ({ ...prevState, [info]: false })) }
            });

            if (isValid)
                props.loginUser(userInfo, props.history);

        }
        else {
            if (userInfo.email.trim() === '') {
                setUserInfoErrors(prevState => ({ ...prevState, email: true })); isValid = false;
            }

            if (isValid)
                props.resetPassword(userInfo.email);
        }

    }

    const isFirstRun = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        if (props.UI.errors) {
            setErrors(props.UI.errors);
        }

    }, [props.UI])

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [isForgot, setIsForgot] = useState(false);

    return (
        <Container component="main" maxWidth="xs" className='signInUpBox'>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar} variant='rounded' >
                    <LockOutlinedIcon />
                </Avatar>
                <HighlightOffRoundedIcon color='action' fontSize='large' className={classes.close + ' accountCloseBtn'} onClick={props.handleCloseSignIn} />
                <Typography component="h1" variant="h5">
                    {isForgot ? 'Şifrəni Yenilə' : 'Daxil ol'}
                </Typography>
                <Grid container>
                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            className={classes.input}
                            fullWidth
                            id="email"
                            label="Email Adresi"
                            name="email"
                            autoComplete="email"
                            // autoFocus
                            value={userInfo.email}
                            onChange={handleChange}
                            // helperText={errors.email}
                            error={(userInfoErrors.email && userInfo.email.trim() === '') ? true : errors.email ? true : false}
                        />
                        {!isForgot &&
                            <TextField
                                variant="outlined"
                                margin="normal"
                                className={classes.input}
                                fullWidth
                                name="password"
                                label="Şifrə"
                                type={showPassword ? 'text' : 'password'}
                                value={userInfo.password}
                                id="password"
                                autoComplete="off"
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: <InputAdornment><IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton></InputAdornment>,
                                }}
                                // helperText={errors.password}
                                error={(userInfoErrors.password && userInfo.password.trim() === '') ? true : errors.password ? true : false}
                            />
                        }
                        {errors.general && (
                            <Typography variant='body2' className={classes.errors}>
                                {errors.general}
                            </Typography>
                        )}
                        {isForgot &&
                            <p className={classes.resetPassText}>Email adresinizə link göndəriləcək.</p>
                        }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={props.UI.loading}
                        >
                            {isForgot ? 'Şifrəni Yenilə' : 'Daxil ol'}
                            {(props.UI.loading) && <CircularProgress size={25} className={classes.progress} />}
                        </Button>
                        <Divider className='signInUpDivider' component='div' />
                        {/* <Grid container spacing={2} className={classes.alternatives}>
                        <Grid item xs>
                            <Button
                                fullWidth
                                variant="outlined"
                                color='primary'
                                className={classes.gmail}
                                startIcon={<Avatar variant='rounded' src={require('../Images/mail.png')} />}
                                onClick={() => {
                                    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
                                }}
                            >
                                gmaıl
                            </Button>
                        </Grid>
                        <Grid item xs>

                            <Button
                                fullWidth
                                variant="outlined"
                                color='primary'
                                // className={classes.alternatives}
                                startIcon={<Avatar variant='rounded' src={require('../Images/facebook2.png')} />}
                                onClick={() => {
                                    firebase.auth().signInWithRedirect(new firebase.auth.FacebookAuthProvider());
                                }}
                                disabled={true}
                            >
                                facebook
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider className='signInUpDivider' component='div' /> */}
                        <Grid container className={classes.bottomGrid}>
                            <Grid item style={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                                <span className={classes.link} onClick={() => { props.handleCloseSignIn(); props.handleOpenSignUp(); }}>
                                    Hesabın yoxdurmu? Qeydiyyatdan Keç
                            </span>
                            </Grid>
                            <Grid item style={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                                <span className={classes.link} onClick={() => { setIsForgot((prevState) => !prevState) }}>
                                    {isForgot ? 'Hesabına daxil ol' : 'Şifrənimi unutmusan?'}
                                </span>
                            </Grid>
                        </Grid>

                    </form>
                </Grid>
            </div>

        </Container>
    );
}

SignIn.prototype = {
    // classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})

const mapActionToProps = {
    loginUser,
    handleCloseSignIn,
    resetPassword
}

export default connect(mapStateToProps, mapActionToProps)(SignIn);