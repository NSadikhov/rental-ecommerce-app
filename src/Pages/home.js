import React, { useEffect, useState, useContext, useRef } from 'react';
import '../Css/home.css';
// import axios from 'axios';
import Link from 'react-router-dom/Link';
import Rent from '../Components/Rent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton'
// import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
// Carousel
// import Carousel, { slidesToShowPlugin } from '@brainhubeu/react-carousel';
// import '@brainhubeu/react-carousel/lib/style.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppsRoundedIcon from '@material-ui/icons/AppsRounded';


import { categories, pageTitlesAndDescriptions } from '../dbSchema';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { useFirestoreConnect, firestoreConnect, isEmpty } from 'react-redux-firebase';

// import { compose } from 'redux';

import { getRents, showMoreRents } from '../Redux/actions/dataActions';

import { handleOpenSignIn } from '../Redux/actions/uiActions';


// import signInContext from '../Context/signIn-context';



// const options = {
//     safari_web_id?: string;
//     subdomainName?: string;
//     allowLocalhostAsSecureOrigin?: boolean;
//     requiresUserPrivacyConsent?: boolean;
//     persistNotification?: boolean;
//     autoResubscribe?: boolean;
//     autoRegister?: boolean;
//     notificationClickHandlerMatch?: string;
//     notificationClickHandlerAction?: string;
//     notifyButton?: {
//         enable?: boolean;
//         size?: 'medium';
//         position?: 'bottom-left' | 'bottom-right';
//         showCredit?: boolean;
//         prenotify?: boolean;
//         theme?: 'default' | 'inverse';
//         offset?: {
//             bottom?: string;
//             right?: string;
//             left?: string;
//         },
//         text?: {
//             [key: string]: string;
//         };
//         colors?: {
//             [key: string]: string;
//         };
//     }
// }


// OneSignal.initialize('e5f00068-9c9c-4066-9ec2-55d6970964f1', { allowLocalhostAsSecureOrigin: true, autoRegister: true, persistNotification: true });

// const playerID = OneSignal.getPlayerId();
// console.log(playerID)

import { firebase } from '../Firebase';
import { Helmet } from 'react-helmet';

// const messaging = firebase.messaging();

// messaging.requestPermission()
//     .then(() => {
//         return messaging.getToken();
//     })
//     .then(token => {
//         console.log('Token: ', token);

//     })
//     .catch(err => console.log(err));

// messaging.onMessage((payload) => {
//     console.log('onMessage: ', payload);
// })

const Home = (props) => {



    // Notification.requestPermission().then(function (permission) {
    //     // If the user accepts, let's create a notification
    //     if (permission === "denied") {
    //         var notification = new Notification("Hi there!");
    //     }
    // });

    const matches_1000 = useMediaQuery('(min-width:1000px)');
    // const matches_800 = useMediaQuery('(min-width:800px)');
    const matches_850 = useMediaQuery('(min-width:850px)');
    const matches_700 = useMediaQuery('(min-width:700px)');
    const matches_650 = useMediaQuery('(min-width:650px)');
    const matches_500 = useMediaQuery('(min-width:500px)');

    // const { user: { !isEmpty(auth) }, data: { loading }, rents: rents } = props;
    const { auth, data: { rents, loading, lastRentData } } = props;

    // const [rentsArr, setRentsArr] = useState(rents);
    const [isSwiping, setSwiping] = useState(false);
    const [isClickable, setClickable] = useState(false);

    const [search, setSearch] = useState('');

    const handleCategoriesClick = (event) => {
        if (isClickable) {
            props.history.push(`/categories?category=${event.target.id}`);
        }
    }

    const handleSearchClick = () => {
        props.history.push(`/categories?search=${search}`);
    }

    useEffect(() => {
        if (rents.length === 0) {
            props.getRents();
        }
    }, [])

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleOpen = () => {
        setOpen(true);
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

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const handleCategoriesClickIcon = (event) => {
        props.history.push(`/categories?category=${event.currentTarget.getAttribute('name')}`);
    }

    return (
        <div className='main'>

            <Helmet>
                <title>{pageTitlesAndDescriptions.home.title}</title>
                <meta name="description" content={pageTitlesAndDescriptions.home.description} />
            </Helmet>

            <div className="container">

                <div className="searchPart">
                    <div className="search_header">
                        <p>Kirayə Axtar</p>
                        <Link to='/demands'><span className='star'>*</span>Təcili Tələblər<span className='star'>*</span></Link>
                        {matches_700 &&
                            <div className="search_options">
                                {!auth.isEmpty
                                    ?
                                    <>
                                        <Link to='/rent-out'>
                                            <img src={require('../Images/plus_o.png')} alt="" height="22px" />
                                Kirayə ver
                                </Link>
                                        <Link to='/request'>
                                            Tələb et
                                <img src={require('../Images/need2.png')} alt="" height="22px" />
                                        </Link>
                                    </>
                                    :
                                    <>
                                        <Link to='' onClick={props.handleOpenSignIn}>
                                            <img src={require('../Images/plus_o.png')} alt="" height="22px" />
                                Kirayə ver
                                </Link>
                                        <Link to='' onClick={props.handleOpenSignIn}>
                                            Tələb et
                                <img src={require('../Images/need2.png')} alt="" height="22px" />
                                        </Link>
                                    </>
                                }
                            </div>
                        }
                    </div>
                    <div className='searchbar_Box'>
                        <form className="searchbar" onSubmit={handleSearchClick}>
                            <div className="searchbar_input1_Box">
                                <span>
                                    Nə lazımdır?
                                </span>
                                <input type="search" placeholder="Kirayələ" onChange={(event) => setSearch(event.target.value)} />
                            </div>
                            <div className='searchbar_BtnBox'>
                                <button type='submit'>
                                    <SearchRoundedIcon />
                                Axtar
                            </button>
                            </div>
                        </form>
                        {matches_850 &&
                            <>
                                <div
                                    className='laptop_Categories_List'
                                    ref={anchorRef}
                                    onMouseEnter={handleOpen}
                                    onMouseLeave={handleClose}
                                >
                                    <AppsRoundedIcon fontSize='large' color='error' />
                                </div>

                                <Popper onMouseEnter={handleOpen} onMouseLeave={handleClose} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 1 }}>
                                    {({ TransitionProps, placement }) => (
                                        <Grow
                                            {...TransitionProps}
                                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                        >
                                            <Paper className='laptop_Categories_List_Paper' elevation={5}>
                                                {/* <ClickAwayListener onClickAway={handleClose}> */}
                                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                    {categories.map((category, index) =>
                                                        <div key={category.name} >
                                                            <MenuItem name={category.name} onClick={handleCategoriesClickIcon}>{category.name}</MenuItem>
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
                    </div>
                </div>

            </div>

            <div className="wallpaper_home">
            </div>

            <div className="container">
                <div className="categories_home">
                    <p>Kateqoriyalar</p>


                    <div className="categories_home_sliderBox">
                        <Slider dots={true}
                            infinite={true}
                            speed={400}
                            slidesToShow={matches_1000 ? 5 : matches_850 ? 4 : matches_650 ? 3 : matches_500 ? 2 : 1}
                            slidesToScroll={1}
                            // centerMode={true} 
                            // centerPadding='200px'
                            swipeToSlide={true}
                            className='home_Slider'>
                            {categories.map(category =>
                                <Paper className='home_SliderInnerDiv' elevation={7} key={category.name} id={category.name}
                                    onMouseDown={() => {
                                        setSwiping(false);
                                    }}
                                    onMouseMove={() => {
                                        setSwiping(true);
                                    }}
                                    onMouseUp={() => {
                                        if (isSwiping) {
                                            setClickable(false);
                                        } else {
                                            setClickable(true);
                                        }

                                        setSwiping(false);
                                    }}
                                    onTouchStart={() => {
                                        setSwiping(false);
                                    }}
                                    onTouchMove={() => {
                                        setSwiping(true);
                                    }}
                                    onTouchEnd={() => {
                                        // e.preventDefault();
                                        if (isSwiping) {
                                            setClickable(false);
                                        } else {
                                            setClickable(true);
                                        }

                                        setSwiping(false);
                                    }}

                                    onClick={handleCategoriesClick}>

                                    <div>
                                        <img src={require(`../Images/${category.img}`)} alt={category.name} />
                                        <span>{category.name}</span>
                                    </div>

                                </Paper>
                            )}

                        </Slider>
                    </div>
                </div>
                {
                    // fix
                }
                {/* <div className='Company_Advert homeContent_Advert'>
                    <img src={require('../Images/ironfist.png')} />
                    <p><span>Mandarentdə</span> hər kirayə əməliyyatınızda ödədiyiniz servis haqqının 5%-i yeni yaranmış <span className='red-text bold'>"YAŞAT"</span> - Şəhid ailələrinə yardım fonduna köçürülür.</p>
                </div> */}
                {/* <div className='Company_Advert homeContent_Advert'>
                    <img src={require('../Images/badge.svg')} />
                    <div>
                        <p><span className='red-text bold'>5 Yanvara</span> qədər ilk kirayə elanını paylaş və <span className='red-text bold'>Elit</span> istifadəçi ol.</p>
                        {!auth.isEmpty ?
                            <Link to='/rent-out'>
                                <Button className='lightRedColor_btn capitalize' variant='contained' size='medium' color='secondary'>Kirayə Ver</Button>
                            </Link>
                            :
                            <Button onClick={props.handleOpenSignIn} className='lightRedColor_btn capitalize' variant='contained' size='medium' color='secondary'>Kirayə Ver</Button>
                        }
                    </div>
                </div> */}
            </div>

            <div className="wallpaper-adverts">
                <div className="container">
                    <div className="adverts-part">
                        <p>Elanlar</p>
                        <div className="adverts_inside">
                            {loading ?
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', color: '#3F51B6' }}>
                                    Loading <CircularProgress size='2rem' style={{ marginLeft: '7px' }} />
                                </div>
                                : (rents && rents.length > 0) ?
                                    <>
                                        {Array.from(rents).map(rent => <Rent key={rent.id} rent={rent} history={props.history} />)}

                                        {rents.length === 1 ?
                                            <>
                                                <div></div>
                                                <div></div>
                                            </>
                                            : rents.length === 2 ?
                                                <div></div>
                                                : null
                                        }
                                    </>
                                    : null
                            }

                        </div>
                        {rents && Array.from(rents).length % 12 === 0 && lastRentData && <span className='showMore' onClick={() => props.showMoreRents(rents[rents.length - 1])}>( daha çox göstər )</span>}

                    </div>
                    {/* <div className="cofounders-part">
                        <p>Trend Mandarentçilər</p>
                        <div className="cofounders_inside">

                        </div>
                    </div> */}
                </div>
            </div>

        </div>
    )
}

Home.propTypes = {
    user: PropTypes.object.isRequired,
    getRents: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapActionsToProps = { getRents, handleOpenSignIn, showMoreRents };

const mapStateToProps = (state) => {
    return {
        user: state.user,
        data: state.data,
        auth: state.firebase.auth,
    }

    {/* rents: state.firestore.ordered.rents, */ }
}

export default connect(mapStateToProps, mapActionsToProps)(Home);


{/* export default compose(
    firestoreConnect((props) => props.rents ? [] : [{ collection: 'rents', orderBy: [['createdAt', 'desc']] }]),
    connect(mapStateToProps, mapActionsToProps)
)(Home); */}