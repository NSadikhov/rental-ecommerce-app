import React, { useState, useEffect, forwardRef } from 'react';

// import Rating from '@material-ui/lab/Rating';
// import EditDetails from '../EditDetails';
// import ChangePassword from '../ChangePassword';
import IconButton from '@material-ui/core/IconButton';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import StarsIcon from '@material-ui/icons/Stars';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { getFirestore } from 'redux-firestore';
import { Link } from 'react-router-dom';

import dayjs from '../../util/customDayJs';
import SendMessage from '../SendMessage';

import AccessTimeRoundedIcon from '@material-ui/icons/AccessTimeRounded';

import agreementImg from '../../Images/undraw_agreement.svg';
import undraw_No_data from '../../Images/undraw_No_data.svg';


import { cancel_SentOffer, cancel_ReceivedOffer, accept_ReceivedOffer, sendFirstMessage } from '../../Redux/actions/userActions';
import { calculateRating, isEmptyObject, replaceBlockedWords } from '../../util';
import { message_templates } from '../../dbSchema';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-offer-${index}`}
            aria-labelledby={`simple-tab-offer-${index}`}
            {...other}
        >
            {/* {value === index && ( */}
            <Box>
                {children}
            </Box>
            {/* )} */}
        </div>
    );
}


TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};


function a11yPropsOffer(index) {
    return {
        id: `simple-tab-offer-${index}`,
        'aria-controls': `simple-tabpanel-offer-${index}`,
    };
}

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Offers = (props) => {

    const { auth, profile } = props;

    const db = getFirestore();

    useFirestoreConnect(() => [
        { collection: 'offers', where: [['toId', '==', auth.uid]], orderBy: [['createdAt', 'desc']], storeAs: 'receivedOffers' },
        { collection: 'offers', where: [['fromId', '==', auth.uid]], orderBy: [['createdAt', 'desc']], storeAs: 'sentOffers' }
    ])

    const { classes, receivedOffers, sentOffers } = props;

    const [offerValue, setOfferValue] = useState(props.location.hash.split('-')[1] === 'received' ? 0 : props.location.hash.split('-')[1] === 'sent' ? 1 : 0);

    const handleChangeOffer = (event, newValue) => {
        if (newValue === 0) {
            props.history.push('/user#offers-received');
        }
        else if (newValue === 1) {
            props.history.push('/user#offers-sent');
        }
        else {
            props.history.push('/user#offers');
        }

        setOfferValue(newValue);
    };

    const handleClickOfferRents = (rentId) => {
        props.history.push(`/rentals/${rentId}`);
    }

    const [open, setOpen] = useState(false);
    const [activeOfferDialog, setActiveOfferDialog] = useState({ id: '', type: '' });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openRent, setOpenRent] = useState(false);

    const handleClickOpenRent = () => {
        setOpenRent(true);
    };

    const handleCloseRent = () => {
        setOpenRent(false);
    };

    const [openMessage, setOpenMessage] = useState(false);
    const [offerInfo, setOfferInfo] = useState({});

    const handleClickOpenMessage = (offer) => {
        setOfferInfo(offer);
        setmessageDetails({
            dateTimeMessage: {
                date: `${dayjs(offer.start_date).format('DD MMM YYYY')} - ${dayjs(offer.end_date).format('DD MMM YYYY')}`,
                time: `${offer.startTime} - ${offer.endTime}`
            },
            toId: offer.toId,
            recipientFullname: offer.rentOwnerFullname,
            recipientPhotoUrl: offer.rentOwnerPhoto,
            rentOwner: offer.toId,
            rentId: offer.rentId,
            rentName: offer.productName,
            rentImage: offer.imageUrls[0],
        })
        setOpenMessage(true);
    };

    const handleCloseMessage = () => {
        setOpenMessage(false);
    };

    const filteredReceivedOffers = receivedOffers && receivedOffers.filter((offer) => offer.status === 'waiting');
    const filteredSentOffers = sentOffers && sentOffers.filter((offer) => offer.status === 'waiting');

    const [isSubmitted, setIsSubmitted] = useState(false);

    let obj = {};
    message_templates.forEach((_, index) => {
        obj[index] = false;
    })

    const [options, setOptions] = useState(obj);

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
        rentOwner: '',
        rentId: '',
        rentName: '',
        rentImage: '',
    })

    const handleChangeMessage = (event) => {
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

    const handleMessageClick = (offer) => {

        db.collection('allMessages').where(`${auth.uid}.allowed`, '==', true).where(`${offer.toId}.allowed`, '==', true).where('rentId', '==', offer.rentId).limit(1).get()
            .then((data) => {
                if (!data.empty) {
                    props.history.push('/user#messages');
                }
                else {
                    handleClickOpenMessage(offer)
                }
            })
    }

    return (
        <div className='offers'>
            <Tabs
                value={offerValue}
                onChange={handleChangeOffer}
                indicatorColor="primary"
                textColor="primary"
                variant="standard"
                aria-label="simple-tabs-offer"
                centered
            >
                <Tab label="Gələnlər" {...a11yPropsOffer(0)} />
                <Tab label="Göndərilənlər" {...a11yPropsOffer(1)} />
            </Tabs>
            <TabPanel value={offerValue} index={0} >
                <p className='offers_ExplanationText'>Burada sizin elanınıza gələn kirayə təklifləri görsənir. Nə qədər çox kirayə versəniz bir o qədər elanlarınız ön sıralara çıxacaq.</p>
                {filteredReceivedOffers && filteredReceivedOffers.length > 0 ?
                    <div className='offers_inside'>
                        {filteredReceivedOffers.map(offer => {
                            return (
                                <Card className={classes.root} elevation={4} key={offer.id}>
                                    <CardHeader
                                        className={classes.cardHeader}
                                        avatar={
                                            <Avatar className={classes.avatar} src={offer.userPhoto} />
                                        }
                                        title={
                                            <div className={classes.headerSection}>
                                                <span className={classes.nameSection}>
                                                    <span className={classes.name}>{offer.userFullname}</span>
                                                    <span className={classes.starSection}><StarsIcon fontSize='small' className={classes.star} />{offer.userRating}</span>
                                                </span>

                                                <IconButton className={classes.messageIconbtn} onClick={() => props.history.push('/user#messages')} >
                                                    <MailOutlineRoundedIcon />
                                                </IconButton>
                                            </div>
                                        }
                                    // subheader={
                                    // }

                                    />
                                    <CardContent>
                                        <span className={classes.offerName}>İstənilən əşya - <span>{offer.productName}</span></span>
                                    </CardContent>
                                    <CardContent className={classes.infoContent}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6} className={classes.leftGrid + ' receivedOffersImgBox'}>

                                                {/* <CardContent className={classes.mediaPart}> */}
                                                <img
                                                    className={classes.media + ' receivedOffersImg'}
                                                    src={offer.imageUrls[0]}
                                                    onClick={() => handleClickOfferRents(offer.rentId)}
                                                />

                                                {/* <SendMessage rentInfo={{
                                                            userFullname: offer.userFullname,
                                                            userPhoto: offer.userPhoto,
                                                            userId: offer.fromId,
                                                            userRating: offer.userRating
                                                        }}
                                                            className={classes.messagebtn}
                                                        /> */}
                                                {/* </CardContent> */}

                                            </Grid>
                                            <Grid item xs={6} className={classes.rightGrid}>
                                                <div className={classes.dates}>
                                                    <h3 className={classes.details}>
                                                        İstənilən aralıq
                                                        </h3>
                                                    <span className={classes.datesBox}>
                                                        <span>
                                                            <span>
                                                                {dayjs(offer.start_date).format('DD MMM')}
                                                            </span>
                                                            <span>
                                                                {offer.startTime}
                                                            </span>
                                                        </span>
                                                        <span className={classes.dateBox_line}>
                                                            -
                                                            </span>
                                                        <span>
                                                            <span>
                                                                {dayjs(offer.end_date).format('DD MMM')}
                                                            </span>
                                                            <span>
                                                                {offer.endTime}
                                                            </span>
                                                        </span>
                                                    </span>

                                                </div>
                                                {offer.hasOwnProperty('calculation') &&
                                                    <div className={classes.calcPrice}>
                                                        <h3 className={classes.details}>
                                                            Alacağınız Məbləğ
                                                            </h3>

                                                        <span>{(offer.calculation.total - offer.calculation.commission).toFixed(2)} <span className='manat'>&#8380;</span></span>
                                                    </div>
                                                }

                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions className={classes.buttons}>
                                        {/* <div className={classes.buttons}> */}
                                        <Button variant="outlined"
                                            color="secondary"
                                            className={classes.cancelbtn}
                                            onClick={() => { setActiveOfferDialog({ id: offer.id, type: 'received' }); handleClickOpen() }}>
                                            Ləğv et
                                                </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            className={classes.rentbtn}
                                            onClick={() => {
                                                setActiveOfferDialog({
                                                    id: offer.id,
                                                    offerDetails: {
                                                        fromId: offer.fromId,
                                                        toId: offer.toId,
                                                        rentOwnerPhoto: offer.rentOwnerPhoto,
                                                        productName: offer.productName,
                                                        rentOwnerFullname: offer.rentOwnerFullname,
                                                        rentId: offer.rentId
                                                    },
                                                    messageDetails: { toId: offer.fromId, rentId: offer.rentId },
                                                    type: 'received',
                                                }); handleClickOpenRent()
                                            }}
                                        >
                                            Kirayə Ver
                                                </Button>
                                        {/* </div> */}
                                    </CardActions>
                                </Card>
                            )
                        })}
                        {filteredReceivedOffers.length === 1 ?
                            <div></div>
                            : null
                        }
                    </div>
                    :
                    <div className='offers_noData'>
                        <img src={undraw_No_data} alt='no data' />
                        <span>
                            Hal-hazırda təklifiniz yoxdur.
                        </span>
                    </div>
                }
            </TabPanel>
            <TabPanel value={offerValue} index={1} >
                {/* <p className='offers_ExplanationText'>Burada servis haqqını ödəyib göndərdiyiniz və kirayə verən tərəfindən tezliklə cavablandırılacaq kirayə təklifləriniz görsənir. Kirayə təklifiniz qəbul olmasa servis haqqı balansınıza qaytarılır.</p> */}
                <p className='offers_ExplanationText'>Burada göndərdiyiniz və kirayə verən tərəfindən tezliklə cavablandırılacaq kirayə təklifləriniz görsənir.</p>

                {filteredSentOffers && filteredSentOffers.length > 0 ?
                    <div className='offers_inside sentOffers'>
                        {filteredSentOffers.map(offer => {
                            return (
                                <Card className={classes.root} elevation={4} key={offer.id}>
                                    <CardContent >
                                        <span className={classes.offerName}><span>{offer.productName}</span></span>

                                        <CardMedia
                                            className={classes.sentOfferMedia}
                                            image={offer.imageUrls[0]}
                                            title={offer.productName}
                                            onClick={() => handleClickOfferRents(offer.rentId)}
                                        />
                                    </CardContent>

                                    <CardContent className={classes.infoContent}>
                                        <h3 className={classes.details}>
                                            Detallar
                                </h3>

                                        <Typography className='sentOffers_DateTitle' variant='subtitle1' color="textPrimary" component="h6">Tarix: <span className={classes.right}>{dayjs(offer.start_date).format('D MMM')} <ChevronRightRoundedIcon color='error' /> {dayjs(offer.end_date).format('D MMM')}</span></Typography>
                                        <Typography className='sentOffers_TimeTitle' variant='subtitle1' color="textPrimary" component="h6">Saat: <span className={classes.right}>{offer.startTime} <ChevronRightRoundedIcon color='error' /> {offer.endTime}</span></Typography>

                                        {offer.hasOwnProperty('calculation') &&
                                            <Typography className='sentOffers_calcPriceSentOffer' variant='subtitle1' color="textPrimary" component="p"> <span>Əşyanı götürəndə nağd ödəyəcəyiniz məbləğ: </span><span className={classes.right}>{(offer.calculation.price - offer.calculation.priceWithDiscount).toFixed(2)} <span className='manat'>&#8380;</span></span></Typography>
                                        }

                                        <div className={classes.sentOfferButtons}>
                                            <IconButton className={classes.messageIconbtn} onClick={() => handleMessageClick(offer)}>
                                                <MailOutlineRoundedIcon />
                                            </IconButton>

                                            <Button variant="outlined" color="secondary" onClick={() => { setActiveOfferDialog({ id: offer.id, type: 'sent' }); handleClickOpen() }}>
                                                Ləğv et
                                                </Button>
                                        </div>

                                    </CardContent>

                                </Card>
                            )
                        })}
                        {filteredSentOffers.length === 1 ?
                            <>
                                <div></div>
                                <div></div>
                            </>
                            : filteredSentOffers.length === 1 ?
                                <div></div>
                                :
                                null
                        }
                    </div>
                    :
                    <div className='offers_noData'>
                        <img src={undraw_No_data} alt='no data' />
                        <span>
                            Hal-hazırda təklifiniz yoxdur.
                        </span>
                    </div>
                }
            </TabPanel>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="form-dialog"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle ><span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WarningRoundedIcon fontSize='large' style={{ color: '#FF6600', marginRight: 10, marginTop: '-1.5px' }} /></span></DialogTitle>
                <DialogContent dividers style={{ padding: 16 }}>
                    <DialogContentText className='offers_cancellation_dialog_Text' id="alert-dialog-slide-description" style={{ marginBottom: 0 }}>
                        <span>Təklifi ləğv etmək istədiyinizdən əminsinizmi?</span>
                        {
                            // fix
                        }
                        {/* {activeOfferDialog.type === 'sent' &&
                            <span>Servis haqqı balansınıza geri qaytarılacaq</span>
                        } */}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Geriyə
                            </Button>
                    <Button onClick={() => {
                        if (activeOfferDialog.type === 'received') {
                            props.cancel_ReceivedOffer(activeOfferDialog.id);
                        }
                        else if (activeOfferDialog.type === 'sent') {
                            props.cancel_SentOffer(activeOfferDialog.id);
                        }

                        handleClose();
                    }}
                        color="secondary">
                        Ləğv et
                            </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openRent}
                // TransitionComponent={Transition}
                // keepMounted
                onClose={handleCloseRent}
                aria-labelledby="form-dialog"
                aria-describedby="alert-dialog-slide-description"
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px 0'
                }}>
                    <img src={agreementImg}
                        style={{
                            width: '75px',
                            borderRadius: '50%'
                        }} />
                </div>
                <DialogContent dividers>
                    <DialogContentText id="alert-dialog-slide-description" style={{ marginBottom: 0 }}>
                        Təklifi qəbul etmək istədiyinizdən əminsinizmi?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRent} color="primary">
                        Geriyə
                            </Button>
                    <Button onClick={() => {
                        if (activeOfferDialog.type === 'received') {
                            if (Boolean(profile.verified)) {
                                props.accept_ReceivedOffer(activeOfferDialog.id, activeOfferDialog.offerDetails, activeOfferDialog.messageDetails, props.history);
                            }
                            else {
                                props.verifyDialogOBJ.setVerifyDialogDetails({
                                    content: profile.verified === undefined ? 'Əşyanızı kirayə verə bilmək üçün hesabınızı doğrulayın' : <>
                                        Hesabınız doğrulandıqdan sonra əşyanızı kirayə verə biləcəksiniz <AccessTimeRoundedIcon style={{
                                            color: 'rgb(30, 152, 200)',
                                            verticalAlign: 'text-top'
                                        }} fontSize='small' />
                                    </>,
                                    btn_text: profile.verified === undefined ? 'Doğrula' : 'Hesabım',
                                    openVerifyDialog: true,
                                    handleCloseVerifyDialog: () => {
                                        props.verifyDialogOBJ.setVerifyDialogDetails((prevS) => ({ ...prevS, openVerifyDialog: false }));
                                    }
                                });
                            }
                        }
                        // else if (activeOfferDialog.type === 'sent') {
                        //     props.accept_SentOffer(activeOfferDialog.id);
                        // }

                        handleCloseRent();
                    }}
                        color="secondary">
                        Kirayə ver
                            </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openMessage} onClose={handleCloseMessage} aria-labelledby="form-dialog" fullWidth maxWidth='sm'>
                <DialogTitle onClose={handleCloseMessage}>
                    <div className='rentalDialogHeader'>
                        <Avatar src={offerInfo.userPhoto} className={classes.large} />
                        <span>
                            <span className={classes.rentalUserName}>
                                {offerInfo.userFullname}
                            </span>
                            {/* <Rating value={rentInfo.userRating} precision={0.5} readOnly className='rentalUserRating' /> */}
                            {offerInfo.userRating && offerInfo.userRating.length > 0 &&
                                <span className={classes.starSection}><StarsIcon fontSize='small' className={classes.star} />{calculateRating(offerInfo.userRating)}</span>
                            }
                        </span>

                    </div>
                </DialogTitle>
                <DialogContent dividers style={{ overflowY: 'auto', display: isSubmitted ? 'flex' : 'unset', justifyContent: isSubmitted ? 'center' : 'unset' }}>
                    {!isSubmitted ?
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
                                onChange={handleChangeMessage}
                            />

                            {submitError &&
                                <Grid item>
                                    <div className='helperText'>Ən azı bir Şablon mesaj seçilmiş və ya bir xüsusi mesaj yazılmış olamalıdır.</div>
                                </Grid>
                            }

                            <div className='sendMessage_INFO_bottom'>
                                <p><span className='red-text'>*</span>Təklif göndərməmişdən əvvəl yalnız 1 xüsusi mesaj yaza bilərsiniz.</p>
                                <p><span className='red-text'>*</span>İstədiyiniz qədər şablon mesaj göndərə bilərsiniz.</p>
                                <p><span className='red-text'>*</span>Kirayə verən göndərəcəyiniz kirayə təklifini qəbul edərsə mesajlaşma tam açılacaq və onun telefon nömrəsi görsənəcək.</p>
                                <p><span className='red-text'>*</span>Güvənliyiniz və məxfiliyiniz üçün təklifiniz qəbul edilməmişdən əvvəl telefon nömrənizi və sosial şəbəkə hesablarınızı yazmağınız qadağandır.</p>
                            </div>
                        </>
                        :
                        <>
                            <Link to='/user#messages' className='sendMessage_Link' onClick={handleCloseMessage}>
                                Mesajlar bölməsinə yönlən
                                </Link>
                        </>
                    }
                </DialogContent>
                <DialogActions className='offerSendMessage_btnBox' aria-labelledby={!isSubmitted && 'active'}>
                    <Button disabled={isSubmitted} className='sendMessage_btn' isdisabled={isSubmitted && 'affirmative'} color='primary' onClick={() => !isSubmitted ? handleSubmit() : null} size='medium' >
                        {!isSubmitted ? 'Göndər' : 'Növbəti'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}


const mapStateToProps = (state) => ({
    // user: state.user,
    receivedOffers: state.firestore.ordered.receivedOffers,
    sentOffers: state.firestore.ordered.sentOffers,
    auth: state.firebase.auth,
    profile: state.firebase.profile
})

const mapActionsToProps = { cancel_SentOffer, cancel_ReceivedOffer, accept_ReceivedOffer, sendFirstMessage };


Offers.propTypes = {
    // user: PropTypes.object.isRequired,
}



export default connect(mapStateToProps, mapActionsToProps)(Offers);
