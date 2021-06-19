import React, { useEffect, useState } from 'react';
import '../Css/basket.css';
// import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ShoppingCartRoundedIcon from '@material-ui/icons/ShoppingCartRounded';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import red from '@material-ui/core/colors/red';
import StarsIcon from '@material-ui/icons/Stars';
// import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { offerOnRent, deleteFromBasket } from '../Redux/actions/dataActions';

import dayjs from '../util/customDayJs';

// import { useFirestoreConnect } from 'react-redux-firebase';
import { calculateRating, priceFormat } from '../util';

// import { isEmptyObject, OFFERED_RENT_INFO, usePersistedStateLocal } from '../util';


const useStyles = makeStyles((theme) => ({
    starSection: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1rem'
    },
    star: {
        color: red[500],
        marginRight: '2px'
    },
}));


const Basket = (props) => {
    const classes = useStyles();

    const matches_450 = useMediaQuery('(min-width:450px)');
    const matches_500 = useMediaQuery('(min-width:500px)');
    const matches_600 = useMediaQuery('(min-width:600px)');
    const matches_900 = useMediaQuery('(min-width:900px)');

    const [isNotAffordable, setIsNotAffordable] = useState(false);

    const { auth, profile, baskets } = props;

    // const [offeredRentInfo, setOfferedRentInfo] = usePersistedStateLocal(OFFERED_RENT_INFO, {});



    const handlePayment = (rentDetails) => {
        if (profile.balance >= rentDetails.offerCalcObj.commission) {
            props.offerOnRent(rentDetails.rent.rentId, { ...rentDetails.rent, calculation: rentDetails.offerCalcObj, commented: false }, rentDetails.id, props.history);
        }
        else {
            setIsNotAffordable(true);
        }
    }

    return (
        <div className='main'>
            <div className="container">

                <div className="basketContent">
                    {!profile.isEmpty &&
                        <div className="basketContent_header">
                            {matches_600 ?
                                <>
                                    <span className='basketContent_header_basket'>
                                        Səbətiniz
                            <ShoppingCartRoundedIcon fontSize='large' />
                                    </span>


                                    {
                                        // fix
                                    }
                                    {/* <h2 className='basketContent_header_balance'>
                                        Balansınız: {priceFormat(profile.balance)} <span className='manat'>&#8380;</span>
                                    </h2> */}
                                    {/* {matches_450 ?
                                        <Button className='basketContent_header_topUp' variant='contained' onClick={() => props.history.push('/user/topUp')}>
                                            Balansınızı artırın
                                </Button>
                                        :
                                        <AddCircleRoundedIcon fontSize='large' className='basketContent_header_topUp_Icon' onClick={() => props.history.push('/user/topUp')} />
                                    } */}
                                </>
                                :
                                <>
                                    <div>
                                        {
                                            // fix
                                        }
                                        {/* <h2 className='basketContent_header_balance'>
                                            Balansınız: {priceFormat(profile.balance)} <span className='manat'>&#8380;</span>
                                        </h2>
                                        {matches_450 ?
                                            <Button className='basketContent_header_topUp' variant='contained' onClick={() => props.history.push('/user/topUp')}>
                                                Balansınızı artırın
                                </Button>
                                            :
                                            <AddCircleRoundedIcon fontSize='large' className='basketContent_header_topUp_Icon' onClick={() => props.history.push('/user/topUp')} />
                                        } */}
                                    </div>
                                    <span className='basketContent_header_basket'>
                                        Səbətiniz
                            <ShoppingCartRoundedIcon fontSize='large' />
                                    </span>
                                </>
                            }

                        </div>
                    }
                    <div className="basketContent_inside">
                        {baskets && baskets.length > 0 ?
                            <>
                                {baskets.map(each =>
                                    <Grid key={each.id} container spacing={matches_900 ? 0 : 2} className='basketContent_inside_GridBox'>

                                        <Grid item xs={matches_900 ? 6 : 12} className='basketContent_inside_GridBox_P1'>
                                            <h3 className='basketContent_inside_GridBox_P1_header'>{each.rent.productName}</h3>
                                            <Grid container spacing={2}>
                                                <Grid item xs={matches_900 ? 5 : matches_500 ? 6 : 4} className='basketContent_inside_GridBox_P1_imgBox'>
                                                    <img src={each.rent.imageUrls[0]} className='basketContent_inside_GridBox_P1_img' />
                                                </Grid>
                                                <Grid item xs className='basketContent_inside_GridBox_P1_info' >
                                                    <span className='basketContent_inside_GridBox_P1_info_text'>{dayjs(each.rent.start_date).format('DD MMM YYYY')} - {dayjs(each.rent.end_date).format('DD MMM YYYY')}</span>
                                                    <span className='basketContent_inside_GridBox_P1_info_text'>{each.rent.startTime} - {each.rent.endTime}</span>
                                                    <span className='basketContent_inside_GridBox_P1_info_text'>{each.rent.city}{each.rent.district && `, ${each.rent.district}`}{each.rent.province && `, ${each.rent.province}`}</span>
                                                    {/* <span> {each.rent.rentOwnerFullname}</span> */}
                                                    <span className={classes.starSection + ' basketContent_inside_GridBox_P1_info_text'}>
                                                        <StarsIcon fontSize='small' className={classes.star} />
                                                        {each.rent.rentOwnerRating.length > 0
                                                            ?
                                                            `${calculateRating(each.rent.rentOwnerRating)} ${each.rent.rentOwnerFullname}`
                                                            :
                                                            each.rent.rentOwnerFullname
                                                        }
                                                    </span>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs className='basketContent_inside_GridBox_P2'>
                                            <h3 className='basketContent_inside_GridBox_P2_header'>Servis haqqı</h3>
                                            <div className='basketContent_inside_GridBox_P2_info'>

                                                <span className='basketContent_inside_GridBox_P2_info_price'><span className='manat'>&#8380;</span> {each.offerCalcObj.commission.toFixed(2)}</span>
                                                <Button onClick={() => handlePayment(each)} className='basketContent_inside_GridBox_P2_payBtn' color='secondary' variant='contained' fullWidth>
                                                    Ödə
                                </Button>
                                                {isNotAffordable &&
                                                    <span className='basketContent_inside_GridBox_P2_info_topUp' onClick={() => props.history.push('/user/topUp')}>
                                                        Balansınızı artırın
                                    </span>
                                                }
                                                <span className='basketContent_inside_GridBox_P2_info_last'>
                                                    *Rezerv etmək üçün servis haqqını ödəyin.
                                    </span>
                                            </div>

                                        </Grid>
                                        <div className='basketDividerBox'>
                                            <Divider orientation='vertical' className='basketDivider' />
                                        </div>
                                        <Grid item xs className='basketContent_inside_GridBox_P3'>
                                            <h3 className='basketContent_inside_GridBox_P3_header'>Kirayə haqqı</h3>
                                            <div className='basketContent_inside_GridBox_P3_info'>
                                                <span className='basketContent_inside_GridBox_P3_info_price'><span className='manat'>&#8380;</span> {priceFormat(each.offerCalcObj.price - each.offerCalcObj.priceWithDiscount)}</span>
                                                <span className='basketContent_inside_GridBox_P3_info_last'>
                                                    *Əşyanı götürəndə nağd ödəyəcəyiniz məbləğ.
                                                </span>
                                            </div>
                                            <div className='baskets_deleteIcon' onClick={() => props.deleteFromBasket(each.id)}>
                                                <DeleteForeverIcon color='error' fontSize='large' />
                                            </div>
                                        </Grid>
                                    </Grid>
                                )}
                                {
                                    // fix
                                }
                                {/* <div className='Company_Advert basketContent_Advert'>
                                    <img src={require('../Images/ironfist.png')} />
                                    <p><span>Mandarentdə</span> hər kirayə əməliyyatınızda ödədiyiniz servis haqqının 5%-i yeni yaranmış <span className='red-text bold'>"YAŞAT"</span> - Şəhid ailələrinə yardım fonduna köçürülür.</p>
                                </div> */}

                            </>
                            :
                            <div className='basketContent_emptyCartBox'>
                                <img src={require('../Images/undraw_empty_cart.svg')} />

                                <span>
                                    Hal-hazırda səbətiniz boşdur.
                                </span>
                            </div>
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

Basket.propTypes = {
    user: PropTypes.object.isRequired,
    // getLikedRents: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapActionsToProps = { offerOnRent, deleteFromBasket };

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    baskets: state.firestore.ordered.baskets,
})


export default connect(mapStateToProps, mapActionsToProps)(Basket);