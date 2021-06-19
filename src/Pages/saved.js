import React, { useEffect, useState } from 'react';
import '../Css/saved.css';

// import { Link } from 'react-router-dom';

// import Card from '@material-ui/core/Card';
// import Paper from '@material-ui/core/Paper';
// import CardHeader from '@material-ui/core/CardHeader';
// import CardContent from '@material-ui/core/CardContent';
// import Avatar from '@material-ui/core/Avatar';
// import StarsIcon from '@material-ui/icons/Stars';
// import LocationOnIcon from '@material-ui/icons/LocationOn';
// import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import Rent from '../Components/Rent';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { getLikedRents } from '../Redux/actions/dataActions';

// import dayjs from '../util/customDayJs';

// const useStyles = makeStyles((theme) => ({
//     name: {
//         fontSize: '1.15rem'
//     },
//     avatar: {
//         backgroundColor: red[500],
//     },
//     starSection: {
//         display: 'flex',
//         alignItems: 'center',
//         fontSize: '0.9rem'
//     },
//     star: {
//         color: red[500],
//         marginRight: '3px'
//     },

// }));


const Saved = (props) => {
    // const classes = useStyles();

    const { likes, likedRentsList } = props;

    useEffect(() => {
        if (likes && likes.length > 0) {
            if (likedRentsList.length > 0) {
                const filteredLikes = likes.filter(each => !likedRentsList.find(_each => _each.id === each))
                if (filteredLikes.length > 0) {
                    props.getLikedRents(filteredLikes);
                }
            }
            else {
                props.getLikedRents(likes);
            }
        }
    }, [likes])

    return (
        <div className='main'>
            <div className="container">

                <div className="savedContent">
                    <h2 className="savedContent_header">Bəyəndiklərim</h2>

                    {(likedRentsList && likedRentsList.length > 0)
                        ?
                        <div className="savedContent_inside">
                            {likedRentsList.map((likedRent) => <Rent key={likedRent.id} rent={likedRent} history={props.history} />)}

                            {likedRentsList.length === 1 ?
                                <>
                                    <div></div>
                                    <div></div>
                                </>
                                : likedRentsList.length === 2 ?
                                    <div></div>
                                    : null
                            }
                        </div>
                        :
                        <div className='savedContent_noData' >
                            <img src={require('../Images/undraw_like.svg')} />
                            <span>
                                Bəyənilmiş bir elan yoxdur.
                                </span>
                        </div>
                    }

                </div>
            </div>

        </div>
    )
}

Saved.propTypes = {
    // user: PropTypes.object.isRequired,
    getLikedRents: PropTypes.func.isRequired,
    // data: PropTypes.object.isRequired,

}

const mapActionsToProps = { getLikedRents };

const mapStateToProps = (state) => ({
    likes: state.firebase.profile.likes,
    auth: state.firebase.auth,
    likedRentsList: state.data.likedRentsList,
})


export default connect(mapStateToProps, mapActionsToProps)(Saved);