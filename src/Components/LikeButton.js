import React, { Fragment, useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import { isEmpty } from 'react-redux-firebase';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { likeRent, unlikeRent } from '../Redux/actions/dataActions';

import { handleOpenSignIn } from '../Redux/actions/uiActions';
import { Button } from '@material-ui/core';
import { mobileAndTabletCheck } from '../util';

const LikeButton = (props) => {

    const { rent, auth, profile } = props;

    const likedRent = () => {
        if (!profile.isEmpty && profile.likes && profile.likes.find(each => each === rent.id))
            return true;
        else
            return false;
    }

    const likeRent = () => {
        props.likeRent(rent.id)
    }

    const unlikeRent = () => {
        props.unlikeRent(rent.id)
    }


    return (
        <Fragment>
            {props.type === 'icon' ?
                (auth.isEmpty ?
                    (<IconButton aria-label="add to favorites" className='red' onClick={(e) => { e.preventDefault(); props.handleOpenSignIn() }} >
                        <FavoriteIcon />
                    </IconButton>)
                    :
                    (likedRent() ? (
                        (<div className={'customIconButton grey-background-hvr'} onClick={(e) => { e.preventDefault(); e.currentTarget.blur(); unlikeRent() }}>
                            <FavoriteIcon className='red' />
                        </div>)
                    ) :
                        (<div className={'customIconButton grey-background-hvr'} onClick={(e) => { e.preventDefault(); e.currentTarget.blur(); likeRent() }}>
                            <FavoriteIcon color='action' />
                        </div>)))

                : props.type === 'button' ?
                    (auth.isEmpty ?
                        (<Button variant='outlined' color='secondary' size='large' startIcon={<FavoriteBorderIcon />} onClick={props.handleOpenSignIn} >
                            Yadda saxla
                        </Button>)
                        :
                        (likedRent() ? (
                            (<Button variant='outlined' color='secondary' size='large' startIcon={<FavoriteIcon />} onClick={unlikeRent} >
                                Yadda saxla
                            </Button>)
                        ) :
                            (<Button variant='outlined' color='secondary' size='large' startIcon={<FavoriteBorderIcon />} onClick={likeRent} >
                                Yadda saxla
                            </Button>)))
                    : null

            }

        </Fragment>
    )
}

LikeButton.propTypes = {
    likeRent: PropTypes.func.isRequired,
    unlikeRent: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    rent: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired
}

const mapActionsToProps = { likeRent, unlikeRent, handleOpenSignIn };

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    likedRentsList: state.data.likedRentsList,
})

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)
