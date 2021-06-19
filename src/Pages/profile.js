import React, { useEffect, useState } from 'react';
import '../Css/profile.css';

import Paper from '@material-ui/core/Paper';

import Avatar from '@material-ui/core/Avatar';
import StarsIcon from '@material-ui/icons/Stars';

import makeStyles from '@material-ui/core/styles/makeStyles';
import red from '@material-ui/core/colors/red';
import Rating from '@material-ui/lab/Rating';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfileData, removeProfileData } from '../Redux/actions/dataActions';

import dayjs from '../util/customDayJs';
import { calculateRating } from '../util';
import ProfileRent from '../Components/ProfileRent';
import AllComments from '../Components/AllComments';

import badge from '../Images/badge.svg';

const useStyles = makeStyles((theme) => ({

    name: {
        fontSize: '1.15rem'
    },
    avatar: {
        backgroundColor: red[500],
    },
    starSection: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '15px'
    },
    star: {
        color: red[500],
        marginRight: '3px'
    },
    red: {
        backgroundColor: red[500],
    },

}));


const Profile = (props) => {
    const classes = useStyles();

    const { data: { profile, loading } } = props;

    const matches_550 = useMediaQuery('(min-width:550px)');

    const userId = props.match.params.userId;
    // const path = window.location.pathname.split('/rentals/')[1];
    // const rentName = path.split('-')[0];
    // const userId = path.split('-')[1];

    useEffect(() => {
        props.getProfileData(userId);
        return () => {
            props.removeProfileData();
        }
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [profile])

    const commentsSize = 3;

    const [openComments, setOpenComments] = useState(false);

    const handleOpenComments = () => {
        setOpenComments(true);
    };

    const handleCloseComments = () => {
        setOpenComments(false);
    };

    return (
        <div className='main'>
            <div className="container">

                <div className="profileContent">

                    {!loading && profile.length !== 0 &&
                        <div className="profileContent_inside">
                            <div className='profileContent_inside_P1' elevation={3}>
                                <div className='profileContent_inside_P1_left'>
                                    <img src={profile.user.photoUrl} />
                                    {profile.user.elit &&
                                        <img className='badge_logo' src={badge} alt='elit logo' />
                                    }
                                </div>
                                <div className='profileContent_inside_P1_right'>
                                    <span className='profileContent_inside_P1_right_header'>{profile.user.name} {profile.user.surname}</span>
                                    <div className='profileContent_inside_P1_right_middle'>
                                        {matches_550 ?
                                            <>
                                                {profile.user.rating.length > 0 &&
                                                    <span className={classes.starSection}><StarsIcon fontSize='small' className={classes.star} />{calculateRating(profile.user.rating)}</span>
                                                }
                                                <span>{profile.user.city} | Üzv olduğu tarix: {dayjs(profile.user.createdAt).format('MMMM YYYY')} </span>
                                            </>
                                            :
                                            <>
                                                <span>
                                                    {profile.user.rating.length > 0 &&
                                                        <span className={classes.starSection}><StarsIcon fontSize='small' className={classes.star} />{calculateRating(profile.user.rating)}</span>
                                                    } {profile.user.city}
                                                </span>
                                                <span> Üzv olduğu tarix: {dayjs(profile.user.createdAt).format('MMMM YYYY')}</span>
                                            </>
                                        }
                                    </div>
                                    <span className='profileContent_inside_P1_right_middle_biography'>{profile.user.biography}</span>
                                </div>
                            </div>

                            <div className='profileContent_inside_P2'>
                                <h3 className='profileContent_inside_P2_header'>Dəyərləndirmələr</h3>
                                <div className='profileContent_inside_P2_reviewsBox'>
                                    {Array.from(profile.comments).slice(0, commentsSize).map(comment =>
                                        <Paper key={comment.commentId} className='profileContent_inside_P2_review' elevation={3}>
                                            <div className='profileContent_inside_P2_review_top'>
                                                <div className='profileContent_inside_P2_review_top_infoBox'>
                                                    <Avatar src={comment.userPhoto} className='profileContent_inside_P2_review_top_infoBox_img' />
                                                    <div className='profileContent_inside_P2_review_top_info'>
                                                        <span>
                                                            {comment.userFullname.split(' ')[0]}
                                                        </span>
                                                        <span>
                                                            {dayjs(comment.createdAt).format('DD MMM YYYY')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='profileContent_inside_P2_review_top_rating'>
                                                    <Rating value={comment.rating} precision={0.5} readOnly />
                                                </div>
                                            </div>
                                            <div className='profileContent_inside_P2_review_bottom'>
                                                {comment.body}
                                            </div>
                                        </Paper>)}

                                    {profile.comments.length === 1 ?
                                        <>
                                            <div></div>
                                            <div></div>
                                        </>
                                        : profile.comments.length === 2 ?
                                            <div></div>
                                            : null
                                    }
                                </div>
                                {profile.comments.length > commentsSize &&
                                    <>
                                        <span onClick={handleOpenComments} className='profileContent_inside_P2_showMore'>Digər {profile.comments.length - 3} rəyi görüntülə</span>
                                        <AllComments
                                            comments={profile.comments}
                                            handleCloseComments={handleCloseComments}
                                            handleOpenComments={handleOpenComments}
                                            openComments={openComments}
                                        />

                                    </>
                                }
                            </div>
                            <div className='profileContent_inside_P3'>
                                <h3 className='profileContent_inside_P3_header'>Bu İstifadəçiyə məxsus əşyalar</h3>
                                <div className='profileContent_inside_P3_belongings'>
                                    {profile.rents.map(rent => <ProfileRent key={rent.id} rent={rent} />)}

                                    {profile.rents.length === 1 ?
                                        <>
                                            <div></div>
                                            <div></div>
                                        </>
                                        : profile.rents.length === 2 ?
                                            <div></div>
                                            : null
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

Profile.propTypes = {
    // user: PropTypes.object.isRequired,
    getProfileData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapActionsToProps = { getProfileData, removeProfileData };

const mapStateToProps = (state) => ({
    // user: state.user,
    data: state.data
})


export default connect(mapStateToProps, mapActionsToProps)(Profile);