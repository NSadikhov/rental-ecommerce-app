import React, { useState, useEffect, useRef, Fragment } from 'react';
import logo from '../Images/logo.svg';
import logo_min from '../Images/mandarin.svg';
import { Link } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import SignUp from './SignUp';
import '../Css/header.css';
import '../Css/Modal.css';
import SignIn from './SignIn';
// import { Button, Avatar } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withFirestore } from 'react-redux-firebase';
// import { firebase } from '../Firebase';
import { compose } from 'redux';

// import { useHistory } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
// import Backdrop from '@material-ui/core/Backdrop';
// import Fade from '@material-ui/core/Fade';
import withStyles from '@material-ui/core/styles/withStyles';
import Badge from '@material-ui/core/Badge';
// import IconButton from '@material-ui/core/IconButton'
import AppsRoundedIcon from '@material-ui/icons/AppsRounded';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import ShoppingBasketRoundedIcon from '@material-ui/icons/ShoppingBasketRounded';

import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';
// import AccountBalanceWalletRoundedIcon from '@material-ui/icons/AccountBalanceWalletRounded';
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';

import { logoutUser } from '../Redux/actions/userActions';
import { handleOpenSignIn, handleCloseSignIn, clearErrors } from '../Redux/actions/uiActions';
import { getLikedRents } from '../Redux/actions/dataActions';
import { categories } from '../dbSchema';

import { priceFormat } from '../util';

const StyledBadgeDot = withStyles((theme) => ({
    badge: {
        right: 3,
        top: 3,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '4px',
        borderRadius: '50%',
    },

}))(Badge);

const StyledBadgeBasketDot = withStyles((theme) => ({
    badge: {
        right: 5,
        top: 5,
        border: `3px solid ${theme.palette.background.paper}`,
        height: 22,
        width: 22,
        borderRadius: '50%',
        letterSpacing: 'initial'
    },

}))(Badge);


const StyledBadgeStandart = withStyles((theme) => ({
    badge: {
        right: '-5px',
        top: '2px',
        border: `3px solid ${theme.palette.background.paper}`,
        padding: '3px',
        borderRadius: '50%'
    },
}))(Badge);

const Header = (props) => {

    const matches_550 = useMediaQuery('(min-width:550px)');
    // const matches_700 = useMediaQuery('(min-width:700px)');
    const matches_850 = useMediaQuery('(min-width:850px)');


    const [openSignUp, setOpenSignUp] = useState(false);

    const handleOpenSignUp = () => {
        setOpenSignUp(true);
    };

    const handleCloseSignUp = () => {
        setOpenSignUp(false);
        props.clearErrors();
    };

    const handleLogOut = () => {
        props.logoutUser();
        // window.location.replace('/');
        setOpen(false);
    }

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        // if (anchorRef.current && anchorRef.current.contains(event.target)) {
        //     return;
        // }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    const { UI: { openSignIn }, auth, profile, likedRents, notifications, baskets } = props;


    // useFirestoreConnect(() => [
    //     {
    //         // collection: 'notifications',
    //         // where: [['recipient', '==', !auth.isEmpty ? auth.uid : null]],
    //         // orderBy: [['createdAt', 'desc']],
    //         // storeAs: 'notifications'

    //         // collection: 'rents',
    //         // where: [['sortIndex', '>', 0]],
    //         // orderBy: [['sortIndex', 'desc']],
    //         // limit: 5,
    //         // storeAs: 'aaa'
    //     }
    // ])


    useEffect(() => {
        if (!auth.isEmpty) {
            props.firestore.setListener({
                collection: 'notifications',
                where: [['recipient', '==', auth.uid]],
                orderBy: [['createdAt', 'desc']],
                storeAs: 'notifications'
            });

            props.firestore.setListener({
                collection: 'baskets',
                where: [['userId', '==', auth.uid]],
                orderBy: [['createdAt', 'desc']],
                storeAs: 'baskets'
            });

        }

        return () => {
            props.firestore.unsetListener({
                collection: 'notifications',
                storeAs: 'notifications'
            });

            props.firestore.unsetListener({
                collection: 'baskets',
                storeAs: 'baskets'
            });
        }
    }, [auth])


    // useEffect(() => {
    //     if (likedRents)
    //         props.getLikedRents(likedRents);
    // }, [likedRents])


    const prevOpen = useRef(open);
    useEffect(() => {
        // if (prevOpen.current === true && open === false) {
        //     anchorRef.current.focus();
        // }

        prevOpen.current = open;
    }, [open]);

    function scroll() {
        if (headerRef.current !== null) {
            if (window.scrollY > 0) {
                headerRef.current.style.boxShadow = '0 0px 10px rgba(0, 0, 0, 0.325)';
                if (props.location.pathname === '/') {
                    if (window.scrollY > 160) {
                        setShowSearch(true)
                    }
                    else {
                        setShowSearch(false);
                    }
                }
                else if (props.location.pathname !== '/categories') {
                    setShowSearch(true);
                }
            }
            else {
                headerRef.current.style.boxShadow = 'none';
            }
        }
    }

    const headerRef = useRef(null);

    useEffect(() => {
        if (props.location.pathname === '/' || props.location.pathname === '/categories') setShowSearch(false);
        else setShowSearch(true);

        window.addEventListener('scroll', scroll);

        return () => {
            window.removeEventListener('scroll', scroll);
        }
    }, [props.location.pathname])

    const [showSearch, setShowSearch] = useState(false);

    const [search, setSearch] = useState('')
    const handleSearchClick = () => {
        props.history.push(`/categories?search=${search}`);
    }

    const [toggleDrawerBool, setToggleDrawerBool] = useState(false);
    let anchor = 'right';
    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setToggleDrawerBool(open);
    };

    const handleCategoriesClick = (event) => {
        props.history.push(`/categories?category=${event.currentTarget.getAttribute('name')}`);
    }

    const [openIcon, setOpenIcon] = useState(false);
    const anchorRefIcon = useRef(null);

    const handleOpenIcon = () => {
        setOpenIcon(true);
    };

    const handleCloseIcon = (event) => {
        // if (anchorRef.current && anchorRef.current.contains(event.target)) {
        //     return;
        // }

        setOpenIcon(false);
    };

    function handleListKeyDownIcon(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenIcon(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    // const prevOpenIcon = useRef(openIcon);
    // useEffect(() => {
    //     if (prevOpenIcon.current === true && openIcon === false) {
    //         anchorRef.current.focus();
    //     }

    //     prevOpenIcon.current = openIcon;
    // }, [openIcon]);

    return (
        <div className="header" ref={headerRef}>
            <div className='container'>
                <div className='header_inside'>

                    <Link to='/'>
                        <img src={logo} alt="logo" className='logo' hidden={!(matches_550)} />
                        <img src={logo} alt="logo" className='logo' hidden={!(!showSearch && !matches_550)} />
                        <img src={logo_min} alt="logo" className='logo_mini' hidden={!(showSearch && !matches_550)} />
                    </Link>

                    {showSearch ?
                        <form className="header_searchbar" onSubmit={handleSearchClick}>
                            <div className="header_searchbar_input1_Box">
                                <input
                                    type="search"
                                    placeholder="Nə lazımdır?"
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                            </div>
                            <div className='header_searchbar_BtnBox'>
                                <button type='submit'>
                                    <SearchRoundedIcon fontSize='small' />
                                </button>
                            </div>
                        </form>
                        :
                        null
                    }

                    <div className="navbar">
                        {matches_850 &&
                            <>
                                {props.location.pathname !== '/' &&
                                    <>
                                        <div
                                            className='navbar_categories'
                                            ref={anchorRefIcon}
                                            onClick={handleOpenIcon}
                                        >
                                            <AppsRoundedIcon fontSize='small' color='error' />
                                        </div>

                                        <Popper onMouseEnter={handleOpenIcon} onMouseLeave={handleCloseIcon} open={openIcon} anchorEl={anchorRefIcon.current} role={undefined} transition disablePortal style={{ zIndex: 1 }}>
                                            {({ TransitionProps, placement }) => (
                                                <Grow
                                                    {...TransitionProps}
                                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                                >
                                                    <Paper className='laptop_Categories_List_Paper' elevation={5}>
                                                        {/* <ClickAwayListener onClickAway={handleClose}> */}
                                                        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDownIcon}>
                                                            {categories.map((category, index) =>
                                                                <div key={category.name} >
                                                                    <MenuItem name={category.name} onClick={handleCategoriesClick}>{category.name}</MenuItem>
                                                                    {categories.length - 1 !== index && <div className='customCategoriesDivider' />}
                                                                </div>
                                                            )}
                                                        </MenuList>
                                                        {/* </ClickAwayListener> */}
                                                    </Paper>
                                                </Grow>
                                            )}
                                        </Popper>
                                    </>
                                }
                                {
                                            // fix
                                        }
                                {/* {baskets && baskets.length > 0 ?
                                    <StyledBadgeBasketDot color="error" badgeContent={baskets.length} max={9}>
                                        <Link to='/user/basket' className="basket_btnBox" >
                                            <ShoppingBasketRoundedIcon fontSize='large' className="basket_btn" />
                                        </Link>
                                    </StyledBadgeBasketDot>
                                    :
                                    <Link to='/user/basket' className="basket_btnBox" >
                                        <ShoppingBasketRoundedIcon fontSize='large' className="basket_btn" />
                                    </Link>
                                } */}
                            </>
                        }

                        {!auth.isLoaded ? <CircularProgress size={25} style={{ marginLeft: '20px' }} />
                            :
                            !matches_850 ?
                                <>
                                    <button className='menuMobile' onClick={toggleDrawer(anchor, true)}>
                                        <MenuRoundedIcon color='action' fontSize='inherit' />
                                    </button>

                                    <SwipeableDrawer
                                        anchor={anchor}
                                        open={toggleDrawerBool}
                                        onClose={toggleDrawer(anchor, false)}
                                        onOpen={toggleDrawer(anchor, true)}
                                        disableSwipeToOpen={true}
                                    >
                                        <div
                                            // className={clsx(classes.list, {
                                            //     [classes.fullList]: anchor === 'top' || anchor === 'bottom',
                                            // })}
                                            style={{ width: 250 }}
                                            role="presentation"
                                            onClick={toggleDrawer(anchor, false)}
                                            onKeyDown={toggleDrawer(anchor, false)}
                                        >
                                            <List>
                                                {categories.map((category, index) =>
                                                    <div key={category.name} >
                                                        <ListItem button name={category.name} onClick={handleCategoriesClick}>
                                                            <ListItemIcon>
                                                                <Avatar variant='square' src={require('../Images/' + category.img)} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={category.name} />
                                                        </ListItem>
                                                        {categories.length - 1 !== index && <div className='customCategoriesDivider' />}
                                                    </div>
                                                )}
                                            </List>
                                            {/* <Divider /> */}
                                        </div>
                                    </SwipeableDrawer>
                                </>
                                :
                                auth.isEmpty ?
                                    <Fragment>
                                        <button className="SignIn" onClick={props.handleOpenSignIn}>
                                            Daxil ol
                                        </button>


                                        <button className="SignUp" onClick={handleOpenSignUp}>
                                            Qeydiyyat
                                        </button>

                                    </Fragment>
                                    :
                                    <Fragment>
                                        <button
                                            className='profileBtn'
                                            ref={anchorRef}
                                            aria-controls={open ? 'menu-list-grow' : undefined}
                                            aria-haspopup="true"
                                            onClick={handleToggle}
                                        >
                                            {notifications && notifications.filter(each => !each.read).length > 0
                                                ?
                                                <StyledBadgeDot color="error" variant='dot' >
                                                    <MenuRoundedIcon color='action' fontSize='inherit' />
                                                </StyledBadgeDot>
                                                :
                                                <MenuRoundedIcon color='action' fontSize='inherit' />
                                            }

                                            <img className='profileBtn_img' src={profile.photoUrl} />

                                        </button>
                                        <Popper open={open} role={undefined} transition disablePortal
                                            style={{ position: 'absolute', top: '75px', left: 'none', right: '0', transform: 'none' }}>
                                            {({ TransitionProps, placement }) => (
                                                <Grow
                                                    {...TransitionProps}
                                                    style={{}}
                                                >
                                                    <Paper elevation={4} style={{ borderRadius: '10px', width: '230px' }}>
                                                        <ClickAwayListener onClickAway={handleClose}>
                                                            {!profile.isEmpty ?
                                                                <MenuList className='profileMenu' autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                                    <MenuItem onClick={() => { handleClose(); props.history.push('/user#profile') }}><AccountBoxRoundedIcon color='error' />Hesabım</MenuItem>
                                                                    {
                                            // fix
                                        }

                                                                    {/* <MenuItem className='profileMenu_balance' onClick={() => { handleClose(); props.history.push('/user/topUp') }}><span style={{display: 'flex', alignItems: 'center'}}><AccountBalanceWalletRoundedIcon color='error' /><span>Balansım</span></span><span>{priceFormat(profile.balance)} <span className='manat'>&#8380;</span></span></MenuItem> */}
                                                                    <Divider variant="fullWidth" className='divider' />
                                                                    <MenuItem onClick={() => { handleClose(); props.history.push('/user/notifications') }}>
                                                                        <NotificationsRoundedIcon color='error' />
                                                                        {notifications && notifications.filter(each => !each.read).length > 0
                                                                            ?
                                                                            <StyledBadgeStandart color='error' badgeContent={notifications.filter(each => !each.read).length} max={99}>
                                                                                Bildirişlər
                                                                        </StyledBadgeStandart>
                                                                            :
                                                                            'Bildirişlər'
                                                                        }

                                                                    </MenuItem>
                                                                    <MenuItem onClick={() => { handleClose(); props.history.push('/user/saved') }}><FavoriteRoundedIcon color='error' />Bəyəndiklərim</MenuItem>
                                                                    <Divider variant="fullWidth" className='divider' />
                                                                    <MenuItem onClick={handleLogOut}><ExitToAppRoundedIcon color='error' />Çıxış</MenuItem>
                                                                </MenuList>
                                                                :
                                                                <>
                                                                </>
                                                            }
                                                        </ClickAwayListener>
                                                    </Paper>

                                                </Grow>
                                            )}
                                        </Popper>
                                    </Fragment>
                        }
                        <Modal
                            open={openSignIn}
                            onClose={props.handleCloseSignIn}
                            // aria-labelledby='title'
                            // aria-describedby='description'
                            // closeAfterTransition
                            // BackdropComponent={Backdrop}
                            // BackdropProps={{
                            //     timeout: 500,
                            // }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <div style={{ margin: '0 10px' }}>
                                <SignIn history={props.history} handleOpenSignUp={handleOpenSignUp} />
                            </div>
                        </Modal>

                        <Modal
                            open={openSignUp}
                            onClose={handleCloseSignUp}
                            // aria-labelledby='title'
                            // aria-describedby='description'
                            // closeAfterTransition
                            // BackdropComponent={Backdrop}
                            // BackdropProps={{
                            //     timeout: 500,
                            // }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >

                            <div style={{ margin: '0 10px' }}>
                                <SignUp history={props.history} handleCloseSignUp={handleCloseSignUp} />
                            </div>

                        </Modal>

                    </div>

                </div>
            </div>
        </div>
    )
}



const mapStateToProps = (state) => {
    // console.log(state.firebase);
    // console.log(state.firestore)
    return {
        user: state.user,
        UI: state.UI,
        notifications: state.firestore.ordered.notifications,
        baskets: state.firestore.ordered.baskets,
        auth: state.firebase.auth,
        profile: state.firebase.profile,
        likedRents: state.firestore.ordered.likedRents,
    }
};

const mapActionsToProps = { logoutUser, handleOpenSignIn, handleCloseSignIn, getLikedRents, clearErrors };

Header.propTypes = {
    // classes: PropTypes.object.isRequired,
    // loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    handleOpenSignIn: PropTypes.func.isRequired,
    handleCloseSignIn: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
}


export default compose(
    withFirestore,
    connect(mapStateToProps, mapActionsToProps)
)(withRouter(Header));

// export default connect(mapStateToProps, mapActionsToProps)(withRouter(Header));
