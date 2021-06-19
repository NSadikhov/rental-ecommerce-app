import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';

import PropTypes from 'prop-types';

import dayjs from '../util/customDayJs';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        // border: '2px solid #000',
        boxShadow: theme.shadows[3],
        padding: 0,
        borderRadius: 8,
        margin: '0 10px'
    },
}));


const AllComments = (props) => {
    const classes = useStyles();

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.openComments}
            onClose={props.handleCloseComments}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}

        >
            <Fade in={props.openComments}>
                <Container className={classes.paper} maxWidth='xs'>
                    <div className='profile_CommentsHeader'>
                        <span className='profile_CommentsHeader_txt' id="transition-modal-title">İstifadəçi rəyləri</span>
                        <CloseRoundedIcon onClick={props.handleCloseComments} fontSize='large' color='action' className='profile_CommentsHeader_closebtn' />
                    </div>
                    <div className='profile_CommentsContent'>
                        {Array.from(props.comments).map(comment =>
                            <div key={comment.commentId} className='profile_CommentsContent_comment'>
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
                            </div>)}
                    </div>

                </Container>
            </Fade>
        </Modal>
    )

}


AllComments.propTypes = {
    comments: PropTypes.array.isRequired,
    handleCloseComments: PropTypes.func.isRequired,
    handleOpenComments: PropTypes.func.isRequired,
    openComments: PropTypes.bool.isRequired,
}


export default AllComments;