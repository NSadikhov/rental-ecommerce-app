import React, { useEffect, useState } from 'react';
import '../Css/notifications.css';

// import Link from 'react-router-dom/Link';

// import Card from '@material-ui/core/Card';
// import Paper from '@material-ui/core/Paper';
// import CardHeader from '@material-ui/core/CardHeader';
// import CardContent from '@material-ui/core/CardContent';
// // import Avatar from '@material-ui/core/Avatar';
// import StarsIcon from '@material-ui/icons/Stars';
// import LocationOnIcon from '@material-ui/icons/LocationOn';
// import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';
// import { red } from '@material-ui/core/colors';
// import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import List from '@material-ui/core/List';
// import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
// import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
// import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import Rent from '../Components/Rent';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLikedRents } from '../Redux/actions/dataActions';
import { readNotification } from '../Redux/actions/userActions';

import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';

import noOffer from '../Images/undraw_no_offer.svg';
import noMessageData from '../Images/undraw_no_message.svg';
import noNotFound from '../Images/undraw_not_found.svg';
// import dayjs from '../util/customDayJs';



const StyledBadgeDot = withStyles((theme) => ({
    badge: {
        right: 7,
        top: 4,
        border: `3px solid ${theme.palette.background.paper}`,
        padding: '6px',
        borderRadius: '50%'
    },
}))(Badge);

const StyledHeaderBadgeDot = withStyles((theme) => ({
    badge: {
        right: -7,
        top: 4,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '5px',
        borderRadius: '50%'
    },
}))(Badge);


const Notifications = (props) => {
    // const classes = useStyles();

    const { notifications } = props;

    // useEffect(() => {
    //     props.getLikedRents()
    // }, [])
    const matches_950 = useMediaQuery('(max-width:950px)');


    // useEffect(() => {
    //     if (notifications) console.log(notifications.filter((each) => each.type === 'offer'))
    // }, [notifications])

    const [navigation, setNavigation] = useState(0);


    return (
        <div className='main'>
            <div className="container">

                <div className="notificationsContent">
                    <h2 className="notificationsContent_header">Bildirişlər</h2>

                    {notifications &&
                        <div className="notificationsContent_inside">
                            <div className="notificationsContent_insideHeader">

                                <button className='notificationsContent_inside_S_header' onClick={() => matches_950 && setNavigation(0)} active={navigation === 0 ? 'enabled' : undefined}>
                                    <StyledHeaderBadgeDot color='error' variant='dot' style={{ display: navigation !== 0 && notifications.filter(each => each.type === 'offer' && !each.read).length > 0 ? 'inline-flex' : 'none' }}>
                                        <span>
                                            Təkliflər
                                    </span>
                                    </StyledHeaderBadgeDot>

                                    <span style={{ display: navigation !== 0 && notifications.filter(each => each.type === 'offer' && !each.read).length > 0 ? 'none' : 'block' }}>
                                        Təkliflər
                                    </span>
                                </button>
                                <button className='notificationsContent_inside_S_header' onClick={() => matches_950 && setNavigation(1)} active={navigation === 1 ? 'enabled' : undefined}>

                                    <StyledHeaderBadgeDot color='error' variant='dot' style={{ display: navigation !== 1 && notifications.filter(each => each.type === 'message' && !each.read).length > 0 ? 'inline-flex' : 'none' }}>
                                        <span>
                                            Mesajlar
                                    </span>
                                    </StyledHeaderBadgeDot>

                                    <span style={{ display: navigation !== 1 && notifications.filter(each => each.type === 'message' && !each.read).length > 0 ? 'none' : 'block' }}>
                                        Mesajlar
                                    </span>
                                </button>
                                <button className='notificationsContent_inside_S_header' onClick={() => matches_950 && setNavigation(2)} active={navigation === 2 ? 'enabled' : undefined}>

                                    <StyledHeaderBadgeDot color='error' variant='dot' style={{ display: navigation !== 2 && notifications.filter(each => (each.type === 'other' || each.type === 'demand') && !each.read).length > 0 ? 'inline-flex' : 'none' }}>
                                        <span>
                                            Digər
                                    </span>
                                    </StyledHeaderBadgeDot>

                                    <span style={{ display: navigation !== 2 && notifications.filter(each => (each.type === 'other' || each.type === 'demand') && !each.read).length > 0 ? 'none' : 'block' }}>
                                        Digər
                                    </span>
                                </button>
                            </div>
                            <div className="notificationsContent_insideBox">
                                <div className='notificationsContent_inside_S1' active={navigation === 0 ? 'enabled' : undefined}>
                                    {notifications.length > 0 ?
                                        <List className='notificationsContent_inside_S1_list notifications_Section'>
                                            {
                                                notifications.filter((each) => each.type === 'offer').length > 0 &&
                                                notifications.filter((each) => each.type === 'offer').map((each) =>
                                                    <ListItem
                                                        alignItems="flex-start"
                                                        className='notificationsContent_inside_S_listPart'
                                                        divider
                                                        onClick={() => {
                                                            if (each.hasOwnProperty('read') && !each.read) props.readNotification(each.id);
                                                            if (each.link) props.history.push(`/user#${each.link}`);
                                                        }}
                                                    >
                                                        <ListItemAvatar>

                                                            <Avatar src={each.senderPhoto} className='notifications_Avatars' style={{ display: each.read ? 'block' : 'none' }} />

                                                            <StyledBadgeDot color='error' variant='dot' style={{ display: each.read ? 'none' : 'inline-flex' }}>
                                                                <Avatar src={each.senderPhoto} className='notifications_Avatars' />
                                                            </StyledBadgeDot>

                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={<span className='notificationsContent_inside_S_listPart_header' style={{ fontWeight: each.read ? 'normal' : 'bold' }}>{each.title} <ErrorRoundedIcon style={{ display: each.read ? 'none' : 'block' }} /></span>}
                                                            secondary={
                                                                <React.Fragment>
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body2"
                                                                        // className={classes.inline}
                                                                        color="textPrimary"
                                                                    >
                                                                        {each.rentName}
                                                                    </Typography>
                                                                    {" — "} {each.content}
                                                                </React.Fragment>
                                                            }
                                                        />
                                                    </ListItem>
                                                )
                                            }
                                        </List>
                                        :
                                        <div className='notifications_noData'>
                                            <img src={noOffer} alt='no data' />
                                        </div>
                                    }

                                </div>
                                <div className='notificationsContent_inside_S1' active={navigation === 1 ? 'enabled' : undefined}>
                                    {notifications && notifications.length > 0 ?
                                        <List className='notificationsContent_inside_S1_list notifications_Section'>
                                            {
                                                notifications.filter((each) => each.type === 'message').length > 0 &&
                                                notifications.filter((each) => each.type === 'message').map((each) =>
                                                    <ListItem
                                                        alignItems="flex-start"
                                                        className='notificationsContent_inside_S_listPart'
                                                        divider
                                                        onClick={() => {
                                                            if (each.hasOwnProperty('read') && !each.read) props.readNotification(each.id);
                                                            if (each.link) props.history.push(`/user#${each.link}`);
                                                        }}
                                                    >
                                                        <ListItemAvatar>

                                                            <Avatar src={each.senderPhoto} className='notifications_Avatars' style={{ display: each.read ? 'block' : 'none' }} />

                                                            <StyledBadgeDot color='error' variant='dot' style={{ display: each.read ? 'none' : 'inline-flex' }}>
                                                                <Avatar src={each.senderPhoto} className='notifications_Avatars' />
                                                            </StyledBadgeDot>

                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={<span className='notificationsContent_inside_S_listPart_header' style={{ fontWeight: each.read ? 'normal' : 'bold' }}>{each.title} <ErrorRoundedIcon style={{ display: each.read ? 'none' : 'block' }} /></span>}
                                                            secondary={
                                                                <React.Fragment>
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body2"
                                                                        // className={classes.inline}
                                                                        color="textPrimary"
                                                                    >
                                                                        {each.rentName}
                                                                    </Typography>
                                                                    {" — "} {each.content}
                                                                </React.Fragment>
                                                            }
                                                        />
                                                    </ListItem>
                                                )}
                                        </List>
                                        :
                                        <div className='notifications_noData'>
                                            <img src={noMessageData} alt='no data' />
                                        </div>
                                    }
                                </div>
                                <div className='notificationsContent_inside_S1' active={navigation === 2 ? 'enabled' : undefined}>
                                    {notifications && notifications.length > 0 ?
                                        <List className='notificationsContent_inside_S1_list notifications_Section'>
                                            {
                                                notifications.filter((each) => each.type === 'other' || each.type === 'demand').length > 0 &&
                                                notifications.filter((each) => each.type === 'other' || each.type === 'demand').map((each) =>
                                                    <ListItem
                                                        alignItems="flex-start"
                                                        className='notificationsContent_inside_S_listPart'
                                                        divider
                                                        onClick={() => {
                                                            if (each.hasOwnProperty('read') && !each.read) props.readNotification(each.id);
                                                            if (each.link) {
                                                                if (each.type === 'other') props.history.push(`/user#${each.link}`);
                                                                else if (each.type === 'demand') props.history.push(`/rentals/${each.link}`);
                                                            }
                                                        }}
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar src={each.senderPhoto} className='notifications_Avatars' style={{ display: each.read ? 'block' : 'none' }} />
                                                            <StyledBadgeDot color='error' variant='dot' style={{ display: each.read ? 'none' : 'inline-flex' }}>
                                                                <Avatar src={each.senderPhoto} className='notifications_Avatars' />
                                                            </StyledBadgeDot>

                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={<span className='notificationsContent_inside_S_listPart_header' style={{ fontWeight: each.read ? 'normal' : 'bold' }}>{each.title} <ErrorRoundedIcon style={{ display: each.read ? 'none' : 'block' }} /></span>}
                                                            secondary={
                                                                <React.Fragment>
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body2"
                                                                        // className={classes.inline}
                                                                        color="textPrimary"
                                                                    >
                                                                        {each.demandName}
                                                                    </Typography>
                                                                    {" — "} {each.content}
                                                                </React.Fragment>
                                                            }
                                                        />
                                                    </ListItem>
                                                )}
                                        </List>
                                        :
                                        <div className='notifications_noData'>
                                            <img src={noNotFound} alt='no data' />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

        </div>
    )
}

Notifications.propTypes = {
    // user: PropTypes.object.isRequired,
    getLikedRents: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
}

const mapActionsToProps = { getLikedRents, readNotification };

const mapStateToProps = (state) => ({
    // user: state.user,
    data: state.data,
    notifications: state.firestore.ordered.notifications,
})


export default connect(mapStateToProps, mapActionsToProps)(Notifications);