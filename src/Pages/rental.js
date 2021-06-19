import React, { useState, useEffect, Fragment, forwardRef } from 'react';
import '../Css/rental.css';
// import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';

import "react-image-gallery/styles/css/image-gallery.css";
import makeStyles from '@material-ui/core/styles/makeStyles';
import Rating from '@material-ui/lab/Rating';

// import { LocalizationProvider } from '@material-ui/pickers';
// import { DateRangePicker, DateRangeDelimiter, DateRange } from "@material-ui/pickers";
// import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
// import DateFnsUtils from '@date-io/date-fns';
// import addWeeks from "date-fns/addWeeks";

// import { Day } from '@material-ui/pickers'

// import azLocale from "date-fns/locale/az";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import StarsIcon from '@material-ui/icons/Stars';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';

import red from '@material-ui/core/colors/red';

import ShareIcon from '@material-ui/icons/Share';

import Dialog from '@material-ui/core/Dialog';
// import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import Slide from '@material-ui/core/Slide';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';

import Grid from '@material-ui/core/Grid';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';

// import AliceCarousel from 'react-alice-carousel'
// import 'react-alice-carousel/lib/alice-carousel.css'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRent, removeRent, addToBasket, offerOnRent } from '../Redux/actions/dataActions';
import { handleOpenSignIn } from '../Redux/actions/uiActions';

import dayjs from '../util/customDayJs';

// import GoogleMapReact from 'google-map-react'
// import LocationPin from '../Components/LocationPin';

// import { location } from '../dbSchema';
import { backgroundImage, calculateRating, isEmptyObject, priceFormat } from '../util'

import 'react-dates/initialize';
// import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
// import { START_DATE, END_DATE } from 'react-dates/constants';
import 'react-dates/lib/css/_datepicker.css';
import DateRangePickerWrapper from '../Components/DateTimePickerWrapper';
import CustomMap from '../Components/CustomMap';
import LikeButton from '../Components/LikeButton';
import SendMessage from '../Components/SendMessage';
import ProfileRent from '../Components/ProfileRent';
import AllComments from '../Components/AllComments';

import badge from '../Images/badge.svg';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function OfferDiscountCalculation(dayCount, daily, weekly_discount, monthly_discount) {
    let discount;

    if (dayCount === 0 || dayCount === 1) {
        discount = 0;
    }
    else if (dayCount <= 7 && dayCount >= 1) {

        discount = (weekly_discount / 6) * (dayCount - 1);
    }
    else if (dayCount <= 30 && dayCount > 7) {

        discount = ((monthly_discount - weekly_discount) / 23) * (dayCount - 7) + weekly_discount;
    }
    else if (dayCount > 30) {
        discount = monthly_discount
    }

    return discount;
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

const useStyles = makeStyles((theme) => ({
    root: {
        // maxWidth: 300,
        cursor: 'pointer',
        borderRadius: '8px',
        letterSpacing: '0.5px',
        textDecoration: 'none'
    },
    media: {
        height: 200,
        // paddingTop: '56.25%', // 16:9
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    name: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingRight: '3px'
    },
    avatar: {
        backgroundColor: red[500],
    },
    rentSubInfo: {
        padding: '5px 0 0 0 !important'
    },
    cardContent: {
        padding: '10px 16px 5px 16px !important'
    },
    cardActions: {
        padding: '3px 8px',
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


const Rental = (props) => {
    // const matches_1050 = useMediaQuery('(min-width:1050px)');

    const classes = useStyles();
    // Date
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Time
    const [Time, setTime] = useState({
        startTime: null,
        endTime: null
    });

    const [blockedDays, setBlockedDays] = useState([]);

    const [active, setActive] = useState(false);

    const [images, setImages] = useState([]);

    // const [offeredRentInfo, setOfferedRentInfo] = usePersistedStateLocal(OFFERED_RENT_INFO, {});
    // const [offeredRentInfo, setOfferedRentInfo] = useState({});

    const [offerCalcObj, setOfferCalcObj] = useState({
        timeCount: 0,
        dayCount: 0,
        price: 0,
        discount: 0,
        priceWithDiscount: 0,
        commission: 0,
        total: 0
    });

    // const handleStartDateChange = (date) => {
    //     setStartDate(date);
    // };

    // const handleEndDateChange = (date) => {
    //     setEndDate(date);
    // };


    const rentId = props.match.params.product;
    // const path = window.location.pathname.split('/rentals/')[1];

    const { auth, profile, data: { rent, loading } } = props;

    useEffect(() => {

        props.getRent(rentId);
        return () => {
            props.removeRent();
            setImages([]);
            setBlockedDays([]);
        }
    }, [props.match.params.product])

    // const isFirstRun = useRef(true);
    useEffect(() => {
        // if (isFirstRun.current) {
        //     isFirstRun.current = false;
        //     return;
        // }

        if (startDate !== null && endDate !== null) {
            let dayCount = dayjs(endDate).diff(dayjs(startDate), 'd');
            if (Time.startTime !== null && Time.endTime !== null) {
                let timeCount = dayCount * 24 - Number(Time.startTime.split(':')[0]) + Number(Time.endTime.split(':')[0]);

                // dayCount = (timeCount % 24 < 24 ? 0 : (dayCount + 1));
                let price;

                if (dayCount !== 0) {
                    if (timeCount > (dayCount * 24)) {
                        dayCount++;
                    }

                    price = (rent.daily * dayCount);
                }
                else {
                    price = (timeCount * rent.timePrice < rent.daily) ? (rent.timePrice * timeCount) : (rent.daily);
                }
                // else {
                //     dayCount += 1;
                //     price = (rent.daily * dayCount);
                // }

                const discount = Math.round((OfferDiscountCalculation(dayCount, rent.daily, rent.weekly_discount, rent.monthly_discount) + Number.EPSILON) * 1000) / 1000;
                const priceWithDiscount = Math.round(((price * discount / 100) + Number.EPSILON) * 10) / 10;
                // const commission = (calculateCommission(price - priceWithDiscount));
                const commission = 0;
                const total = (price - priceWithDiscount + commission);


                setOfferCalcObj({ timeCount, dayCount, price, discount, priceWithDiscount, commission, total });

                if (dayCount < rent.minDay) {
                    setError(true);
                }
                else {
                    error !== false && setError(false);
                    setActive(true);
                }
            }
            else {
                setOfferCalcObj({ ...offerCalcObj, dayCount });
            }
        }
    }, [startDate, endDate, Time.startTime, Time.endTime])

    useEffect(() => {
        if (!loading && images.length == 0 && !isEmptyObject(rent)) {
            rent.imageUrls.forEach(image => {
                setImages(oldVersion => [...oldVersion, { original: image, thumbnail: image }])
            })

            rent.offers.forEach(offer => {
                setBlockedDays(oldVersion => [...oldVersion, { start_date: dayjs(offer.start_date).toDate(), end_date: dayjs(offer.end_date).toDate() }]);
            })
            window.scrollTo(0, 0)
        }
    }, [props.data.loading, props.data.rent])

    const isDayBlocked = (day) => {
        // console.log(dayjs(day._d).format('DD/MM/YYYY'));
        // console.log(blockedDays.includes(day));
        let isBlocked = false;
        blockedDays.map(blocked => {
            if (dayjs(day._d).isBetween(blocked.start_date, blocked.end_date, 'date', '[]')) {
                isBlocked = true;
                return;
            }
            // return blockedDays.includes(dayjs(day._d).format('DD/MM/YYYY'));
        })

        if (isBlocked) {
            return true;
        }
    }

    const isOutsideRange = (day) => {
        // return !isInclusivelyAfterDay(day, moment());
        // return !isAfter(day._d, new Date().getTime())
        return !dayjs().isSameOrBefore(dayjs(day._d), 'd');
    }

    const timeSlots = Array.from(new Array(17)).map(
        // (_, index) => `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'}`,
        (_, index) => `${(index + 7) < 10 ? '0' : ''}${index + 7}:00`
    );

    const [error, setError] = useState(false);
    // const [isSubmited, setIsSubmited] = useState(false);

    // useEffect(() => {
    //     if (isSubmited && !isEmptyObject(offeredRentInfo)) {
    //         props.history.push('/user/basket');
    //     }
    // }, [isSubmited])

    const commentsSize = 3;

    const [openComments, setOpenComments] = useState(false);

    const handleOpenComments = () => {
        setOpenComments(true);
    };

    const handleCloseComments = () => {
        setOpenComments(false);
    };

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openStartTime, setOpenStartTime] = useState(false);
    const [openEndTime, setOpenEndTime] = useState(false);
    const [openDialogStartTime, setOpenDialogStartTime] = useState(false);
    const [openDialogEndTime, setOpenDialogEndTime] = useState(false);

    const [openVerifyDialog, setOpenVerifyDialog] = useState(false);

    const handleClickOpenVerifyDialog = (belonging) => {
        setOpenVerifyDialog(true);
    };

    const handleCloseVerifyDialog = () => {
        setOpenVerifyDialog(false);
    };

    return (
        <div className='main'>

            <div className='container'>

                <div className='rentalContentBox'>
                    {(!loading && !isEmptyObject(rent))
                        &&
                        (<Fragment>
                            <h1 className='rentalHeadertxt'>{rent.name}</h1>
                            <div className='rentalContentBox_Grid'>
                                <div className='rentalContainer'>
                                    <div className='rentalHeader'>
                                        <div className='rentalGalleryBox'>
                                            <ImageGallery
                                                items={images}
                                                showPlayButton={false}
                                                showBullets={true}
                                                thumbnailPosition='left'
                                                onImageLoad={(event) => {
                                                    const elem = event.currentTarget;
                                                    if (elem.naturalHeight === elem.naturalWidth) {
                                                        elem.style.objectFit = 'contain';
                                                    }
                                                    else {
                                                        elem.style.objectFit = 'cover';
                                                    }
                                                }}
                                            />
                                            <div className='rentalGalleryBox_footer'>
                                                <div className='rentalGalleryBox_ftrPrice'>

                                                    {rent.timePrice !== 0 &&
                                                        <div>
                                                            <h4>{priceFormat(rent.timePrice)} <span className='manat'>&#8380;</span></h4>
                                                            <span>saatlıq</span>
                                                        </div>
                                                    }
                                                    <div>
                                                        <h4>{priceFormat(rent.daily)} <span className='manat'>&#8380;</span></h4>
                                                        <span>günlük</span>
                                                    </div>
                                                    <div>
                                                        <h4>{(rent.weekly_discount !== 0) ? priceFormat(rent.daily * 7 - (rent.daily * 7 * rent.weekly_discount / 100)) : priceFormat((rent.daily * 7))} <span className='manat'>&#8380;</span></h4>
                                                        <span>həftəlik</span>
                                                    </div>
                                                    <div>
                                                        <h4>{(rent.monthly_discount !== 0) ? priceFormat(rent.daily * 30 - (rent.daily * 30 * rent.monthly_discount / 100)) : priceFormat((rent.daily * 30))} <span className='manat'>&#8380;</span></h4>
                                                        <span>aylıq</span>
                                                    </div>

                                                </div>
                                                <Grid container spacing={2} justify='center'>
                                                    {/* {rent.userId !== auth.uid && */}
                                                    <Grid item>
                                                        <LikeButton type='button' rent={rent} />
                                                    </Grid>
                                                    {/* } */}
                                                    <Grid item>
                                                        <Button variant='outlined' color='primary' size='large' className='rental_blue' startIcon={<ShareIcon className='rental_blue' />} >
                                                            Paylaş
                                                    </Button>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </div>

                                    </div>

                                    <Button onClick={handleClickOpen} className='rentalBtn_responsive' variant='contained' size='large' color='secondary'>Təklif Göndər</Button>

                                    <div className='rentalInfo'>
                                        <div className='rentalLocation'>
                                            <h2>Ərazi</h2>

                                            <div style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.95rem', marginTop: 5 }}>
                                                <span>{rent.city}</span>
                                                {rent.district &&
                                                    <>
                                                        <div style={{ height: '23px', width: 2, background: '#FF6600', margin: '0 10px' }} />
                                                        <span>{rent.district}</span>
                                                        {rent.province &&
                                                            <>
                                                                <div style={{ height: '23px', width: 2, background: '#FF6600', margin: '0 10px' }} />
                                                                <span>{rent.province}</span>
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </div>
                                            <div className='rentalMap'>
                                                <CustomMap rent={rent} />
                                            </div>
                                        </div>
                                        <div className='rentalDescription'>
                                            <h2>Məlumat</h2>
                                            <p>
                                                {rent.description}
                                            </p>
                                        </div>
                                        {rent.howToUse &&
                                            <div className='rentalDescription'>
                                                <h2>İşlənmə qaydası</h2>
                                                <p>
                                                    {rent.howToUse}
                                                </p>
                                            </div>
                                        }
                                    </div>
                                    <div className='rentalUserInfo'>
                                        <div className='rentalUser'>
                                            <h2>Kirayə verən</h2>
                                            <div>
                                                <span>
                                                    <div className='rentalAvatar' >
                                                        <img src={rent.userPhoto} onClick={() => props.history.push('/profile/' + rent.userId)} />
                                                        {rent.elit &&
                                                            <img className='badge_logo_mini' src={badge} alt='elit logo' />
                                                        }
                                                    </div>
                                                    <span>
                                                        <span className='rentalUserName'>
                                                            {rent.userFullname}
                                                        </span>
                                                        {rent.userRating.length > 0 &&
                                                            <Rating value={calculateRating(rent.userRating)} precision={0.1} readOnly className='rentalUserRating' />
                                                        }
                                                    </span>
                                                </span>
                                                {rent.userId !== auth.uid &&
                                                    <SendMessage
                                                        // type='button'
                                                        rentInfo={rent}
                                                        className='rentalMessagebtn'
                                                        isDayBlocked={isDayBlocked}
                                                        isOutsideRange={isOutsideRange}
                                                        minTime={rent.minTime}
                                                        minDay={rent.minDay}
                                                    />
                                                }
                                            </div>
                                        </div>

                                    </div>
                                    <div className='rentalEvaluation'>
                                        <h2>Dəyərləndirmələr</h2>

                                        {rent.comments && rent.comments.length !== 0 &&
                                            (Array.from(rent.comments.slice(0, commentsSize).map(comment =>
                                            (<div className='rentalComment' key={comment.commentId} >
                                                <div>
                                                    <span>
                                                        <Avatar className='rentalAvatar' src={comment.userPhoto} />
                                                        <span>
                                                            <span className='rentalUserName'>
                                                                {comment.userFullname.split(' ')[0]}
                                                            </span>
                                                            <span className='rentalCommentDate'>{dayjs(comment.createdAt).format('DD MMMM YYYY')}</span>
                                                        </span>
                                                    </span>
                                                    <Rating value={comment.rating} precision={0.5} readOnly />
                                                </div>
                                                <p>
                                                    {comment.body}
                                                </p>
                                            </div>)
                                            )))
                                        }
                                        {rent.comments.length > commentsSize &&
                                            <>
                                                <span onClick={handleOpenComments} className='rentalComment_showMore'>Digər {rent.comments.length - 3} rəyi görüntülə</span>

                                                <AllComments
                                                    comments={rent.comments}
                                                    handleCloseComments={handleCloseComments}
                                                    handleOpenComments={handleOpenComments}
                                                    openComments={openComments}
                                                />
                                            </>
                                        }
                                    </div>


                                </div>

                                <div className='rentalPriceBox'>

                                    <Card elevation={4} className='rentalPriceFxdBox'>

                                        {!active ?
                                            <Fragment>
                                                <CardHeader
                                                    className='rentalPriceBox_header'
                                                    title={<h3 className='rentalPriceBox_hdrTitle'>{priceFormat(rent.daily)} <span className='manat'>&#8380;</span>  / günlük</h3>}
                                                    subheader={<>
                                                        <div className='rentalPriceBox_hdrSubtitle'>
                                                            <span>
                                                                {rent.userFullname}
                                                                {rent.userRating.length > 0 &&
                                                                    <>
                                                                        <StarsIcon fontSize='small' className={classes.star} />{calculateRating(rent.userRating)}
                                                                    </>
                                                                }
                                                            </span>
                                                            <span>
                                                                {rent.commentCount} rəy
                                                            </span>
                                                        </div>

                                                    </>
                                                    }
                                                />
                                                <CardContent className='rentalPriceBox_content'>
                                                    <span className='rentalPriceBox_content_mimimum'>
                                                        {rent.minTime > 0 ?
                                                            `Minimum kirayə müddəti ${rent.minTime} saatdır.`
                                                            :
                                                            `Minimum kirayə müddəti ${rent.minDay} gündür.`
                                                        }
                                                    </span>
                                                    <span className='rentalDateLabel'>
                                                        Əşya hansı tarix aralığında lazımdır?
                                </span>

                                                    <div className='rentalDatesBox'>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12}>
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
                                                                    isDayBlocked={isDayBlocked}
                                                                    isOutsideRange={isOutsideRange}
                                                                    // anchorDirection='right'
                                                                    readOnly
                                                                    customArrowIcon={
                                                                        <div className='vertLine_DateTimePicker' />
                                                                    }
                                                                />
                                                            </Grid>
                                                            {/* <Grid item xs={12}>
                                                               
                                                            </Grid> */}
                                                            <Grid item xs={12}>
                                                                <span className='rentalTimeLabel'>
                                                                    Saat
                                                            </span>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={6}>
                                                                        <FormControl fullWidth variant="outlined" size='small'>
                                                                            <InputLabel id="start_time_label" >Başlanğıc</InputLabel>
                                                                            <Select
                                                                                disabled={startDate === null || endDate === null}
                                                                                name='start_time'
                                                                                labelId="start_time_label"
                                                                                id="start_time"
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
                                                                            <InputLabel id="end_time_label" >Bitiş</InputLabel>
                                                                            <Select
                                                                                disabled={Time.startTime === null}
                                                                                name='end_time'
                                                                                labelId="end_time_label"
                                                                                id="end_time"
                                                                                open={openEndTime}
                                                                                onClose={() => setOpenEndTime(false)}
                                                                                onOpen={() => setOpenEndTime(true)}
                                                                                onChange={(event) => setTime({ ...Time, endTime: event.target.value })}
                                                                                label="Bitiş"
                                                                                MenuProps={{ style: { maxHeight: 300 } }}

                                                                            >
                                                                                {timeSlots.map(each => {
                                                                                    return <MenuItem
                                                                                        disabled={(offerCalcObj.dayCount === 0 && Time.startTime) ? Number(each.split(':')[0]) - Number(Time.startTime.split(':')[0]) >= rent.minTime ? false : true : false}
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
                                                                            <div className='helperText'>Minimum {rent.minDay} gün seçilmiş olmalıdır.</div>
                                                                        </Grid>
                                                                    }
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </div>

                                                    <div className='rentalPriceBox_footer'>
                                                        <img src={require('../Images/calendar.png')} alt='calendar' />
                                                        <div>
                                                            <h3>
                                                                Tarix seçin
                                        </h3>
                                                            <span>
                                                                Əşyanın siz istədiyiniz tarixdə boşda olduğunu yoxlayın
                                        </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Fragment>
                                            :
                                            <CardContent>
                                                <h3 className='rentalPriceBox_hdrTitle'>Kirayə detalları</h3>
                                                <div className='rentalSelectedDates'>
                                                    <span>
                                                        <span>
                                                            Tarix
                                                    </span>
                                                        <span>
                                                            {dayjs(startDate).format('D MMMM')} -  {dayjs(endDate).format('D MMMM')}
                                                        </span>
                                                    </span>
                                                    <span>
                                                        <span>
                                                            Saat
                                                    </span>
                                                        <span>
                                                            {Time.startTime} - {Time.endTime}
                                                        </span>
                                                    </span>
                                                    <button className='rentalChangeDates' onClick={() => {
                                                        setTime({ startTime: null, endTime: null });
                                                        setError(false);
                                                        setActive(false);
                                                    }}>
                                                        Dəyişdir
                                        </button>
                                                </div>

                                                <div className='rentalPriceExplanation'>
                                                    <span><span>{offerCalcObj.dayCount !== 0 ? offerCalcObj.dayCount + ' günlük' : + offerCalcObj.timeCount + ' saatlıq'} qiymət</span><span>{priceFormat(offerCalcObj.price)} <span className='manat'>&#8380;</span></span></span>
                                                    {offerCalcObj.dayCount > 0 && offerCalcObj.priceWithDiscount > 0 &&
                                                        <span>
                                                            <span>{priceFormat(offerCalcObj.discount)}% {offerCalcObj.dayCount === 7 ? 'Həftəlik endirim:' : offerCalcObj.dayCount === 30 ? 'Aylıq endirim:' : 'Çoxgün endirimi:'}</span>
                                                            <span className='rentalPriceExplanation_discount'>-{priceFormat(offerCalcObj.priceWithDiscount)} <span className='manat'>&#8380;</span></span>
                                                        </span>
                                                    }
                                                    {/* <span><span>Servis haqqı:</span><span>{priceFormat(offerCalcObj.commission)} <span className='manat'>&#8380;</span></span></span> */}
                                                    <div className='rentalPriceLine'></div>
                                                    <span className='rentalPriceExplanation_Total'><span>Total:</span><span>{priceFormat(offerCalcObj.total)} <span className='manat'>&#8380;</span></span></span>
                                                    <div className='rentalPriceLine'></div>
                                                    {/* <span><span style={{ maxWidth: '75%' }}>İndi balansınızdan çıxılacaq məbləğ (Servis haqqı):</span><span>{priceFormat(offerCalcObj.commission)} <span className='manat'>&#8380;</span></span></span> */}
                                                </div>
                                                <div className='rentalOffer'>
                                                    {!auth.isEmpty ?
                                                        (rent.userId !== auth.uid) ?
                                                            <Button fullWidth variant='contained' color='secondary' size='large' className='lightRedColor_btn'
                                                                onClick={() => {
                                                                    if (Boolean(profile.verified)) {
                                                                        const rentDetails = {
                                                                            rent: { start_date: startDate._d.toISOString(), end_date: endDate._d.toISOString(), startTime: Time.startTime, endTime: Time.endTime, price: offerCalcObj.total, rentOwnerPhoto: rent.userPhoto, rentOwnerFullname: rent.userFullname, rentId: rent.id, productName: rent.name, rentOwner: rent.userId, rentOwnerRating: rent.userRating, imageUrls: rent.imageUrls, city: rent.city, district: rent.district, province: rent.province }, offerCalcObj: { ...offerCalcObj }
                                                                        };
                                                                        props.addToBasket(rentDetails, props.history);

                                                                        props.offerOnRent(rentDetails.rent.rentId, { ...rentDetails.rent, calculation: rentDetails.offerCalcObj, commented: false }, 0, props.history);
                                                                    }
                                                                    else {
                                                                        handleClickOpenVerifyDialog();
                                                                    }

                                                                }}>
                                                                Təklif göndər
                                                            </Button>
                                                            :
                                                            <Button fullWidth variant='contained' color='secondary' size='large' disabled>
                                                                Təklif göndər
                                                        </Button>
                                                        :
                                                        <Button fullWidth variant='contained' color='secondary' size='large' className='lightRedColor_btn'
                                                            onClick={props.handleOpenSignIn}>
                                                            Təklif göndər
                                                            </Button>
                                                    }

                                                </div>

                                                <div className='rentalPriceExplanationBottom'>
                                                    <span><span style={{ maxWidth: '75%' }}>Əşyanı götürərkən, əşyanın sahibinə nağd ödəyəcəyiniz məbləğ (Kirayə haqqı):</span><span>{priceFormat(offerCalcObj.price - offerCalcObj.priceWithDiscount)} <span className='manat'>&#8380;</span></span></span>
                                                </div>

                                            </CardContent>
                                        }

                                    </Card>

                                </div>
                            </div>

                            <div className='rentalUserBelongings'>
                                <h2>{rent.userFullname} - Digər əşyaları</h2>
                                <div className='rentalUserBelongings_content'>
                                    {rent.otherRents.map(otherRent =>
                                        <ProfileRent key={otherRent.id} rent={otherRent} />
                                    )}

                                    {rent.otherRents.length === 1 ?
                                        <>
                                            <div></div>
                                            <div></div>
                                        </>
                                        : rent.otherRents.length === 2 ?
                                            <div></div>
                                            : null
                                    }
                                </div>
                            </div>

                            <Dialog
                                open={open}
                                TransitionComponent={Transition}
                                keepMounted
                                onClose={handleClose}
                                aria-labelledby={!active ? 'rental_bookDialog_first' : 'rental_bookDialog_second'}
                                aria-describedby="alert-dialog-slide-description"
                            >

                                <Card elevation={4} style={{ borderRadius: 10 }} className='rentalPriceFxdBox'>
                                    <HighlightOffRoundedIcon fontSize='large' color='action' className='rentalPriceFxdBox_closeBtn' onClick={handleClose} />
                                    {!active ?
                                        <Fragment>
                                            <CardHeader
                                                className='rentalPriceBox_header'
                                                title={<h3 className='rentalPriceBox_hdrTitle'>{priceFormat(rent.daily)} <span className='manat'>&#8380;</span>  / günlük</h3>}
                                                subheader={
                                                    <>
                                                        <div className='rentalPriceBox_hdrSubtitle'>
                                                            <span>
                                                                {rent.userFullname}
                                                                <StarsIcon fontSize='small' className={classes.star} />{rent.userRating}
                                                            </span>
                                                            <span>
                                                                {rent.commentCount} rəy
                                                        </span>

                                                        </div>

                                                    </>
                                                }
                                            />
                                            <CardContent className='rentalPriceBox_content'>

                                                <span className='rentalPriceBox_content_mimimum'>
                                                    {rent.minTime > 0 ?
                                                        `Minimum kirayə müddəti ${rent.minTime} saatdır.`
                                                        :
                                                        `Minimum kirayə müddəti ${rent.minDay} gündür.`
                                                    }
                                                </span>
                                                <span className='rentalDateLabel'>
                                                    Əşya hansı tarix aralığında lazımdır?
</span>

                                                <div className='rentalDatesBox'>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={12}>
                                                            <span className='rentalTimeLabel'>
                                                                Gün
                                                            </span>
                                                            <DateRangePickerWrapper
                                                                startDatePlaceholderText='Başlanğıc'
                                                                endDatePlaceholderText='Bitiş'
                                                                startDateId='startDateDialog'
                                                                endDateId='endDateDialog'
                                                                block
                                                                // inputIconPosition="after"
                                                                displayFormat='DD/MM/YYYY'
                                                                hideKeyboardShortcutsPanel
                                                                numberOfMonths={1}
                                                                minimumNights={0}
                                                                // appendToBody  
                                                                initialStartDate={startDate}
                                                                initialEndDate={endDate}
                                                                setStartDate={setStartDate}
                                                                setEndDate={setEndDate}
                                                                isDayBlocked={isDayBlocked}
                                                                isOutsideRange={isOutsideRange}
                                                                // withPortal={true}
                                                                readOnly
                                                                customArrowIcon={
                                                                    <div className='vertLine_DateTimePicker' />
                                                                }
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12}>
                                                            <span className='rentalTimeLabel'>
                                                                Saat
                                                            </span>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={6}>
                                                                    <FormControl fullWidth variant="outlined" size='small'>
                                                                        <InputLabel id="dialog_start_time_label" >Başlanğıc</InputLabel>
                                                                        <Select
                                                                            disabled={startDate === null || endDate === null}
                                                                            name='dialog_start_time'
                                                                            labelId="dialog_start_time_label"
                                                                            id="dialog_start_time"
                                                                            open={openDialogStartTime}
                                                                            onClose={() => setOpenDialogStartTime(false)}
                                                                            onOpen={() => setOpenDialogStartTime(true)}
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
                                                                        <InputLabel id="dialog_end_time_label" >Bitiş</InputLabel>
                                                                        <Select
                                                                            disabled={Time.startTime === null}
                                                                            name='dialog_end_time'
                                                                            labelId="dialog_end_time_label"
                                                                            id="dialog_end_time"
                                                                            open={openDialogEndTime}
                                                                            onClose={() => setOpenDialogEndTime(false)}
                                                                            onOpen={() => setOpenDialogEndTime(true)}
                                                                            onChange={(event) => setTime({ ...Time, endTime: event.target.value })}
                                                                            label="Bitiş"
                                                                            MenuProps={{ style: { maxHeight: 300 } }}

                                                                        >
                                                                            {timeSlots.map(each => {
                                                                                return <MenuItem
                                                                                    disabled={(offerCalcObj.dayCount === 0 && Time.startTime) ? Number(each.split(':')[0]) - Number(Time.startTime.split(':')[0]) >= rent.minTime ? false : true : false}
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
                                                                        <div className='helperText'>Minimum {rent.minDay} gün seçilmiş olmalıdır.</div>
                                                                    </Grid>
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </div>

                                                <div className='rentalPriceBox_footer'>
                                                    <img src={require('../Images/calendar.png')} alt='calendar' />
                                                    <div>
                                                        <h3>
                                                            Tarix seçin
</h3>
                                                        <span>
                                                            Əşyanın siz istədiyiniz tarixdə boşda olduğunu yoxlayın
</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Fragment>
                                        :
                                        <CardContent>
                                            <h3 className='rentalPriceBox_hdrTitle'>Kirayə detalları</h3>
                                            <div className='rentalSelectedDates'>
                                                <span>
                                                    <span>
                                                        Tarix
            </span>
                                                    <span>
                                                        {dayjs(startDate).format('D MMMM')} -  {dayjs(endDate).format('D MMMM')}
                                                    </span>
                                                </span>
                                                <span>
                                                    <span>
                                                        Saat
            </span>
                                                    <span>
                                                        {Time.startTime} - {Time.endTime}
                                                    </span>
                                                </span>
                                                <button className='rentalChangeDates' onClick={() => {
                                                    setTime({ startTime: null, endTime: null });
                                                    setError(false);
                                                    setActive(false);
                                                }}>
                                                    Dəyişdir
</button>
                                            </div>

                                            <div className='rentalPriceExplanation'>
                                                <span><span>{offerCalcObj.dayCount !== 0 ? offerCalcObj.dayCount + ' günlük' : + offerCalcObj.timeCount + ' saatlıq'} qiymət</span><span>{priceFormat(offerCalcObj.price)} <span className='manat'>&#8380;</span></span></span>
                                                {offerCalcObj.dayCount > 0 && offerCalcObj.priceWithDiscount > 0 &&
                                                    <span>
                                                        <span>{priceFormat(offerCalcObj.discount)}% {offerCalcObj.dayCount === 7 ? 'Həftəlik endirim:' : offerCalcObj.dayCount === 30 ? 'Aylıq endirim:' : 'Çoxgün endirimi:'}</span>
                                                        <span className='rentalPriceExplanation_discount'>-{priceFormat(offerCalcObj.priceWithDiscount)} <span className='manat'>&#8380;</span></span>
                                                    </span>
                                                }
                                                {/* <span><span>Servis haqqı:</span><span>{priceFormat(offerCalcObj.commission)} <span className='manat'>&#8380;</span></span></span> */}
                                                <div className='rentalPriceLine'></div>
                                                <span className='rentalPriceExplanation_Total'><span>Total:</span><span>{priceFormat(offerCalcObj.total)} <span className='manat'>&#8380;</span></span></span>
                                                <div className='rentalPriceLine'></div>
                                                {/* <span><span style={{ maxWidth: '75%' }}>İndi balansınızdan çıxılacaq məbləğ (Servis haqqı):</span><span>{priceFormat(offerCalcObj.commission)} <span className='manat'>&#8380;</span></span></span> */}
                                            </div>
                                            <div className='rentalOffer'>
                                                {!auth.isEmpty ?
                                                    (rent.userId !== auth.uid) ?
                                                        <Button fullWidth variant='contained' color='secondary' size='large' className='lightRedColor_btn'
                                                            onClick={() => {
                                                                if (Boolean(profile.verified)) {
                                                                    const rentDetails = {
                                                                        rent: { start_date: startDate._d.toISOString(), end_date: endDate._d.toISOString(), startTime: Time.startTime, endTime: Time.endTime, price: offerCalcObj.total, rentOwnerPhoto: rent.userPhoto, rentOwnerFullname: rent.userFullname, rentId: rent.id, productName: rent.name, rentOwner: rent.userId, rentOwnerRating: rent.userRating, imageUrls: rent.imageUrls, city: rent.city, district: rent.district, province: rent.province }, offerCalcObj: { ...offerCalcObj }
                                                                    };
                                                                    props.addToBasket(rentDetails, props.history);

                                                                    props.offerOnRent(rentDetails.rent.rentId, { ...rentDetails.rent, calculation: rentDetails.offerCalcObj, commented: false }, 0, props.history);
                                                                }
                                                                else {
                                                                    handleClickOpenVerifyDialog();
                                                                }
                                                            }}>
                                                            Təklif göndər
                                                            </Button>
                                                        :
                                                        <Button fullWidth variant='contained' color='secondary' size='large' disabled>
                                                            Təklif göndər
                                                        </Button>
                                                    :
                                                    <Button fullWidth variant='contained' color='secondary' size='large' className='lightRedColor_btn'
                                                        onClick={props.handleOpenSignIn}>
                                                        Təklif göndər
                                                            </Button>
                                                }

                                            </div>

                                            <div className='rentalPriceExplanationBottom'>
                                                <span><span style={{ maxWidth: '75%' }}>Əşyanı götürərkən, əşyanın sahibinə nağd ödəyəcəyiniz məbləğ (Kirayə haqqı):</span><span>{priceFormat(offerCalcObj.price - offerCalcObj.priceWithDiscount)} <span className='manat'>&#8380;</span></span></span>
                                            </div>

                                        </CardContent>
                                    }

                                </Card>


                            </Dialog>

                            <Dialog
                                open={openVerifyDialog}
                                TransitionComponent={Transition}
                                keepMounted
                                onClose={handleCloseVerifyDialog}
                                aria-labelledby="form-dialog"
                                aria-describedby="alert-dialog-slide-description"
                            >
                                {/* <DialogTitle ><span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WarningRoundedIcon fontSize='large' style={{ color: '#FF6600', marginRight: 10, marginTop: '-1.5px' }} /></span></DialogTitle> */}
                                <DialogContent dividers>
                                    <DialogContentText color='textPrimary' id="alert-dialog-slide-description" style={{ marginBottom: 0 }}>
                                        {profile.verified === undefined ?
                                            'Kirayə təklifi göndərə bilmək üçün hesabınızı doğrulayın.'
                                            :
                                            'Hesabınız doğrulandıqdan sonra kirayə təklifi göndərə bilərsiniz.'
                                        }
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={() => {
                                            props.history.push('/user');
                                        }}
                                        className='skyColor_btn' size='medium' color='primary' variant='contained'>
                                        {profile.verified === undefined ?
                                            'Doğrula'
                                            :
                                            'Hesabım'
                                        }
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </Fragment>)

                    }
                </div>

            </div>
        </div>
    )
}

Rental.propTypes = {
    getRent: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,

}

const mapActionsToProps = { getRent, removeRent, handleOpenSignIn, addToBasket, offerOnRent };

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data,
    UI: state.UI,
    auth: state.firebase.auth,
    profile: state.firebase.profile
})


export default connect(mapStateToProps, mapActionsToProps)(Rental);