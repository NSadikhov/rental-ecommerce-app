import React, { useState, useEffect, forwardRef } from 'react';
import '../Css/user.css'

import { makeStyles } from '@material-ui/core/styles';

import { red } from '@material-ui/core/colors';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { useFirestoreConnect } from 'react-redux-firebase';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ArrowDropDownCircleTwoToneIcon from '@material-ui/icons/ArrowDropDownCircleTwoTone';
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
// import Popover from '@material-ui/core/Popover';
import Profile from '../Components/User/Profile';
import Offers from '../Components/User/Offers';
import Messages from '../Components/User/Messages';
import Operations from '../Components/User/Operations';
import Belongings from '../Components/User/Belongings';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import Slide from '@material-ui/core/Slide';

import { setUserOnline, setUserOffline } from '../Redux/actions/userActions';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
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

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const useStyles = makeStyles((theme) => ({
    root: {
        // maxWidth: 300,
        // cursor: 'pointer',
        borderRadius: '8px',
        letterSpacing: '0.5px',

    },
    rootP: {
        flexGrow: 1,
    },
    rootS: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
    },
    mediaPart: {
        padding: '0 0 0 16px',
        marginBottom: 48
    },
    media: {
        cursor: 'pointer',
        height: 170,
        objectFit: 'cover',
        borderRadius: '10px'
        // paddingTop: '56.25%', // 16:9
    },
    sentOfferMedia: {
        cursor: 'pointer',
        height: 250,
        objectFit: 'cover',
        borderRadius: '10px',
        marginTop: '15px'
    },
    headerSection: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    nameSection: {
        display: 'flex',
        flexDirection: 'column'
        // alignItems: 'center'
    },
    name: {
        // fontWeight: 'bold',
        fontSize: '1.1rem'
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
    offerName: {
        fontSize: '1.1rem',
        maxWidth: '47ch',
        display: 'block',
        lineHeight: 'none',
        '&> span': {
            fontWeight: 'bold',
        },
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 'bold'
    },
    avatar: {
        backgroundColor: red[500],
    },
    rentSubInfo: {
        padding: '10px 0 0 0 !important'
    },
    cardContent: {
        padding: '10px 16px 5px 16px !important'
    },
    infoContent: {
        padding: '0px 16px 0px 16px !important'
    },
    cardActions: {
        marginTop: 10,
        padding: 16
    },
    starSection: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.9rem'
    },
    star: {
        color: red[500],
        marginRight: '3px'
    },
    messagebtn: {
        position: 'absolute',
        left: '16px',
        bottom: '16px',
        background: '#149EB0',
        color: 'white',

        '&:hover': {
            background: '#1292a3'
        }
    },
    messageSentOfferbtn: {
        background: '#149EB0',
        color: 'white',

        '&:hover': {
            background: '#1292a3'
        }
    },
    details: {
        letterSpacing: '1px',
        fontSize: '1rem'
    },
    dates: {
        // fontWeight: 'bold',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    datesBox: {
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        '& > span': {
            marginTop: 5
        },
        '& > span > span': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }
    },
    dateBox_line: {
        margin: '0 5px'
    },
    priceExplanation: {
        position: 'relative',
        width: '100%',
    },
    priceExpSpan: {
        margin: '7px 0px'
    },
    calcPrice: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '&>span': {
            marginTop: 5,
            fontSize: '1.15rem'
        }
    },
    calcPriceSentOffer: {
        fontWeight: 'bold',

    },
    right: {
        float: 'right',
    },
    leftGrid: {
        // position: 'relative'
    },
    rightGrid: {
        // position: 'relative'
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelbtn: {
        // position: 'absolute',
        // left: '16px',
        // bottom: '16px',
        // background: '#149EB0',
        // color: 'white',

        '&:hover': {
            // background: '#1292a3'
        }
    },
    rentbtn: {
        // position: 'absolute',
        // right: '16px',
        // bottom: '16px',
        background: red[500],
        color: 'white',

        '&:hover': {
            background: red[600]
        }
    },
    buttons: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16
    },
    cardHeader: {
        margin: '0 16px',
        padding: '10px 0 ',
        borderBottom: `2px solid ${red[500]}`
    },
    sentOfferButtons: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '10px',
        padding: '15px 0 15px 0',
        borderTop: '1px solid rgba(0,0,0,0.3)'
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
    rentalUserName: {
        fontSize: '1rem',
    },
}));

function getHash(hash) {
    if (hash.trim() !== "") {
        switch (hash) {
            case '#profile':
                return 0;
            case '#offers':
                return 1;
            case '#offers-sent':
                return 1;
            case '#offers-received':
                return 1;
            case '#messages':
                return 2;
            case '#operations':
                return 3;
            case '#belongings':
                return 4;
            default:
                return 0
        }
    }
    else {
        return 0;
    }
}

const User = (props) => {


    const matches_650 = useMediaQuery('(min-width:650px)');

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { auth, allMessagesOriginal } = props;

    const [active, setActive] = useState(false);

    useEffect(() => {
        setValue(getHash(window.location.hash))
    }, [props.location.hash])

    useEffect(() => {
        if (!auth.isEmpty) {
            props.setUserOnline();
        }
        return () => {
            if (!auth.isEmpty) {
                props.setUserOffline();
            }
        }
    }, [])

    useFirestoreConnect([
        {
            collection: 'allMessages',
            where: [['IDs', 'array-contains', auth.uid]],
            orderBy: [['last_message_date', 'desc']],
            storeAs: 'allMessagesOriginal'
        },
    ])

    const [allMessages, setAllMessages] = useState(allMessagesOriginal);

    useEffect(() => {
        if (allMessagesOriginal)
            setAllMessages(Array.from(allMessagesOriginal).sort((x, y) => x.last_message_date < y.last_message_date ? 1 : x.last_message_date === y.last_message_date ? 0 : -1))
    }, [allMessagesOriginal])

    const [verifyDialogDetails, setVerifyDialogDetails] = useState({
        content: '',
        btn_text: '',
        openVerifyDialog: false,
        handleCloseVerifyDialog: () => {}
    })

    return (
        <div className='main'>
            <div className='userPage'>
                <div className={classes.rootP + ' sections'} >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="standard"
                        aria-label="simple-tabs"
                        centered

                    >
                        <Tab className='userPage_Tab' href='#profile' label="Profil" {...a11yProps(0)} style={{ display: !matches_650 ? value === 0 ? 'inline-flex' : 'none' : 'inline-flex' }} />
                        <Tab className='userPage_Tab' href='#offers-received' label="Təkliflər" {...a11yProps(1)} style={{ display: !matches_650 ? value === 1 ? 'inline-flex' : 'none' : 'inline-flex' }} />
                        <Tab className='userPage_Tab' href='#messages' label={
                            <span style={{ position: 'relative' }}>
                                Mesajlar
                        <span className='customBadgeStandart' style={{ display: value !== 2 && allMessages && allMessages.find((each) => each.senderId !== auth.uid && each.unseenMessages) ? 'initial' : 'none' }}>

                                </span>
                            </span>
                        } {...a11yProps(2)} style={{ display: !matches_650 ? value === 2 ? 'inline-flex' : 'none' : 'inline-flex' }} />
                        <Tab className='userPage_Tab' href='#operations' label="Əməliyyatlar" {...a11yProps(3)} style={{ display: !matches_650 ? value === 3 ? 'inline-flex' : 'none' : 'inline-flex' }} />
                        <Tab className='userPage_Tab' href='#belongings' label="Əşyalarım" {...a11yProps(4)} style={{ display: !matches_650 ? value === 4 ? 'inline-flex' : 'none' : 'inline-flex' }} />

                    </Tabs>
                    <ArrowDropDownCircleTwoToneIcon
                        onClick={() => { setIsOpen((previousState) => { setTimeout(() => { setActive(true) }, 1); return !previousState; }) }}
                        className='userPage_Tab_Icon' color='primary' fontSize='large' style={{ display: !matches_650 ? 'initial' : 'none', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />

                    {isOpen &&

                        <ClickAwayListener onClickAway={(e) => { e.preventDefault(); setIsOpen(false); setActive(false); }}>
                            <div className={`userPage_Tab_Icon_contentBox${isOpen && active ? ' isClicked' : ''}`}>
                                {value !== 0 && <a onClick={() => { setIsOpen(false); setActive(false); setValue(0) }} className={isOpen && active ? 'isOpen' : ''} href='#profile' {...a11yProps(0)}>Profil</a>}
                                {value !== 1 && <a onClick={() => { setIsOpen(false); setActive(false); setValue(1) }} className={isOpen && active ? 'isOpen' : ''} href='#offers' {...a11yProps(1)}>Təkliflər</a>}
                                {value !== 2 && <a onClick={() => { setIsOpen(false); setActive(false); setValue(2) }} className={isOpen && active ? 'isOpen' : ''} href='#messages' {...a11yProps(2)}>Mesajlar</a>}
                                {value !== 3 && <a onClick={() => { setIsOpen(false); setActive(false); setValue(3) }} className={isOpen && active ? 'isOpen' : ''} href='#operations' {...a11yProps(3)}>Əməliyyatlar</a>}
                                {value !== 4 && <a onClick={() => { setIsOpen(false); setActive(false); setValue(4) }} className={isOpen && active ? 'isOpen' : ''} href='#belongings' {...a11yProps(4)}>Əşyalarım</a>}
                            </div>
                        </ClickAwayListener>

                    }
                </div>
                <div className='container'>
                    <TabPanel value={value} index={0}>
                        <Profile />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Offers classes={classes} history={props.history} location={props.location} verifyDialogOBJ={{verifyDialogDetails, setVerifyDialogDetails}} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Messages history={props.history} location={props.location} allMessages={allMessages} setAllMessages={setAllMessages} />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Operations classes={classes} history={props.history} />
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <Belongings history={props.history} verifyDialogOBJ={{verifyDialogDetails, setVerifyDialogDetails}}  />
                    </TabPanel>
                </div>
            </div>

            <Dialog
                open={verifyDialogDetails.openVerifyDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={verifyDialogDetails.handleCloseVerifyDialog}
                aria-labelledby="form-dialog"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent dividers>
                    <DialogContentText color='textPrimary' id="alert-dialog-slide-description" style={{ marginBottom: 0 }}>
                        {verifyDialogDetails.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            props.history.push('/user');
                            verifyDialogDetails.handleCloseVerifyDialog();
                        }}
                        className='skyColor_btn' size='medium' color='primary' variant='contained'>
                        {verifyDialogDetails.btn_text}
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}


const mapStateToProps = (state) => ({
    user: state.user,
    auth: state.firebase.auth,
    allMessagesOriginal: state.firestore.ordered.allMessagesOriginal,
})

const mapActionsToProps = { setUserOnline, setUserOffline };

User.propTypes = {
    user: PropTypes.object.isRequired,
    // getAllMessages: PropTypes.func.isRequired,
    // sendMessage: PropTypes.func.isRequired
}


export default connect(mapStateToProps, mapActionsToProps)(User);