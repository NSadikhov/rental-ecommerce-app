import React, { useState, useEffect } from 'react';
import '../Css/mobileNavigation.css';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { useHistory } from 'react-router-dom';
import { withRouter } from "react-router-dom";

// import { isEmpty } from 'react-redux-firebase';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
// import ShoppingBasketRoundedIcon from '@material-ui/icons/ShoppingBasketRounded';

import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import withStyles from '@material-ui/core/styles/withStyles';
import Badge from '@material-ui/core/Badge';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';
// import AccountBalanceWalletRoundedIcon from '@material-ui/icons/AccountBalanceWalletRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';

import EmailRoundedIcon from '@material-ui/icons/EmailRounded';

import { logoutUser } from '../Redux/actions/userActions';
import { handleOpenSignIn, handleCloseSignIn } from '../Redux/actions/uiActions';

const StyledBadgeDot = withStyles((theme) => ({
    badge: {
        right: 28,
        top: 22,
        border: `3px solid ${theme.palette.background.paper}`,
        // padding: '6px 5px',
        height: 22,
        width: 22,
        borderRadius: '50%',
        letterSpacing: 'initial',
        backgroundColor: '#FF6600',
    },

}))(Badge);

{
    //fix
}
function getPathname(pathUrl) {
    return pathUrl === '/'
        ?
        'home'
        :
        pathUrl === '/user/basket'
            ?
            'basket'
            :
            pathUrl === '/rent-out' || pathUrl === '/request'
                ?
                'rent'
                :
                pathUrl === '/user/notifications'
                    ?
                    'notification'
                    :
                    pathUrl === '/user' || pathUrl === '/user/saved'
                        ?
                        'account'
                        :
                        pathUrl === '/user#messages'
                            ?
                            'message'
                            :
                            null
}

const MobileNavigation = (props) => {

    const { UI: { toggleChatView }, auth, profile, baskets, notifications } = props;

    const pathUrl = props.location.pathname;

    const [value, setValue] = useState(getPathname(pathUrl));

    useEffect(() => {
        setValue(getPathname(pathUrl))
    }, [pathUrl])

    const matches_850 = useMediaQuery('(min-width:850px)');
    const matches_750 = useMediaQuery('(min-width:750px)');

    const [prevValue, setPrevValue] = useState(null);

    const handleChange = (event, newValue) => {
        if (!auth.isEmpty) {
            setPrevValue(value);
            setValue(newValue);
        }
    };

    const [accountOptions, setAccountOptions] = useState(false);
    const [rentOptions, setRentOptions] = useState(false);

    return (
        <>
            {!matches_850 ?

                <div className='mobileNavigation' style={{ display: (toggleChatView && !matches_750) ? 'none' : 'block' }}>
                    <div className='container'>
                        <BottomNavigation value={value} onChange={handleChange} showLabels={false}>
                            <BottomNavigationAction
                                // label="Ana Səhifə"
                                onClick={() => props.history.push('/')}
                                className='navigationAction'
                                showLabel={false}
                                value="home"
                                icon={<HomeRoundedIcon />}
                            />
                            <BottomNavigationAction
                                onClick={() => !auth.isEmpty ? props.history.push('/user#messages') : props.handleOpenSignIn()}
                                className='navigationAction'
                                value="message"
                                showLabel={false}
                                icon={<EmailRoundedIcon />} />

                            {
                                // fix
                            }
                            {/* {baskets && baskets.length > 0 ?
                                <StyledBadgeDot color="error" badgeContent={baskets.length} max={9}>
                                    <BottomNavigationAction style={{ color: value === 'basket' ? '#FF6600' : 'rgba(0, 0, 0, 0.54)' }} onClick={() => { !auth.isEmpty ? props.history.push('/user/basket') : props.handleOpenSignIn() }} className='navigationAction' value="basket" showLabel={false} icon={<ShoppingBasketRoundedIcon />} />
                                </StyledBadgeDot>
                                :
                                <BottomNavigationAction onClick={() => { !auth.isEmpty ? props.history.push('/user/basket') : props.handleOpenSignIn() }} className='navigationAction' value="basket" showLabel={false} icon={<ShoppingBasketRoundedIcon />} />
                            } */}
                            <BottomNavigationAction
                                onClick={() => { !auth.isEmpty ? setRentOptions((previousState) => !previousState) : props.handleOpenSignIn() }}
                                className='navigationAction' value="rent" showLabel={false} icon={<AddCircleOutlineRoundedIcon className='navigationActionMiddleIcon' />} />

                            {notifications && notifications.filter(each => !each.read).length > 0 ?
                                <StyledBadgeDot color="error" badgeContent={notifications.filter(each => !each.read).length} max={9}>
                                    <BottomNavigationAction style={{ color: value === 'notification' ? '#FF6600' : 'rgba(0, 0, 0, 0.54)' }} onClick={() => { !auth.isEmpty ? props.history.push('/user/notifications') : props.handleOpenSignIn() }} className='navigationAction' value="notification" showLabel={false} icon={<NotificationsRoundedIcon />} />
                                </StyledBadgeDot>
                                :
                                <BottomNavigationAction onClick={() => { !auth.isEmpty ? props.history.push('/user/notifications') : props.handleOpenSignIn() }} className='navigationAction' value="notification" showLabel={false} icon={<NotificationsRoundedIcon />} />
                            }
                            <BottomNavigationAction
                                onClick={() => { !auth.isEmpty ? setAccountOptions((previousState) => !previousState) : props.handleOpenSignIn() }}
                                className='navigationAction'
                                value="account"
                                showLabel={false}
                                icon={!auth.isEmpty ? <img className='mobile_profileBtn_img' src={profile.photoUrl} /> : <AccountCircleRoundedIcon />}
                            />
                        </BottomNavigation>

                        {rentOptions &&
                            <ClickAwayListener onClickAway={(e) => { e.preventDefault(); setValue(prevValue); setRentOptions(false) }}>
                                <div
                                    className='mobileNavigation_rentOptions'
                                    style={{ display: rentOptions ? 'flex' : 'none' }}
                                >

                                    <button onClick={() => { setRentOptions(false); props.history.push('/rent-out'); }}>
                                        Kirayə ver
                            </button>
                                    <button onClick={() => { setRentOptions(false); props.history.push('/request'); }}>
                                        Tələb et
                            </button>

                                </div>
                            </ClickAwayListener>
                        }

                        {accountOptions &&
                            <ClickAwayListener onClickAway={(e) => { e.preventDefault(); setValue(prevValue); setAccountOptions(false) }}>
                                {!profile.isEmpty ?
                                    <div
                                        className='mobileNavigation_accountOptions'
                                        style={{ display: accountOptions ? 'flex' : 'none' }}
                                    >

                                        <button onClick={() => { setAccountOptions(false); props.history.push('/user#profile'); }}>
                                            <AccountBoxRoundedIcon color='error' /><span>Hesabım</span>
                                        </button>
                                        {
                                            // fix
                                        }
                                        {/* <button onClick={() => { setAccountOptions(false); props.history.push('/user/topUp'); }}>
                                            <AccountBalanceWalletRoundedIcon color='error' /><span>Balansım</span>
                                        </button> */}

                                        <button onClick={() => { setAccountOptions(false); props.history.push('/user/saved'); }}>
                                            <FavoriteRoundedIcon color='error' /><span>Bəyəndiklərim</span>
                                        </button>
                                        <button onClick={() => { setAccountOptions(false); props.logoutUser(); }}>
                                            <ExitToAppRoundedIcon color='error' /><span>Çıxış</span>
                                        </button>


                                    </div>
                                    :
                                    <></>
                                }
                            </ClickAwayListener>
                        }

                    </div>
                </div>

                : null
            }
        </>
    )
}


const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    baskets: state.firestore.ordered.baskets,
    notifications: state.firestore.ordered.notifications,
});

const mapActionsToProps = { logoutUser, handleOpenSignIn, handleCloseSignIn };

MobileNavigation.propTypes = {
    // classes: PropTypes.object.isRequired,
    // loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    handleOpenSignIn: PropTypes.func.isRequired,
    handleCloseSignIn: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
}


export default connect(mapStateToProps, mapActionsToProps)(withRouter(MobileNavigation));