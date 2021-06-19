import React, { useState, useEffect } from 'react';

// import SearchIcon from '@material-ui/icons/Search';
// import Card from '@material-ui/core/Card';

import { connect } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { check_operationStatus, sendComment, createMessageChatBox, downloadAgreement } from '../../Redux/actions/userActions';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';

import dayjs from '../../util/customDayJs';

const columns = [
    { id: 'operation_user', label: '', textAlign: 'left' },
    { id: 'productInfo', label: 'Əşya', minWidth: 180, textAlign: 'left' },
    // { id: 'operation_start_date', label: 'Başlanğıc tarixi', minWidth: 150, format: (value) => dayjs(value).format('DD-MM-YYYY') },
    // { id: 'operation_end_date', label: 'Bitiş tarixi', minWidth: 150, format: (value) => dayjs(value).format('DD-MM-YYYY') },
    { id: 'operation_start_date', label: 'Başlanğıc tarixi', minWidth: 130, textAlign: 'center' },
    { id: 'operation_end_date', label: 'Bitiş tarixi', minWidth: 130, textAlign: 'center' },
    { id: 'price', label: 'Məbləğ', textAlign: 'center', minWidth: 100, format: (value) => value.toFixed(2) },
    { id: 'status', label: 'Status', textAlign: 'center', minWidth: 100, format: (value) => value === 'accepted' ? 'Aktiv' : value === 'ongoing' ? 'Aktiv' : value === 'fulfilled' ? 'Tamamlanmış' : null },
    { id: 'type', label: 'Növ', textAlign: 'center', minWidth: 100 },
    // {
    //     id: 'population',
    //     label: 'Population',
    //     minWidth: 170,
    //     // align: 'right',
    //     format: (value) => value.toLocaleString('en-US'),
    // },
    // {
    //     id: 'size',
    //     label: 'Size\u00a0(km\u00b2)',
    //     minWidth: 170,
    //     // align: 'right',
    //     format: (value) => value.toLocaleString('en-US'),
    // },

];

function createData(operation_user, productInfo, operation_start_date, operation_end_date, price, status, type) {
    return { operation_user, productInfo, operation_start_date, operation_end_date, price, status, type };
}

function getSortIndex(status) {
    return status === 'accepted' ? 1 : status === 'ongoing' ? 2 : status === 'fulfilled' ? 3 : 0;
}

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 640,
    },
}));

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },

    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },

});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const Operations = (props) => {

    // const { user: { receivedOffers, sentOffers, loading } } = props;
    const matches_950 = useMediaQuery('(min-width:950px)');

    const { auth } = props;

    useFirestoreConnect(() => [
        { collection: 'offers', where: [['toId', '==', auth.uid]], orderBy: [['createdAt', 'desc']], storeAs: 'receivedOffers' },
        { collection: 'offers', where: [['fromId', '==', auth.uid]], orderBy: [['createdAt', 'desc']], storeAs: 'sentOffers' } // or `todos/${props.todoId}`
    ])

    const { receivedOffers, sentOffers } = props;

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [activeSection, setActiveSection] = useState(0);

    const [open, setOpen] = useState(false);
    const [productInfo, setProductInfo] = useState({});

    const [ratingValue, setRatingValue] = useState(0);
    const [comment, setComment] = useState('');

    const handleClickOpen = (userInfo, proInfo) => {
        setProductInfo({
            productName: proInfo.productName,
            productImage: proInfo.productImage,
            recipient: proInfo.productOwner,
            rentId: proInfo.productId,
            offerId: userInfo.offerId
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [error, setError] = useState(false);

    const handleSubmit = () => {
        if (ratingValue > 0 && comment.trim() !== '') {
            props.sendComment({ body: comment, rating: ratingValue, recipient: productInfo.recipient, rentId: productInfo.rentId, offerId: productInfo.offerId });
            handleClose();
        }
        else {
            setError(true);
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSection = (event) => {
        switch (event.currentTarget.getAttribute('index')) {
            case '0':
                setActiveSection(0);
                setRows(allOperations);
                break;
            case '1':
                setActiveSection(1);
                setRows(allOperations.filter(obj => obj.status === 'accepted' || obj.status === 'ongoing'));
                break;
            case '2':
                setActiveSection(2);
                setRows(allOperations.filter(obj => obj.status === 'fulfilled'));
                break;
            case '3':
                setActiveSection(3);
                setRows(allOperations.filter(obj => obj.type === 'Müştəri'));
                break;
            case '4':
                setActiveSection(4);
                setRows(allOperations.filter(obj => obj.type === 'Kirayələdiyim'));
                break;

        }
    }

    const [allOperations, setAllOperations] = useState([]);
    const [rows, setRows] = useState([]);

    // const isFirstRun = useRef(true);
    useEffect(() => {
        // if (isFirstRun.current) {
        //     isFirstRun.current = false;
        //     return;
        // }

        let arr = [];
        if (receivedOffers && Array.from(receivedOffers).length > 0)
            receivedOffers.forEach(offer => {
                if (offer.status !== 'waiting')
                    arr.push(createData({ userId: offer.fromId, userFullname: offer.userFullname, userPhoto: offer.userPhoto, offerId: offer.id, sortIndex: getSortIndex(offer.status) }, { productOwner: offer.toId, productName: offer.productName, productImage: offer.imageUrls[0], productId: offer.rentId, commented: offer.commented, productOwnerFullname: offer.rentOwnerFullname, productOwnerPhoto: offer.rentOwnerPhoto }, { date: offer.start_date, time: offer.startTime }, { date: offer.end_date, time: offer.endTime }, (offer.calculation.price - offer.calculation.priceWithDiscount), offer.status, 'Müştəri'))
            })
        if (sentOffers && Array.from(sentOffers).length > 0)
            sentOffers.forEach(offer => {
                if (offer.status !== 'waiting')
                    arr.push(createData({ userId: offer.fromId, userFullname: offer.userFullname, userPhoto: offer.userPhoto, offerId: offer.id, sortIndex: getSortIndex(offer.status) }, { productOwner: offer.toId, productName: offer.productName, productImage: offer.imageUrls[0], productId: offer.rentId, commented: offer.commented, productOwnerFullname: offer.rentOwnerFullname, productOwnerPhoto: offer.rentOwnerPhoto }, { date: offer.start_date, time: offer.startTime }, { date: offer.end_date, time: offer.endTime }, (offer.calculation.price - offer.calculation.priceWithDiscount), offer.status, 'Kirayələdiyim'))
            })
        // setRows(oldVersion => [...oldVersion, { }])

        arr.sort((x, y) => (x.operation_user.sortIndex > y.operation_user.sortIndex ? 1 :
            x.operation_user.sortIndex === y.operation_user.sortIndex ? x.operation_start_date.date > y.operation_start_date.date ? 1 : -1 : -1));
        setAllOperations(arr);
        setRows(arr);
    }, [receivedOffers, sentOffers]);

    useEffect(() => {

        if (receivedOffers && sentOffers) {
            let arr = [];
            receivedOffers.forEach((each) => {
                if (each.status !== 'waiting')
                    // console.log(dayjs().diff(dayjs(each.start_date), 'hour'));
                    if (each.status === 'accepted') {
                        if (dayjs(each.start_date.split('T')[0] + ' ' + each.startTime).isSameOrBefore(dayjs(), 'hour')
                            && dayjs(each.end_date.split('T')[0] + ' ' + each.endTime).isAfter(dayjs(), 'hour')) {
                            arr.push({ id: each.id, statusToChange: 'ongoing' });
                        }
                        else if (dayjs(each.start_date.split('T')[0] + ' ' + each.startTime).isSameOrBefore(dayjs(), 'hour')
                            && dayjs(each.end_date.split('T')[0] + ' ' + each.endTime).isSameOrBefore(dayjs(), 'hour')) {
                            arr.push({ id: each.id, statusToChange: 'fulfilled' });
                        }
                    }
                    else if (each.status === 'ongoing') {
                        if (dayjs(each.end_date.split('T')[0] + ' ' + each.endTime).isSameOrBefore(dayjs(), 'hour')) {
                            arr.push({ id: each.id, statusToChange: 'fulfilled' });
                        }
                    }

            })
            sentOffers.forEach((each) => {
                if (each.status !== 'waiting')
                    if (each.status === 'accepted') {
                        if (dayjs(each.start_date.split('T')[0] + ' ' + each.startTime).isSameOrBefore(dayjs(), 'hour')
                            && dayjs(each.end_date.split('T')[0] + ' ' + each.endTime).isAfter(dayjs(), 'hour')) {
                            arr.push({ id: each.id, statusToChange: 'ongoing' });
                        }
                        else if (dayjs(each.start_date.split('T')[0] + ' ' + each.startTime).isSameOrBefore(dayjs(), 'hour')
                            && dayjs(each.end_date.split('T')[0] + ' ' + each.endTime).isSameOrBefore(dayjs(), 'hour')) {
                            arr.push({ id: each.id, statusToChange: 'fulfilled' });
                        }
                    }
                    else if (each.status === 'ongoing') {
                        if (dayjs(each.end_date.split('T')[0] + ' ' + each.endTime).isSameOrBefore(dayjs(), 'hour')) {
                            arr.push({ id: each.id, statusToChange: 'fulfilled' });
                        }
                    }
            })

            props.check_operationStatus(arr);
        }
    }, [receivedOffers, sentOffers]);

    const [isDownloading, setIsDownloading] = useState(false);
    const handleAggrementDonwload = (info) => {
        if (!isDownloading) {
            setIsDownloading(true);
            props.downloadAgreement(info, setIsDownloading);
        }
    }


    return (
        <div className="operations">

            <div className="operations_sections">
                <div className="operations_sections_inside">
                    <h1>Əməliyyatlarım</h1>
                    <div className='operations_sections_buttonsBox'>
                        <div className="operations_sections_buttons">
                            <Button variant={activeSection === 0 ? 'contained' : 'outlined'} color="primary" index={0} onClick={handleSection}>
                                Hamısı
                    </Button>
                            <Button variant={activeSection === 1 ? 'contained' : 'outlined'} color="primary" index={1} onClick={handleSection}>
                                Aktiv
                    </Button>
                            <Button variant={activeSection === 2 ? 'contained' : 'outlined'} color="primary" index={2} onClick={handleSection}>
                                Tamamlanmış
                    </Button>
                            <Button variant={activeSection === 3 ? 'contained' : 'outlined'} color="primary" index={3} onClick={handleSection}>
                                Kirayə Verdiklərim
                    </Button>
                            <Button variant={activeSection === 4 ? 'contained' : 'outlined'} color="primary" index={4} onClick={handleSection}>
                                Kirayə Aldıqlarım
                    </Button>
                        </div>

                    </div>
                </div>
            </div>
            {matches_950 ?
                <div className="operations_info_sections">
                    <Paper className={classes.root} elevation={3}>
                        <TableContainer className={classes.container}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                // align={column.align}
                                                style={{ minWidth: column.minWidth, textAlign: column.textAlign, padding: '12px 0 12px 12px' }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.from(rows).length > 0 && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.operation_user.offerId}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    const rowUserInfo = row['operation_user'];
                                                    return (
                                                        <TableCell key={column.id} align={column.textAlign} style={{ padding: '12px 0 12px 12px' }}>

                                                            {column.id === 'operation_user'
                                                                ?
                                                                <>
                                                                    {value.userId !== auth.uid ?
                                                                        <div className='operations_tableUserInfo'>
                                                                            <img src={value.userPhoto} onClick={() => props.history.push('/profile/' + value.userId)} />
                                                                            <div className='operations_tableUserBox'>
                                                                                <span>{value.userFullname}</span>
                                                                            </div>
                                                                        </div>
                                                                        : null
                                                                    }
                                                                </>
                                                                :
                                                                (column.id === 'productInfo')
                                                                    ?
                                                                    <div className='operations_tableProductInfo'>
                                                                        <span>
                                                                            <span className='operations_tableProductInfo_name'>
                                                                                <span>{value.productName}</span>
                                                                                {row['status'] !== 'fulfilled' &&
                                                                                    <span className={`operations_agreement ${!isDownloading ? 'cursor' : 'wait'}`} onClick={() => handleAggrementDonwload(row)}>Müqavilə</span>
                                                                                }
                                                                            </span>


                                                                            {!(value.productOwner !== auth.uid && row['status'] === 'fulfilled' && !value.commented) &&
                                                                                <IconButton className={props.classes.messageIconbtn}
                                                                                    onClick={() => props.createMessageChatBox({
                                                                                        toId: rowUserInfo.userId === auth.uid ? value.productOwner : rowUserInfo.userId,
                                                                                        recipientFullname: rowUserInfo.userId === auth.uid ? value.productOwnerFullname : rowUserInfo.userFullname,
                                                                                        recipientPhotoUrl: rowUserInfo.userId === auth.uid ? value.productOwnerPhoto : rowUserInfo.userPhoto,
                                                                                        rentOwner: value.productOwner,
                                                                                        rentId: value.productId,
                                                                                        rentName: value.productName,
                                                                                        rentImage: value.productImage,
                                                                                    }, props.history)}
                                                                                >
                                                                                    <MailOutlineRoundedIcon />
                                                                                </IconButton>
                                                                            }
                                                                        </span>
                                                                        {(value.productOwner !== auth.uid && row['status'] === 'fulfilled' && !value.commented) &&
                                                                            <Button
                                                                                variant='outlined'
                                                                                color='primary'
                                                                                size='small'
                                                                                className='operations_tableUserBox_btn'
                                                                                onClick={() => handleClickOpen(rowUserInfo, value)}>
                                                                                Dəyərləndir
                                                                            </Button>
                                                                        }
                                                                    </div>
                                                                    :
                                                                    (column.id === 'operation_start_date' || column.id === 'operation_end_date') ?
                                                                        <span className='operations_dateTimeBox'>
                                                                            <span>
                                                                                {dayjs(value.date).format('DD.MM.YYYY')}
                                                                                <span>{value.time}</span>
                                                                            </span>
                                                                        </span>
                                                                        :
                                                                        column.format ? column.format(value) : value
                                                            }
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>

                </div>
                :
                <>
                    <div className="operations_info_sections_tabMob">
                        {Array.from(rows).length > 0 && Array.from(rows).map((row) =>
                            <Paper elevation={4} className='operations_info_sections_tabMob_elem'>
                                <div className='operations_info_sections_tabMob_elemHeader'>
                                    <h3 className='operations_info_sections_tabMob_elem_title'>{row.type}</h3>
                                    {(row.productInfo.productOwner !== auth.uid && row.status === 'fulfilled' && !row.productInfo.commented) ?
                                        <Button
                                            variant='outlined'
                                            color='primary'
                                            size='small'
                                            className='operations_tableUserBox_btn'
                                            onClick={() => handleClickOpen(row.operation_user, row.productInfo)}>
                                            Dəyərləndir
                                        </Button>
                                        :
                                        <IconButton className={props.classes.messageIconbtn} onClick={() => props.history.push('/user#messages')} >
                                            <MailOutlineRoundedIcon />
                                        </IconButton>
                                    }
                                </div>
                                {row.operation_user.userId !== auth.uid &&
                                    <div className='operations_info_sections_tabMob_elem_UserInfoBox'>
                                        <img src={row.operation_user.userPhoto} />
                                        <span>{row.operation_user.userFullname}</span>
                                    </div>
                                }
                                <h3 className='operations_info_sections_tabMob_elem_productTitle'>{row.productInfo.productName}</h3>
                                {row.status !== 'fulfilled' &&
                                    <span className='operations_agreement' onClick={handleAggrementDonwload}>Müqavilə</span>
                                }
                                <div className='operations_info_sections_tabMob_elem_ProductInfoBox'>
                                    <img src={row.productInfo.productImage} />
                                    <div className='operations_info_sections_tabMob_elem_ProductInfoBox_DateTime'>
                                        <span>Kirayə Müddəti</span>
                                        <span className='operations_info_sections_tabMob_elem_ProductInfoBox_DateTimeInside'>
                                            <span>
                                                {dayjs(row.operation_start_date.date).format('DD.MM.YYYY')}
                                                <span>{row.operation_start_date.time}</span>
                                            </span> - <span>
                                                {dayjs(row.operation_end_date.date).format('DD.MM.YYYY')}
                                                <span>{row.operation_end_date.time}</span>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className='operations_info_sections_tabMob_elem_Status'>
                                    <span>Status: {row.status === 'accepted' ? 'Aktiv' : row.status === 'ongoing' ? 'Aktiv' : row.status === 'fulfilled' ? 'Tamamlanmış' : null}</span>
                                    <span className='operations_info_sections_tabMob_elem_Status_Price'>{row.price} <span className='manat'>&#8380;</span></span>
                                </div>
                            </Paper>
                        )}
                    </div>
                </>
            }

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog" fullWidth maxWidth='sm'>
                <DialogTitle onClose={handleClose}>
                    <div className='operationsDialogHeader'>
                        <Avatar src={productInfo.productImage} className={classes.large} />
                        <span>
                            <span className='operationsUserName'>
                                {productInfo.productName}
                            </span>
                        </span>

                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <div className='operationsRatingBox'>
                        <span>Kirayə təcrübənizi dəyərləndirin.</span>
                        <div className='operationsRatingContent'>
                            <span className='operationsRatingContent_txt'>Dəyərləndirmə:</span>
                            <Rating name='rating' precision={0.5} size='medium' value={ratingValue} onChange={(event, newValue) => setRatingValue(newValue)} />
                        </div>
                    </div>
                    <TextField
                        margin="dense"
                        name="body"
                        label="Rəy bildir"
                        fullWidth
                        multiline
                        autoComplete='off'
                        onChange={(event) => {
                            setComment(event.target.value);
                        }}
                    />

                    {error &&
                        <div className='helperText' style={{ marginTop: 10 }}>Kirayə təcrübənizə reytinq və rəy verin.</div>
                    }
                </DialogContent>
                <DialogActions className='sendMessage_btnBox'>
                    <Button className='sendMessage_btn' color="primary" onClick={handleSubmit} size='medium' >
                        Paylaş
                            </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}


const mapStateToProps = (state) => ({
    // user: state.user,
    receivedOffers: state.firestore.ordered.receivedOffers,
    sentOffers: state.firestore.ordered.sentOffers,
    auth: state.firebase.auth
})

const mapActionsToProps = { check_operationStatus, sendComment, createMessageChatBox, downloadAgreement };

Operations.propTypes = {
    // user: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapActionsToProps)(Operations);


// export default compose(
//     firestoreConnect([{ collection: 'rents', orderBy: ['createdAt', 'desc'], storeAs: 'receivedOffers' }]),
//     connect(mapStateToProps, mapActionsToProps)
// )(Operations);