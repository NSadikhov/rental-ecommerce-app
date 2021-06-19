import React, { useEffect, useState } from 'react';
import '../Css/topUp.css';
// import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Button from '@material-ui/core/Button';
// import Divider from '@material-ui/core/Divider';

// import makeStyles from '@material-ui/core/styles/makeStyles';
// import Grid from '@material-ui/core/Grid';
// import red from '@material-ui/core/colors/red';
// import StarsIcon from '@material-ui/icons/Stars';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { getLikedRents } from '../Redux/actions/dataActions';

// import dayjs from '../util/customDayJs';
import { priceFormat } from '../util';

// import { isEmptyObject, OFFERED_RENT_INFO, usePersistedStateLocal } from '../util';


// const useStyles = makeStyles((theme) => ({
//     starSection: {
//         display: 'flex',
//         alignItems: 'center',
//         fontSize: '1rem'
//     },
//     star: {
//         color: red[500],
//         marginRight: '2px'
//     },
// }));


const TopUp = (props) => {
    // const classes = useStyles();

    const { user: { authenticated, credentials, loading }, profile } = props;

    return (
        <div className='main'>
            <div className="container">

                <div className="topUpContent">
                    <h2 className="topUpContent_header">Balans Artımı</h2>
                    <div className="topUpContent_inside">
                        <div className='topUpContent_inside_P1'>
                            <AccountBalanceWalletIcon className='topUpContent_inside_P1_wallet' />
                            <span className='topUpContent_inside_P1_balance'>
                                Balansınız:
                            </span>
                            {!profile.isEmpty &&
                                <span>
                                    {priceFormat(profile.balance)} <span className='manat'>&#8380;</span>
                                </span>
                            }
                        </div>
                        <div className='topUpContent_inside_P2'>
                            <h3 className='topUpContent_inside_P2_header'>Bank Kartı ilə</h3>
                            <div className='topUpContent_inside_P2_box'>
                                <span className='topUpContent_inside_P2_box_header'>
                                    Balansınızı nə qədər artırmaq istəyirsiniz?
                                    </span>
                                <div>
                                    <div className='topUpContent_inside_P2_box_imgBox'>
                                        <img className='topUpContent_inside_P2_box_img' src={require('../Images/visa-master.png')} />
                                    </div>
                                    <div className='topUpContent_inside_P2_box_content'>

                                        <div className='topUpContent_inside_P2_box_content_inside'>
                                            <div>
                                                <span className='topUpContent_inside_P2_box_content_inside_currency'>
                                                    <span className='manat'>&#8380;</span>
                                                </span>
                                                <TextField
                                                    // name='minDay'
                                                    // defaultValue={minDay}
                                                    type='number'
                                                    variant='outlined'
                                                    size='small'
                                                    className='topUpContent_inside_P2_box_content_inside_amount'
                                                />
                                            </div>
                                            <Button className='topUpContent_inside_P2_box_content_inside_topUp' color='secondary' variant='contained'>
                                                Balansınızı artırın
                                        </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='topUpContent_inside_P3'>
                            <h3 className='topUpContent_inside_P3_header'>Ödəmə terminalları ilə</h3>
                            <div className='topUpContent_inside_P3_box'>
                                Tezliklə ...
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

TopUp.propTypes = {
    user: PropTypes.object.isRequired,
    // getLikedRents: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapActionsToProps = {};

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data,
    profile: state.firebase.profile
})


export default connect(mapStateToProps, mapActionsToProps)(TopUp);