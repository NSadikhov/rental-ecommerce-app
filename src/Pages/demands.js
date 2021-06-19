import React, { useState, useEffect } from 'react';
import '../Css/demands.css'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';
import StarsIcon from '@material-ui/icons/Stars';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import makeStyles from '@material-ui/core/styles/makeStyles';
import red from '@material-ui/core/colors/red';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Link from 'react-router-dom/Link';
import { compose } from 'redux';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle'
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import Slide from '@material-ui/core/Slide';
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDemands } from '../Redux/actions/dataActions';
import { sendDemandNotification } from '../Redux/actions/userActions';
import { withFirestore } from 'react-redux-firebase';

import dayjs from '../util/customDayJs';
import { calculateRating } from '../util';
import { pageTitlesAndDescriptions } from '../dbSchema';

import { Helmet } from 'react-helmet';

// import { useFirestoreConnect } from 'react-redux-firebase';

const useStyles = makeStyles((theme) => ({

    name: {
        fontSize: '1.15rem'
    },
    avatar: {
        // backgroundColor: red[500],
        boxShadow: '0 1px 3px #363636'
    },
    starSection: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1rem',
        color: 'black'
    },
    star: {
        color: red[500],
        marginRight: '3px'
    }

}));


const Demands = (props) => {

    const classes = useStyles();

    const { data: { demands, loading }, auth, belongings, sentNotifications } = props;

    useEffect(() => {
        props.getDemands()
    }, [])

    // useFirestoreConnect(() => [
    //     {
    //         collection: 'rents',
    //         where: [['verified', '==', 'true']],
    //         where: [['sortIndex', '>', 0]],
           
    //         orderBy: [['sortIndex', 'desc']],
            
         
    //         storeAs: 'aq'
    //     } // or `todos/${props.todoId}`
    // ])

    useEffect(() => {
        if (!auth.isEmpty) {
            props.firestore.setListener({
                collection: 'rents',
                where: [['userId', '==', auth.uid]],
                orderBy: [['createdAt', 'desc']],
                storeAs: 'belongings'
            });

            props.firestore.setListener({
                collection: 'notifications',
                where: [['sender', '==', auth.uid]],
                where: [['type', '==', 'demand']],
                storeAs: 'sentNotifications'
            });
        }

        return () => {
            props.firestore.unsetListener({
                collection: 'rents',
                storeAs: 'belongings'
            });

            props.firestore.unsetListener({
                collection: 'notifications',
                storeAs: 'sentNotifications'
            });
        }
    }, [auth])

    const [open, setOpen] = useState(false);

    const [demand, setDemand] = useState({});

    const handleClickOpen = (demand) => {
        setDemand(demand);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpen2ndPage(false)
    };

    const [open2ndPage, setOpen2ndPage] = useState(false);

    return (
        <div className='main'>

            <Helmet>
                <title>{pageTitlesAndDescriptions.demand.title}</title>
                <meta name="description" content={pageTitlesAndDescriptions.demand.description} />
            </Helmet>

            <div className='container'>
                <div className="demand_search_header">
                    <Link to='/'>Kirayə Axtar</Link>
                    <p><span className='star'>*</span>Təcili Tələblər<span className='star'>*</span></p>
                </div>
            </div>
            <div className="wallpaper_demand" />

            <div className='container'>
                <div className="demandsContent">
                    <div className='demand_header'>
                        <h2 className='demandHeader_txt'>Trend Tələblər</h2>
                    </div>

                    <div className='demands'>

                        {(!loading && Array.isArray(demands))
                            ?
                            <>
                                {demands.map((demand) =>
                                (
                                    <Card onClick={() => auth.uid !== demand.userId ? handleClickOpen(demand) : null} elevation={4} className='demandCard' key={demand.id}>
                                        <Paper elevation={3} className='paper'>
                                            {demand.name}
                                        </Paper>
                                        <CardHeader
                                            className='headerPart'
                                            avatar={
                                                <Avatar aria-label="demand" className={classes.avatar} src={demand.userPhoto} />
                                            }
                                            title={<span className={classes.name}>{demand.userFullname}</span>}
                                            subheader={
                                                <>
                                                    {demand.userRating.length > 0 &&
                                                        <span className={classes.starSection}><StarsIcon fontSize='small' className={classes.star} />{calculateRating(demand.userRating)}</span>
                                                    }
                                                </>
                                            }
                                        />
                                        <CardContent className='contentPart'>
                                            <span className='location'> <LocationOnIcon color='primary' />{demand.city}{demand.district && ', ' + demand.district}{demand.province && ', ' + demand.province}</span>
                                            <h4 className='periodHeader_txt'>İstənilən vaxt aralığı</h4>
                                            <span style={{ display: 'flex', alignItems: 'center' }} >{dayjs(demand.start_date).format('DD.MM.YYYY')} <ArrowRightAltIcon color='primary' style={{ margin: '0 5px' }} /> {dayjs(demand.end_date).format('DD.MM.YYYY')}</span>
                                            <span style={{ display: 'flex', alignItems: 'center' }} >{demand.start_time} - {demand.end_time}</span>

                                        </CardContent>
                                    </Card>
                                ))}

                                {demands.length === 1 ?
                                    <>
                                        <div></div>
                                        <div></div>
                                    </>
                                    : demands.length === 2 ?
                                        <div></div>
                                        : null
                                }

                                <div className='empty_Data' style={{ display: demands.length > 0 ? 'none' : 'flex' }}>
                                    <img src={require('../Images/undraw_empty.svg')} alt='boş' />
                                    <span>Mövcud bir tələb yoxdur.</span>
                                </div>
                            </>
                            :
                            'loading'
                        }

                    </div>
                </div>

                <Dialog open={open} onClose={handleClose} className='demands_dialogBox' aria-labelledby="demands_dialogBox" fullWidth maxWidth='sm'>
                    <div style={{ display: open2ndPage ? 'none' : 'block' }}>
                        <DialogTitle className='demands_dialogTitle' >
                            {demand.name}
                        </DialogTitle>
                        <DialogContent className='demands_dialogContent'>
                            <span className='demands_dialogContent_category'>{demand.category} <ChevronRightRoundedIcon color='error' /> {demand.subcategory}</span>
                            <Grid container spacing={2} className='demands_dialogContent_userInfo_Box'>
                                <Grid item xs={4} className='demands_dialogContent_userInfo_Box_inside'>
                                    <div className='demands_dialogContent_userInfo'>
                                        <Avatar src={demand.userPhoto} className='demands_dialogContent_userInfo_Avatar' />
                                        <span className='demands_dialogContent_userInfo_name'>{demand.userFullname}</span>
                                        {demand.userRating && demand.userRating.length > 0 &&
                                            <Rating value={calculateRating(demand.userRating)} precision={0.5} readOnly />
                                        }
                                    </div>
                                </Grid>
                                <Grid item xs className='demands_dialogContent_userInfo_Box_details'>
                                    <h4>Tələb detalları</h4>
                                    <span className='demands_dialogContent_timeInterval_subHeader'>
                                        İstənilən vaxt aralığı
                                    </span>
                                    <div className='demands_dialogContent_timeInterval'>
                                        <span>
                                            <span>
                                                {dayjs(demand.start_date).format('DD MMM YYYY')}
                                            </span>
                                            <span>
                                                {demand.start_time}
                                            </span>
                                        </span>
                                        <span>-</span>
                                        <span>
                                            <span>
                                                {dayjs(demand.end_date).format('DD MMM YYYY')}
                                            </span>
                                            <span>
                                                {demand.end_time}
                                            </span>
                                        </span>
                                    </div>
                                </Grid>
                            </Grid>
                            <div className='customDividerHorizontal'></div>
                            <div className='demands_dialogContent_rentInfo'>
                                <span><LocationOnIcon color='primary' />{demand.city}{demand.district && <>, {demand.district}{demand.province && <>, {demand.province}</>}</>}</span>
                                <h4 className='demands_dialogContent_rentInfo_desc_header'>Məlumat</h4>
                                <p className='demands_dialogContent_rentInfo_desc_text'>{demand.description}</p>
                            </div>
                        </DialogContent>
                        <DialogActions className='demands_DialogActions'>
                            <Button size='large' onClick={() => setOpen2ndPage(true)} color="secondary" className='lightRedColor_btn demands_DialogActions_btn' variant='contained' fullWidth>
                                Kirayə ver
                            </Button>

                        </DialogActions>
                    </div>
                    <Slide direction="left" in={open2ndPage} mountOnEnter unmountOnExit exit={false}>
                        <div>
                            <DialogTitle id='form-dialog-title' className='demands_dialogTitle' >
                                <span className='demands_dialogTitle_2ndPage' >
                                    <KeyboardBackspaceRoundedIcon onClick={() => setOpen2ndPage(false)} style={{ color: '#149EB0', marginRight: '7.5px', cursor: 'pointer' }} />
                                    <span className='demands_dialogTitle_2ndPage_header'>
                                        Əşyalarım
                                    </span>
                                </span>
                            </DialogTitle>

                            <DialogContent className='demands_dialogContent'>
                                <p className='demands_dialogContent_2ndPage_topText'>
                                    Əşyanızı potensial müştərinizə təklif etdikdə ona bildiriş gedəcək. Əgər əşyanızla maraqlanarsa sizə geri təklif göndərəcək.
                                </p>
                                <Grid container spacing={2} className='demands_dialogContent_2ndPage_GridBox'>
                                    {belongings && belongings.length > 0 ?
                                        belongings.map(belonging => {
                                            return <Grid key={belonging.id} item xs={12}>
                                                <Paper elevation={3} className='demands_dialogContent_2ndPage_Grid'>
                                                    <div className='demands_dialogContent_2ndPage_Grid_img'>
                                                        <img src={belonging.imageUrls[0]} />
                                                    </div>
                                                    <div className='demands_dialogContent_2ndPage_Grid_infoPart_box'>

                                                        <h4 className='demands_dialogContent_2ndPage_Grid_rentInfo_header'>
                                                            {belonging.name}
                                                        </h4>
                                                        <div className='demands_dialogContent_2ndPage_Grid_infoPart'>
                                                            <div className='demands_dialogContent_2ndPage_Grid_infoPart_inside'>
                                                                {belonging.timePrice > 0 &&
                                                                    <span>
                                                                        <span className='bold'>
                                                                            {belonging.timePrice} <span className='manat'>&#8380;</span>
                                                                        </span> / saatlıq
                                                                    </span>
                                                                }

                                                                <span>
                                                                    <span className='bold'>
                                                                        {belonging.daily} <span className='manat'>&#8380;</span>
                                                                    </span> / günlük
                                                                </span>
                                                            </div>
                                                            <div className='demands_dialogContent_2ndPage_Grid_btnBox'>
                                                                <Button
                                                                    size='large'
                                                                    onClick={() => { props.sendDemandNotification({ recipient: demand.userId, demandName: demand.name, demandId: demand.id, rentId: belonging.id }) }}
                                                                    color={sentNotifications && sentNotifications.find(each => each.demandId === demand.id && each.link === belonging.id) ? "default" : "secondary"}
                                                                    className={sentNotifications && sentNotifications.find(each => each.demandId === demand.id && each.link === belonging.id) ? 'demands_dialogContent_2ndPage_Grid_btn' : 'lightRedColor_btn demands_dialogContent_2ndPage_Grid_btn'}
                                                                    variant='contained'
                                                                    disabled={sentNotifications && sentNotifications.find(each => each.demandId === demand.id && each.link === belonging.id)}
                                                                >
                                                                    Təklif et
                                                                </Button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </Paper>
                                            </Grid>
                                        })
                                        :
                                        <></>
                                    }
                                </Grid>

                                <div className='customDividerHorizontal'></div>
                                <p className='demands_dialogContent_2ndPage_bottomText'>
                                    Elanınız yoxdursa və ya olan elanlarınız tələbi qarşılamırsa yeni elan yaradın. Yeni elan yaratdıqda həm Tələbi yaradan istifadəçiyə təklifiniz yönləndiriləcək, həm də Elanınız saytda yerləşdiriləcək.
                                </p>
                            </DialogContent>
                            <DialogActions className='demands_DialogActions'>
                                <Button size='large' onClick={() => props.history.push('rent-out')} color="secondary" className='lightRedColor_btn demands_DialogActions_btn' variant='contained' fullWidth>
                                    Kirayə elanı yarat
                            </Button>
                            </DialogActions>
                        </div>
                    </Slide>
                </Dialog>

            </div>
        </div>
    )
}

Demands.propTypes = {
    getDemands: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapActionsToProps = { getDemands, sendDemandNotification };

const mapStateToProps = (state) => ({
    data: state.data,
    auth: state.firebase.auth,
    belongings: state.firestore.ordered.belongings,
    sentNotifications: state.firestore.ordered.sentNotifications
})


export default compose(
    withFirestore,
    connect(mapStateToProps, mapActionsToProps)
)(Demands);