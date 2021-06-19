import React, { useState, useEffect, useRef } from 'react';

// import Rating from '@material-ui/lab/Rating';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import StarsIcon from '@material-ui/icons/Stars';
import red from '@material-ui/core/colors/red';
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFirestore } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import { sendMessage, sendTemplateMessages, readMessages } from '../../Redux/actions/userActions';
import { handleToggleChatView } from '../../Redux/actions/uiActions';


import dayjs from '../../util/customDayJs';

import { getKeyByObject, isEmptyObject, replaceBlockedWords } from '../../util';
import { message_templates } from '../../dbSchema';
import PhoneEnabledRoundedIcon from '@material-ui/icons/PhoneEnabledRounded';

function MessageTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >

            <Box>
                {children}
            </Box>

        </div>
    );
}

MessageTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yPropsMessage(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}



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
    }

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


const Messages = (props) => {

    // const { classes, user: { profile } } = props;
    const classes = useStyles();

    const { UI: { toggleChatView }, auth, profile, allMessages, setAllMessages, activeTabMessages, userRents } = props;
    const matches_750 = useMediaQuery('(min-width:750px)');

    // useFirestoreConnect([
    //     {
    //         collection: 'allMessages',
    //         where: [['IDs', 'array-contains', auth.uid]],
    //         orderBy: [['last_message_date', 'desc']],
    //         storeAs: 'allMessagesOriginal'
    //     },
    // ])

    // const [allMessages, setAllMessages] = useState(allMessagesOriginal);

    // useEffect(() => {
    //     if (allMessagesOriginal)
    //         setAllMessages(Array.from(allMessagesOriginal).sort((x, y) => x.last_message_date < y.last_message_date ? 1 : x.last_message_date === y.last_message_date ? 0 : -1))
    // }, [allMessagesOriginal])


    const [messageValue, setMessageValue] = useState(null);

    const [activeTab, setActiveTab] = useState(null);

    const [recipient, setRecipient] = useState(null);

    // const chatBox = useRef(null);
    const handleChangeMessage = (event, newValue) => {
        if (newValue !== messageValue) {
            props.firestore.unsetListener({
                collection: `allMessages/${allMessages[newValue].id}/messages`,
                // orderBy: [['date', 'desc']],
                // limit: 15,
                storeAs: 'activeTabMessages'
            });

            // const id = event.currentTarget.getAttribute('name');
            const id = allMessages[newValue].IDs.find(each => each !== auth.uid);

            chatBoxRef.current && chatBoxRef.current.scrollTo(0, 0);

            // if (a) {
            //     props.firestore.unsetListener(`allMessages/${allMessages[newValue].id}/messages`);
            // } else {
            // setA(true);
            setActiveTab(allMessages[newValue].rentId);
            setMessageValue(newValue);

            setRecipient(id);

            props.handleToggleChatView(true);

            setmessageDetails({
                ...messageDetails,
                messageId: allMessages[newValue].id,
                toId: id,
                recipientFullname: allMessages[newValue][id].userFullname,
                recipientPhotoUrl: allMessages[newValue][id].userPhoto,
                rentId: allMessages[newValue].rentId,
                rentName: allMessages[newValue].rentName,
                unseenMessages: allMessages[newValue].unseenMessages
            })

            setTemplateMessageDetails({
                ...templateMessageDetails,
                toId: id,
                rentId: allMessages[newValue].rentId,
                rentName: allMessages[newValue].rentName,
                unseenMessages: allMessages[newValue].unseenMessages
            })

            props.firestore.setListener({
                collection: `allMessages/${allMessages[newValue].id}/messages`,
                orderBy: [['date', 'desc']],
                limit: 20,
                storeAs: 'activeTabMessages'
            });

            // props.firestore.setListener({
            //     collection: 'rents',
            //     where: [['userId', '==', id]],
            //     orderBy: [['createdAt', 'desc']],
            //     storeAs: 'userRents'
            // });

            // }
        }
    };

    const [messageDetails, setmessageDetails] = useState({
        messageId: '',
        body: '',
        toId: '',
        recipientFullname: '',
        recipientPhotoUrl: '',
        rentId: '',
        rentName: '',
        unseenMessages: 0
    })

    const [inputVal, setInputVal] = useState('');


    const handleSubmit = (event) => {
        if (messageDetails.body.trim() !== '') {
            props.sendMessage({ ...messageDetails, body: replaceBlockedWords(messageDetails.body) });
            setInputVal('');
            chatBoxRef.current.scrollTo(0, 0);
        }
    }

    const [submitError, setSubmitError] = useState(false);

    const [templateMessageDetails, setTemplateMessageDetails] = useState({
        templates: [],
        toId: '',
        rentId: '',
        rentName: '',
        unseenMessages: 0
    })

    const handleSubmitTemplate = () => {
        const templates = message_templates.filter((_, index) => {
            return options[index] === true;
        })

        if (templates.length > 0) {
            props.sendTemplateMessages({
                ...templateMessageDetails,
                templates: templates,
            });

            handleClose();
        }
        else {
            setSubmitError(true);
        }
    }


    let isFirst = auth.uid;
    let prevIsFirst = auth.uid;

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);

        let clearedObj = {};
        message_templates.forEach((_, index) => {
            clearedObj[index] = false;
        })

        setOptions(clearedObj)
    };

    // const handleChange = (event) => {
    //     setmessageDetails({
    //         ...messageDetails,
    //         [event.target.name]: event.target.value
    //     });
    // }

    let obj = {};
    message_templates.forEach((_, index) => {
        obj[index] = false;
    })

    const [options, setOptions] = useState(obj);

    const handleClickForwardRents = (rentId) => {
        props.history.push(`/rentals/${rentId}`);
    }

    useEffect(() => {
        if (activeTabMessages && messageValue !== null && allMessages[messageValue].senderId !== auth.uid) {
            props.readMessages(allMessages[messageValue].id);
        }

    }, [activeTabMessages])

    useEffect(() => {
        return () => {
            props.handleToggleChatView(false);
        }
    }, [])

    useEffect(() => {
        if (messageValue !== null) {
            // console.log(activeTab)
            const prevIndex = allMessages.findIndex((each) => each.rentId === activeTab);
            if (prevIndex !== -1) {
                if (prevIndex !== messageValue) {
                    props.readMessages(allMessages[prevIndex].id);
                    setMessageValue(prevIndex);
                    setmessageDetails({ ...messageDetails, unseenMessages: allMessages[prevIndex].unseenMessages })
                }
                else {
                    setmessageDetails({ ...messageDetails, unseenMessages: allMessages[messageValue].unseenMessages })
                }
            }
            else {
                setMessageValue(null);
                setActiveTab(null);
                setRecipient(null);
            }
        }

    }, [allMessages])

    useEffect(() => {
        if (activeTab && recipient && messageValue !== null) {
            setActiveTab(null);
            setMessageValue(null);
            setRecipient(null);
        }
    }, [props.location.hash])

    const chatBoxRef = useRef(null);

    const [openPhone, setOpenPhone] = useState(false);

    return (
        <div className="messages" style={{ paddingBottom: (toggleChatView && !matches_750) ? 15 : 30, borderBottom: (toggleChatView && !matches_750) ? 'none' : '1px solid #DDDDDD' }}>
            {allMessages &&
                <Card className="messages_inside" elevation={5}>

                    <div className="messages_left" style={{ display: (!matches_750 && activeTab) ? 'none' : 'initial' }}>
                        <div className="messages_left_header">
                            <input type="text" placeholder="Axtarış" />
                            {/* <img src={require('../Images/search6.png')} alt="" height="" /> */}
                            <SearchIcon color='primary' />
                        </div>
                        <div className="messages_left_inside" style={{ overflowY: allMessages.length > 0 ? 'scroll' : 'unset' }}>
                            <Tabs
                                orientation="vertical"
                                value={messageValue}
                                onChange={handleChangeMessage}
                                aria-label="Vertical tabs"
                                variant="scrollable"
                                className='leftSide_messageTabs'
                                TabIndicatorProps={{
                                    style: {
                                        borderRadius: 20,
                                        borderRight: '2px solid rgb(245, 0, 87)',
                                        width: '100%',
                                        backgroundColor: 'transparent',
                                        transitionDuration: '0.4s'
                                    }
                                }}
                            >
                                {allMessages.map((message, index) => {
                                    {/* console.log(message) */ }
                                    const messageKey = message.IDs.find(each => each !== auth.uid);
                                    {/* getKeyByObject(message, 'userFullname', `${profile.name} ${profile.surname}`); */ }
                                    {/* console.log(messageKey) */ }
                                    return (
                                        <Tab
                                            className='leftSide_messageTab'
                                            key={message.id}
                                            label={<div className='leftSide_messageTab_infoBox'>
                                                <span>
                                                    <span>{message[messageKey].userFullname}</span>
                                                    <span style={{ display: messageValue !== index && message.senderId !== auth.uid && message.unseenMessages ? 'initial' : 'none' }}>{messageValue !== index && message.senderId !== auth.uid && message.unseenMessages}</span>
                                                </span>
                                                <span>
                                                    <span><span className='grey-txt'>Əşya: </span><span>{message.rentName}</span></span>
                                                </span>
                                                <span>
                                                    <span>{message.last_message_body}</span>
                                                    <span>{message.last_message_body && message.last_message_date && dayjs(message.last_message_date).format('HH:mm')}</span>
                                                </span>
                                            </div>}
                                            // name={message.rentOwner}
                                            {...a11yPropsMessage(index)}
                                            icon={<div className='leftSide_messageImg'> <img src={message[messageKey].userPhoto} /></div>}
                                        />
                                    )
                                })}
                            </Tabs>

                        </div>


                    </div>
                    <div className="messages_right" style={{ display: !matches_750 ? (activeTab ? 'initial' : 'none') : 'initial' }}>
                        {/* {activeTabMessages && activeTabMessages.length > 0 && activeTabMessages.map((message, index) => { */}
                        {/* const messageKey = getKeyByObject(message, 'userFullname', `${profile.name} ${profile.surname}`); */}
                        {/* const fromId = message.fromId; */}
                        {/* return ( */}
                        {(activeTab !== null && recipient !== null && messageValue > -1) ?
                            <>
                                <MessageTabPanel value={messageValue} index={messageValue} >
                                    <div className="messages_right_header">
                                        <div>
                                            <ArrowBackIosRoundedIcon onClick={() => { props.handleToggleChatView(false); setMessageValue(null); setActiveTab(null); }} color='primary' style={{ display: !matches_750 ? 'initial' : 'none' }} />
                                            <span className='messages_right_header_userInfoBox'>
                                                <img src={allMessages[messageValue].rentImage} />
                                                <span>
                                                    <span>
                                                        {allMessages[messageValue][recipient] && allMessages[messageValue][recipient].userFullname}
                                                    </span>
                                                    <span onClick={() => handleClickForwardRents(allMessages[messageValue].rentId)}>
                                                        {allMessages[messageValue].rentName}
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                        {allMessages[messageValue].phoneNumbers &&
                                            <IconButton className='messages_phoneBox' onClick={() => setOpenPhone(prevState => !prevState)}>
                                                <PhoneEnabledRoundedIcon fontSize='large' color='primary' />
                                            </IconButton>
                                        }
                                    </div>
                                    <div className="messages_right_inside">
                                        <div className="messages_right_inside_left">
                                            {openPhone && allMessages[messageValue].phoneNumbers &&
                                                <div className='messages_phone'>
                                                    {allMessages[messageValue].phoneNumbers[recipient]}
                                                </div>
                                            }
                                            <div className="top" name='messages_chat' ref={chatBoxRef} >
                                                {activeTabMessages && activeTabMessages.length > 0 && activeTabMessages.map((message) => {
                                                    if (message.fromId !== isFirst) {
                                                        prevIsFirst = isFirst
                                                        isFirst = message.fromId
                                                    }
                                                    else {
                                                        prevIsFirst = isFirst;
                                                    }

                                                    return <div key={message.id} className={message.fromId === auth.uid ? 'sender' : 'recipient'} isfirst={isFirst !== prevIsFirst ? 'first' : ''}>
                                                        <div>
                                                            <span>
                                                                {message.dateMessage
                                                                    ?
                                                                    <>
                                                                        <span>
                                                                            Kirayələmək istədiyim vaxt aralığı
                                                                        </span>
                                                                        <div>

                                                                            <img src={allMessages[messageValue].rentImage} onClick={() => handleClickForwardRents(allMessages[messageValue].rentId)} />
                                                                            <span>
                                                                                {message.body.date}
                                                                            </span>
                                                                            <span>
                                                                                {message.body.time}
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    message.body
                                                                }
                                                            </span>
                                                            <div>
                                                                <span>
                                                                    {dayjs(message.date).format('HH:mm')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                })}


                                            </div>
                                            <div className="bottom">
                                                {/* fix later */}
                                                {/* {allMessages[messageValue].rentOwner === auth.uid || allMessages[messageValue].isAccepted ? */}
                                                <div>
                                                    <TextField
                                                        value={inputVal}
                                                        margin="dense"
                                                        // name="body"
                                                        variant='standard'
                                                        fullWidth
                                                        multiline
                                                        autoComplete='off'
                                                        onChange={(event) => {
                                                            if (event.target.value !== '\n') {
                                                                setInputVal(event.target.value);
                                                                setmessageDetails({
                                                                    ...messageDetails,
                                                                    body: event.target.value
                                                                });
                                                            }
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (event.key === 'Enter') {
                                                                if (messageDetails.body.trim() !== '') {
                                                                    handleSubmit();
                                                                }
                                                                else {
                                                                    setInputVal('')
                                                                }
                                                            }
                                                        }}
                                                    />

                                                    <IconButton onClick={handleSubmit} className='messages_sendBtn'>
                                                        <SendRoundedIcon color='primary' />
                                                    </IconButton>

                                                </div>

                                                {/* <>
                                                        <Button onClick={handleClickOpen} className=' capitalize' variant='text' size='small' color='primary'>Şablon mesajlar</Button>

                                                        <span>
                                                            Kirayə təklifiniz qəbul olunarsa mesaj yazmaq funksiyası və Kirayə verənin nömrəsi aktiv olacaq.
                                                </span>

                                                        <Button onClick={() => handleClickForwardRents(allMessages[messageValue].rentId)} className='lightRedColor_btn capitalize' variant='contained' size='small' color='secondary'>Təklif göndər</Button>
                                                    </> */}
                                                {/* } */}

                                                {/* <img src={require('../Images/emoji4.png')} alt="" height="" width="" />
                                                <img src={require('../Images/file_chooser3.png')} alt="" height="" width="" /> */}

                                            </div>
                                        </div>

                                    </div>

                                </MessageTabPanel>

                                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-SendMessages" fullWidth maxWidth='sm'>
                                    <DialogTitle onClose={handleClose}>
                                        <div className='rentalDialogHeader'>
                                            <Avatar src={allMessages[messageValue][recipient] && allMessages[messageValue][recipient].userPhoto} className={classes.large} />
                                            <span>
                                                <span className={classes.rentalUserName}>
                                                    {allMessages[messageValue][recipient] && allMessages[messageValue][recipient].userFullname}
                                                </span>
                                                {allMessages[messageValue][recipient] && allMessages[messageValue][recipient].userRating &&
                                                    <span className={classes.starSection}><StarsIcon fontSize='small' className={classes.star} />{allMessages[messageValue][recipient].userRating}</span>
                                                }
                                            </span>

                                        </div>
                                    </DialogTitle>
                                    <DialogContent dividers>
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

                                        {submitError &&
                                            <Grid item>
                                                <div className='helperText'>Ən azı bir Şablon mesaj seçilmiş olamalıdır.</div>
                                            </Grid>
                                        }

                                        <div className='sendMessage_INFO_bottom'>
                                            <p><span className='red-text'>*</span>İstədiyiniz qədər şablon mesaj göndərə bilərsiniz.</p>
                                            <p><span className='red-text'>*</span>Güvənliyiniz və məxfiliyiniz üçün təklifiniz qəbul edilməmişdən əvvəl telefon nömrənizi və sosial şəbəkə hesablarınızı yazmağınız qadağandır.</p>
                                        </div>
                                    </DialogContent>
                                    <DialogActions className='sendMessage_btnBox'>
                                        <Button className='sendMessage_btn' color="primary" onClick={handleSubmitTemplate} size='medium' >
                                            Göndər
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                            </>
                            :
                            <div className='messages_right_notSelected'>
                                <img src={require('../../Images/undraw_mobile_messages.svg')} />
                                <span>Mesajları görüntüləyə bilmək üçün hər hansı bir istifadəçini seçin.</span>
                            </div>
                        }
                        {/* ) */}
                        {/* })} */}
                    </div>

                </Card>
            }


        </div>
    )
}


const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,
    allMessagesOriginal: state.firestore.ordered.allMessagesOriginal,
    activeTabMessages: state.firestore.ordered.activeTabMessages,
    userRents: state.firestore.ordered.userRents,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
})

const mapActionsToProps = { sendMessage, sendTemplateMessages, readMessages, handleToggleChatView };

Messages.propTypes = {
    user: PropTypes.object.isRequired,
    sendMessage: PropTypes.func.isRequired,
    sendTemplateMessages: PropTypes.func.isRequired,
    readMessages: PropTypes.func.isRequired
}

// export default connect(mapStateToProps, mapActionsToProps)(Messages);

export default compose(
    withFirestore,
    connect(mapStateToProps, mapActionsToProps)
)(Messages);
