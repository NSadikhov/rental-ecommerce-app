import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
// import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';

import IconButton from '@material-ui/core/IconButton';
import red from '@material-ui/core/colors/red';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';

// import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { signupUser, checkEmailValidity, checkPhoneNumberExistence } from '../Redux/actions/userActions';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import { handleOpenSignIn } from '../Redux/actions/uiActions';

import { firebase as firebaseConfig } from '../Firebase';
// import { checkInputValidity, SIGNUP_USER_INFO, usePersistedState } from '../util';

import { prefix_list } from '../dbSchema';

import { useFirebase } from 'react-redux-firebase';

const useStyles = makeStyles((theme) => ({
  paper: {
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
  progress: {
    position: 'absolute'
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
    margin: theme.spacing(1, 0, 1),
  },
  numberSubmit: {
    margin: theme.spacing(2, 0, 3),
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
  link: {
    fontSize: '0.8rem',
    cursor: 'pointer',
    marginBottom: 5,
    color: '#003EEE',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  alternatives: {
    margin: '6px -8px'
  },
  input: {
    marginTop: 0
  },
  number: {
    // margin: '10px 0 12px 0'
  },
  appInfoLink: {
    cursor: 'pointer'
  },
  errors: {
    color: red[500],
    textAlign: 'center'
  },
}));


const SignUp = (props) => {
  const classes = useStyles();

  // let applicationVerifier;

  const firebase = useFirebase();


  const { UI } = props;

  const [userInfo, setUserInfo] = useState({
    name: '',
    surname: '',
    phoneNumber: '',
    email: '',
    password: '',
  })

  // const [number, setNumber] = useState('');

  // const [userInfo, setUserInfo] = usePersistedState(SIGNUP_USER_INFO, {
  //   name: '',
  //   surname: '',
  //   email: '',
  //   password: '',
  // })

  const [errors, setErrors] = useState({
    name: false,
    surname: false,
    phoneNumber: false,
    email: false,
    password: false,
  });

  // const [nextStep, setNextStep] = useState(false);

  const handleChange = (event) => {
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value
    });
  }

  const handleNext = (event) => {
    let isValid = true;
    Object.keys(userInfo).forEach(info => {
      if (info !== 'phoneNumber' && userInfo[info].trim() === '') {
        setErrors(prevState => ({ ...prevState, [info]: true })); isValid = false;
      }
      else { setErrors(prevState => ({ ...prevState, [info]: false })) }
    });

    if (isValid) {
      props.checkEmailValidity(userInfo.email, setNext);
    }
  }

  const [verificationIdTemp, setVerificationIdTemp] = useState('');

  const handleSubmit = async (event) => {

    let isValid = true;
    Object.keys(userInfo).forEach(info => {
      if ((userInfo[info].trim() === '') ||
        (info === 'phoneNumber' && userInfo.phoneNumber.length < 9)
      ) {
        setErrors(prevState => ({ ...prevState, [info]: true })); isValid = false;
      }
      else { setErrors(prevState => ({ ...prevState, [info]: false })) }
    });

    if (isValid) {
      setIsSubmitted(true);

      verificationIdTemp.confirm(verifCode)
        .then((result) => {
          firebase.firestore().doc(`/users/${result.user.uid}`).delete();
          firebase.auth().currentUser.delete()
        })
        .then(() => {
          props.signupUser({ ...userInfo, phoneNumber: `(${prefixValue}) ${userInfo.phoneNumber}` }, props.history, props.handleCloseSignUp);
          setIsSubmitted(false);
        })
        .catch(err => {
          console.log(err);
          setIsCodeWrong(true);
          setIsSubmitted(false);
        })

    }
  }

  const handleNumberRequest = (event) => {

    let isValid = true;

    if (userInfo.info === 'phoneNumber' && userInfo.phoneNumber.length < 9) {
      setErrors(prevState => ({ ...prevState, phoneNumber: true })); isValid = false;
    }
    else { setErrors(prevState => ({ ...prevState, phoneNumber: false })) }

    if (isValid) {
      props.checkPhoneNumberExistence(`(${prefixValue}) ${userInfo.phoneNumber}`, () => {
        setIsClicked(true);
        const applicationVerifier = new firebaseConfig.auth.RecaptchaVerifier(
          'recaptcha-container', { 'size': 'invisible' });

        // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        // 'recaptcha-container')
        // let provider = new firebase.auth.PhoneAuthProvider();
        let numberWithPrefix = '+994' + `${prefixValue.substring(1, prefixValue.length)}${userInfo.phoneNumber.split('-').join('')}`;

        firebase.signInWithPhoneNumber(numberWithPrefix, applicationVerifier)
          .then((confirmationResult) => {
            setVerificationIdTemp(confirmationResult);

            setNext(2);
            setIsClicked(false);
          })
          .catch(err => {
            console.log(err)
          })
      })

    }
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [openPrefix, setOpenPrefix] = useState(false);
  const [prefixValue, setPrefixValue] = useState(prefix_list[0]);


  const [next, setNext] = useState(0);

  const [verifCode, setVerifCode] = useState('');

  const [isClicked, setIsClicked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isCodeWrong, setIsCodeWrong] = useState(false);

  return (
    <Container component="main" maxWidth="xs" className='signInUpBox'>
      <CssBaseline />
      <div className={classes.paper} style={{ paddingBottom: next ? 20 : 'initial' }}>
        <Avatar className={classes.avatar} variant='rounded' >
          <LockOutlinedIcon />
        </Avatar>

        <HighlightOffRoundedIcon color='action' fontSize='large' className={classes.close + ' accountCloseBtn'} onClick={props.handleCloseSignUp} />

        <Typography component="h1" variant="h5">
          {next === 0 ? 'Qeydiyyatdan Keç' : next === 1 ? 'Nömrənizi daxil edin' : next === 2 ? 'Kodu daxil edin' : null}
        </Typography>

        <form className={classes.form} noValidate>
          {next === 0 ?
            <>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField

                    name="name"
                    variant="outlined"
                    margin="normal"
                    error={userInfo.name.trim() === '' && errors.name}
                    fullWidth
                    onChange={handleChange}
                    id="name"
                    label="Ad"
                    // autoFocus
                    autoComplete='off'
                    className={classes.input}
                    style={{ marginBottom: 'unset' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    // helperText="fsdf"
                    margin="normal"
                    fullWidth
                    id="surname"
                    onChange={handleChange}
                    label="Soyad"
                    name="surname"
                    autoComplete='off'
                    className={classes.input}
                    error={userInfo.surname.trim() === '' && errors.surname}
                  // autoComplete="lname"
                  />
                </Grid>
              </Grid>

              <TextField
                variant="outlined"
                // helperText="fsdf"
                fullWidth
                margin="normal"
                id="email"
                label="Email Adresi"
                onChange={handleChange}
                name="email"
                className={classes.input}
                error={(userInfo.email.trim() === '' && errors.email) || UI.errors}
                // helperText={userInfo.email.trim() === '' && errors.email ? 'Emailinizi daxil edin' : UI.errors }
                autoComplete="email"
              />

              <TextField
                id="password"
                label="Şifrə"
                type={showPassword ? 'text' : 'password'}
                value={userInfo.password}
                variant='outlined'
                name="password"
                error={userInfo.password.trim() === '' && errors.password}
                onChange={handleChange}
                className={classes.input}
                fullWidth
                margin="normal"
                // helperText="fsdf"
                autoComplete='off'
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
              />
              {UI.errors && UI.errors.general && (
                <Typography variant='body2' className={classes.errors}>
                  {UI.errors.general}
                </Typography>
              )}

              <Button
                onClick={handleNext}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                İrəli
          </Button>
              <span style={{ display: 'block', fontSize: '0.75rem', marginBottom: '7.5px', textAlign: 'center' }}>
                Qeydiyyatdan keçərək mandarent.com-un <Link to='/userAgreement' onClick={() => props.handleCloseSignUp()} className={classes.appInfoLink}>İstifadəçi Razılaşması</Link> və <Link to='/privacyPolicy' onClick={() => props.handleCloseSignUp()} className={classes.appInfoLink}>Məxfilik Siyasəti</Link> ilə razılaşıram.
              </span>
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
              <Grid container justify="flex-end" className={classes.bottomGrid}>

                <span className={classes.link} onClick={() => { props.handleCloseSignUp(); props.handleOpenSignIn(); }}>
                  Hesabın var? Daxil ol
              </span>

              </Grid>
            </>
            :
            next === 1 ?
              <>
                <TextField
                  id="number"
                  label="Nömrə"
                  type='tel'
                  // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                  variant='outlined'
                  name="phoneNumber"
                  value={userInfo.phoneNumber}
                  error={(userInfo.phoneNumber.length < 9 && errors.phoneNumber) || (UI.errors && UI.errors.phone)}
                  helperText={(userInfo.phoneNumber.length < 9 && errors.phoneNumber) ?
                    'Nömrənizi daxil edin' :
                    (UI.errors && UI.errors.phone) ?
                      UI.errors.phone :
                      ''
                  }
                  onChange={(event) => {
                    const onlyNums = event.target.value.replace(/[^0-9]/g, '');
                    if (onlyNums) {
                      if (onlyNums.length < 7) {
                        setUserInfo({ ...userInfo, phoneNumber: onlyNums });

                        if (onlyNums !== event.target.value) {
                          event.target.value = userInfo.phoneNumber
                        }
                      }
                      else if (onlyNums.length === 7) {
                        const number = onlyNums.replace(
                          /(\d{3})(\d{2})(\d{2})/,
                          '$1-$2-$3'
                        );
                        setUserInfo({ ...userInfo, phoneNumber: number });
                        event.target.value = number
                      }
                      else {
                        event.target.value = userInfo.phoneNumber
                      }
                    }
                    else {
                      setUserInfo({ ...userInfo, phoneNumber: onlyNums });
                      event.target.value = onlyNums
                    }

                  }}
                  className={classes.input}
                  fullWidth
                  autoComplete='off'
                  margin="normal"
                  // helperText="fsdf"
                  // autoComplete='off'
                  InputProps={{
                    startAdornment: <InputAdornment><FormControl fullWidth variant="standard">
                      {/* <InputLabel id="city_label" ></InputLabel> */}
                      <Select
                        name='prefix'
                        // labelId="city_label"
                        id="prefix"
                        value={prefixValue}
                        open={openPrefix}
                        onOpen={() => {
                          setOpenPrefix(true);
                        }}
                        onChange={(event) => {
                          setPrefixValue(event.target.value)
                        }}
                        onClose={(event) => {
                          setOpenPrefix(false);
                        }}

                        // label="Şəhəri seçin"
                        MenuProps={{ style: { maxHeight: 300} , onExited: () => document.activeElement.blur() }}
                      >
                        {prefix_list.map(each => {
                          return <MenuItem key={each} value={each}>{each}</MenuItem>
                        })}

                      </Select>
                    </FormControl> </InputAdornment>,
                  }}
                />
                <div id='recaptcha-container'></div>

                <Button
                  // type="submit"
                  onClick={handleNumberRequest}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={isClicked}
                >
                  İrəli
                  {(isClicked) && <CircularProgress size={25} className={classes.progress} />}
                </Button>
              </>
              :
              next === 2 ?
                <>
                  <TextField
                    value={verifCode}
                    name="code"
                    variant="outlined"
                    margin="normal"
                    error={isCodeWrong}
                    helperText={isCodeWrong && 'Kod yanlışdır'}
                    fullWidth
                    onChange={(event) => { setIsCodeWrong(false); setVerifCode(event.target.value); }}
                    id="code"
                    label="Təsdiqləmə kodu"
                    // autoFocus
                    autoComplete='off'
                    className={classes.input}
                  // style={{ marginBottom: 'unset' }}
                  />
                  <div className='codeVerifBox'>
                    {isCodeWrong &&
                      <span className='codeVerifBtn' onClick={() => { setNext(1); setIsCodeWrong(false); }}>Geriyə qayıt</span>
                    }
                  </div>

                  <Button
                    onClick={handleSubmit}
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={isSubmitted}
                  >
                    Qeydiyyatdan Keç
                    {(isSubmitted) && <CircularProgress size={25} className={classes.progress} />}
                  </Button>
                </>
                :
                null
          }
        </form>

      </div>
    </Container>
  );
}

SignUp.prototype = {
  // classes: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
})

const mapActionToProps = {
  signupUser,
  handleOpenSignIn,
  checkEmailValidity,
  checkPhoneNumberExistence
}

export default connect(mapStateToProps, mapActionToProps)(SignUp);