import React, { Fragment, useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { sendFirstMessage, createMessageChatBox } from '../Redux/actions/userActions';

import { handleOpenSignIn } from '../Redux/actions/uiActions';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';

import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
// import Rating from '@material-ui/lab/Rating';
import StarsIcon from '@material-ui/icons/Stars';
import red from '@material-ui/core/colors/red';
// import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
// import Autocomplete from '@material-ui/lab/Autocomplete';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { getFirestore } from 'redux-firestore';
import Link from 'react-router-dom/Link';
import withRouter from 'react-router-dom/withRouter';
import Grid from '@material-ui/core/Grid';
import dayjs from '../util/customDayJs';

import { message_templates } from '../dbSchema';

import DateRangePickerWrapper from '../Components/DateTimePickerWrapper';
import { calculateRating, replaceBlockedWords } from '../util';

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(7.5),
        height: theme.spacing(7.5),
        boxShadow: '0 1px 3px #646464'
    },
    rentalUserName: {
        fontSize: '1rem',
    },
    starSection: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1rem'
    },
    star: {
        color: red[500],
        marginRight: '2px'
    },
    messageIconbtn: {
        backgroundColor: '#149EB0',
        padding: 8,
        '&>span': {
            color: 'white',
        },
        '&:hover': {
            '&>span': {
                color: '#1292a3',
            },
        }
    },

}));

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },

    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },

});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const SendMessage = (props) => {
    const classes = useStyles();

    const db = getFirestore();

    const { rentInfo, auth, className, type } = props;

    const [open, setOpen] = useState(false);

    const [messageDetails, setmessageDetails] = useState({
        dateTimeMessage: {
            date: '',
            time: ''
        },
        templates: [],
        specialMessage: null,
        toId: '',
        recipientFullname: '',
        recipientPhotoUrl: '',
        // recipientRating: 0,
        rentId: '',
        rentName: '',
        rentImage: '',
    })

    // const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setmessageDetails({
            ...messageDetails,
            [event.target.name]: event.target.value
        });
    }

    const [submitError, setSubmitError] = useState(false);

    const handleSubmit = () => {

        const templates = message_templates.filter((_, index) => {
            return options[index] === true;
        })

        if (templates.length > 0 || (templates.length === 0 && messageDetails.specialMessage && messageDetails.specialMessage.trim() !== '')) {
            props.sendFirstMessage({
                ...messageDetails,
                templates: templates.length > 0 ? templates : null,
                specialMessage: messageDetails.specialMessage ? messageDetails.specialMessage.trim() === '' ? null : replaceBlockedWords(messageDetails.specialMessage) : null
            });

            setIsSubmitted(true);
        }
        else {
            setSubmitError(true);
        }

    }

    const handleClickOpen = () => {
        if (!auth.isEmpty) {
            db.collection('allMessages').where(`${auth.uid}.allowed`, '==', true).where(`${messageDetails.toId}.allowed`, '==', true).where('rentId', '==', messageDetails.rentId).limit(1).get()
                .then((data) => {
                    if (!data.empty) {
                        props.history.push('/user#messages');
                    }
                    else {
                        return db.collection('offers').where('fromId', '==', auth.uid).where('toId', '==', messageDetails.toId).where('rentId', '==', messageDetails.rentId).limit(1).get();
                    }
                })
                .then(data => {
                    if (!data.empty && data.docs[0].data().status !== 'waiting') {
                        return props.createMessageChatBox({
                            toId: messageDetails.toId,
                            recipientFullname: messageDetails.recipientFullname,
                            recipientPhotoUrl: messageDetails.recipientPhotoUrl,
                            rentOwner: messageDetails.rentOwner,
                            rentId: messageDetails.rentId,
                            rentName: messageDetails.rentName,
                            rentImage: messageDetails.rentImage,
                        }, props.history)
                    }
                    else {
                        return setOpen(true);
                    }
                })
                .catch(err => console.log(err));
        }
        else
            props.handleOpenSignIn();
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setmessageDetails({
            ...messageDetails,
            recipientFullname: rentInfo.userFullname,
            recipientPhotoUrl: rentInfo.userPhoto,
            // recipientRating: rentInfo.userRating,
            toId: rentInfo.userId,
            rentOwner: rentInfo.userId,
            rentId: rentInfo.id,
            rentName: rentInfo.name,
            rentImage: rentInfo.imageUrls[0]
        })
    }, [rentInfo])

    let obj = {};
    message_templates.forEach((_, index) => {
        obj[index] = false;
    })

    const [options, setOptions] = useState(obj);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [next, setNext] = useState(false);

    const timeSlots = Array.from(new Array(17)).map(
        (_, index) => `${(index + 7) < 10 ? '0' : ''}${index + 7}:00`
    );

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [Time, setTime] = useState({
        startTime: null,
        endTime: null
    });

    const [error, setError] = useState(false);
    const [dayCount, setDayCount] = useState(0);
    const [active, setActive] = useState(false);

    const [openStartTime, setOpenStartTime] = useState(false);
    const [openEndTime, setOpenEndTime] = useState(false);

    useEffect(() => {
        if (startDate !== null && endDate !== null) {
            let dayCount = dayjs(endDate).diff(dayjs(startDate), 'd');
            // console.log(dayCount)
            if (Time.startTime !== null && Time.endTime !== null) {
                let timeCount = dayCount * 24 - Number(Time.startTime.split(':')[0]) + Number(Time.endTime.split(':')[0]);

                if (dayCount !== 0) {
                    if (timeCount > (dayCount * 24)) {
                        dayCount++;
                    }
                }

                // const discount = round(OfferDiscountCalculation(dayCount, rent.daily, rent.weekly_discount, rent.monthly_discount), 2);
                // const priceWithDiscount = round((price * discount / 100), 2);
                // const commission = round(((price - priceWithDiscount) * 10 / 100), 2);
                // const total = round((price - priceWithDiscount + commission), 2);

                // setOfferCalcObj({ timeCount, dayCount, price, discount, priceWithDiscount, commission, total });
                setDayCount(dayCount)

                if (dayCount < props.minDay) {
                    setError(true);
                }
                else {
                    error !== false && setError(false);
                    setActive(true);
                    setmessageDetails({
                        ...messageDetails,
                        dateTimeMessage: {
                            date: `${dayjs(startDate).format('DD MMM YYYY')} - ${dayjs(endDate).format('DD MMM YYYY')}`,
                            time: `${Time.startTime} - ${Time.endTime}`
                        }
                    });
                }
            }
            else {
                setActive(false);
                setDayCount(dayCount);
            }
        }
    }, [startDate, endDate, Time.startTime, Time.endTime])

    return (
        <Fragment>

            <Button variant="contained" className={className} onClick={() => handleClickOpen()}>
                Mesaj yaz
                </Button>

            <Dialog open={open} onClose={handleClose} aria-labelledby={!next ? "form-dialog-SendMessagesPrev" : "form-dialog-SendMessages"} fullWidth maxWidth='sm'>
                <DialogTitle onClose={handleClose}>
                    <div className='rentalDialogHeader'>
                        <Avatar src={rentInfo.userPhoto} className={classes.large} />
                        <span>
                            <span className={classes.rentalUserName}>
                                {rentInfo.userFullname}
                            </span>
                            {/* <Rating value={rentInfo.userRating} precision={0.5} readOnly className='rentalUserRating' /> */}
                            {rentInfo.userRating.length > 0 &&
                                <span className={classes.starSection}><StarsIcon fontSize='small' className={classes.star} />{calculateRating(rentInfo.userRating)}</span>
                            }
                        </span>

                    </div>
                </DialogTitle>
                <DialogContent dividers style={{ overflowY: !next ? 'visible' : 'auto', display: isSubmitted ? 'flex' : 'unset', justifyContent: isSubmitted ? 'center' : 'unset' }}>
                    {!isSubmitted ?
                        !next ?
                            <>
                                <span className='sendMessage_rentalTimeTitle'>Əvvəlcə Kirayə müddətini seçin.</span>
                                <span className='rentalTimeLabel'>
                                    Gün
                                    </span>
                                <DateRangePickerWrapper
                                    startDatePlaceholderText='Başlanğıc'
                                    endDatePlaceholderText='Bitiş'
                                    // showClearDates 
                                    // showDefaultInputIcon
                                    // anchorDirection='right'
                                    block
                                    inputIconPosition="after"
                                    displayFormat='DD/MM/YYYY'
                                    hideKeyboardShortcutsPanel
                                    numberOfMonths={1}
                                    minimumNights={0}
                                    // appendToBody  
                                    initialStartDate={startDate}
                                    initialEndDate={endDate}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    isDayBlocked={props.isDayBlocked}
                                    isOutsideRange={props.isOutsideRange}
                                    readOnly
                                    customArrowIcon={
                                        <div className='vertLine_DateTimePicker' />
                                    }
                                />
                                <Grid item xs={12} style={{ marginTop: 10 }}>
                                    <span className='rentalTimeLabel'>
                                        Saat
                                    </span>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth variant="outlined" size='small'>
                                                <InputLabel id="SM_start_time_label" >Başlanğıc</InputLabel>
                                                <Select
                                                    disabled={startDate === null || endDate === null}
                                                    name='SM_start_time'
                                                    labelId="SM_start_time_label"
                                                    id="SM_start_time"
                                                    open={openStartTime}
                                                    onClose={() => setOpenStartTime(false)}
                                                    onOpen={() => setOpenStartTime(true)}
                                                    onChange={(event) => setTime({ ...Time, startTime: event.target.value })}
                                                    label="Başlanğıc"
                                                    MenuProps={{ style: { maxHeight: 300 } }}
                                                >
                                                    {timeSlots.map(each => {
                                                        return <MenuItem
                                                            key={each}
                                                            value={each}
                                                            disabled={dayjs(startDate).isSame(dayjs(), 'd') && Number(each.split(':')[0]) <= new Date().getHours() ? true : false}
                                                        >
                                                            {each}
                                                        </MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth variant="outlined" size='small'>
                                                <InputLabel id="SM_end_time_label" >Bitiş</InputLabel>
                                                <Select
                                                    disabled={Time.startTime === null}
                                                    name='SM_end_time'
                                                    labelId="SM_end_time_label"
                                                    id="SM_end_time"
                                                    open={openEndTime}
                                                    onClose={() => setOpenEndTime(false)}
                                                    onOpen={() => setOpenEndTime(true)}
                                                    onChange={(event) => setTime({ ...Time, endTime: event.target.value })}
                                                    label="Bitiş"
                                                    MenuProps={{ style: { maxHeight: 300 } }}

                                                >
                                                    {timeSlots.map(each => {
                                                        return <MenuItem
                                                            disabled={(dayCount === 0 && Time.startTime) ? Number(each.split(':')[0]) - Number(Time.startTime.split(':')[0]) >= props.minTime ? false : true : false}
                                                            key={each}
                                                            value={each}>
                                                            {each}
                                                        </MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {error &&
                                            <Grid item style={{ padding: '0 8px' }}>
                                                <div className='helperText' style={{ marginTop: 0 }}>Minimum {props.minDay} gün seçilmiş olmalıdır.</div>
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>

                            </>
                            :
                            <>
                                <h4 className='sendMessageHeader_P1'>Kirayə verəndən soruş:</h4>
                                <div className='sendMessageOptionsBox'>
                                    {message_templates.map((option, index) => {
                                        return <div key={index}>
                                            <FormControlLabel

                                                className='sendMessageOptionsBox_CheckBox'
                                                control={<Checkbox checked={options[index]} onChange={() => { setOptions({ ...options, [index]: !options[index] }); }} color="primary" />}
                                                label={option}
                                            />
                                        </div>
                                    })}
                                </div>
                                <h4 className='sendMessageHeader_P2'>Xüsusi mesaj</h4>
                                <span className='sendMessageSubheader_P2'>Başqa suallarınız var? Ətraflı bir mesajda bütün suallarınızı yazın.</span>
                                <TextField
                                    className='sendMessage_messageInput'
                                    margin="dense"
                                    name="specialMessage"
                                    label="Mesaj yaz"
                                    fullWidth
                                    variant='outlined'
                                    multiline
                                    // rows={3}
                                    autoComplete='off'
                                    onChange={handleChange}
                                />

                                {submitError &&
                                    <Grid item>
                                        <div className='helperText'>Ən azı bir Şablon mesaj seçilmiş və ya bir xüsusi mesaj yazılmış olamalıdır.</div>
                                    </Grid>
                                }

                                <div className='sendMessage_INFO_bottom'>
                                    {/* <p><span className='red-text'>*</span>Təklif göndərməmişdən əvvəl yalnız 1 xüsusi mesaj yaza bilərsiniz.</p> */}
                                    <p><span className='red-text'>*</span>İstədiyiniz qədər şablon mesaj göndərə bilərsiniz.</p>
                                    {/* <p><span className='red-text'>*</span>Kirayə verən göndərəcəyiniz kirayə təklifini qəbul edərsə mesajlaşma tam açılacaq və onun telefon nömrəsi görsənəcək.</p> */}
                                    <p><span className='red-text'>*</span>Güvənliyiniz və məxfiliyiniz üçün təklifiniz qəbul edilməmişdən əvvəl telefon nömrənizi və sosial şəbəkə hesablarınızı yazmağınız qadağandır.</p>
                                </div>
                            </>
                        :
                        <>
                            <Link to='/user#messages' className='sendMessage_Link'>
                                Mesajlar bölməsinə yönlən
                                </Link>
                        </>
                    }
                </DialogContent>
                <DialogActions className='sendMessage_btnBox' aria-labelledby={next && !isSubmitted && 'active'}>
                    {next && !isSubmitted &&
                        <Button className='sendMessage_PrevBtn' color='default' onClick={() => { setNext(false); }} size='medium' >
                            Geri
                        </Button>
                    }
                    <Button disabled={isSubmitted} className='sendMessage_btn' isdisabled={isSubmitted && 'affirmative'} color='primary' onClick={() => next ? handleSubmit() : active === true ? setNext(true) : null} size='medium' >
                        {next ? 'Göndər' : 'Növbəti'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Fragment>
    )
}

const mapStateToProps = (state) => ({
    // authenticated: state.user.authenticated,
    // UI: state.UI,
    auth: state.firebase.auth
})

const mapActionsToProps = { handleOpenSignIn, sendFirstMessage, createMessageChatBox };

SendMessage.propTypes = {
    handleOpenSignIn: PropTypes.func.isRequired,
    sendFirstMessage: PropTypes.func.isRequired
}


export default connect(mapStateToProps, mapActionsToProps)(withRouter(SendMessage));