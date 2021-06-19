import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
// import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';
import red from '@material-ui/core/colors/red';

import ShareIcon from '@material-ui/icons/Share';
// import StarsIcon from '@material-ui/icons/Stars';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';


// import dayjs from '../util/customDayJs';
import LikeButton from './LikeButton';
// import { calculateRating, isEmptyObject } from '../util';



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
    },
}));

const ProfileRent = (props) => {

    const classes = useStyles();

    const { rent } = props;

    // const time = dayjs(rent.createdAt).fromNow();

    return (
        <Card className={classes.root} elevation={4} id='rentCard' component={Link} to={`/rentals/${rent.id}`} >
            <Paper elevation={3} className='rental-img-container'>
                <CardMedia
                    className={classes.media + ' rent-img'}
                    image={rent.imageUrls && rent.imageUrls[0]}
                    title={rent.name}
                />
                 {rent.elit &&
                    <div className='badge_text'>ELIT</div>
                }
            </Paper>

            <CardContent className={classes.cardContent} className='rentCardContent'>
                <span className={classes.title}>
                    <span className={classes.name}>
                        {rent.name}
                    </span>

                </span>
                <CardContent className={classes.rentSubInfo}>
                    <Typography variant="body1" color="textPrimary" component="p">
                        {rent.city}
                    </Typography>
                    {rent.timePrice !== 0 ?
                        <>
                            <Typography variant="body1" color="textPrimary" component="p">
                                <span style={{ fontWeight: "bold" }}>{rent.timePrice} azn</span> | saatlıq
             </Typography>
                            <Typography variant="body1" color="textPrimary" component="p">
                                <span style={{ fontWeight: "bold" }}>{rent.daily} azn</span> | günlük
                 </Typography>
                        </>
                        :
                        <Typography style={{ marginBottom: '24px' }} variant="body1" color="textPrimary" component="p">
                            <span style={{ fontWeight: "bold" }}>{rent.daily} azn</span> | günlük
             </Typography>
                    }

                </CardContent>
            </CardContent>
            <div className='rentDivider' />
            <CardActions disableSpacing className={classes.cardActions} >
                <LikeButton rent={rent} type='icon' />
                <IconButton aria-label="share" className='blue-hvr'>
                    <ShareIcon />
                </IconButton>
            </CardActions>

        </Card>
    );
}


ProfileRent.propTypes = {
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    rent: PropTypes.object.isRequired
}

// const mapActionsToProps = { likeRent, unlikeRent, handleOpenSignIn };

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})


export default connect(mapStateToProps)(ProfileRent);