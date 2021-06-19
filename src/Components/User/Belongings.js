import React, { useState, useEffect, forwardRef, Fragment } from 'react';

import SearchIcon from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';

import { connect, useSelector } from 'react-redux';
import { useFirestoreConnect, useFirebase } from 'react-redux-firebase';
import { compose } from 'redux';
import PropTypes from 'prop-types';

// import { isLoaded } from 'react-redux-firebase';

import { editRentDetails, deleteRent } from '../../Redux/actions/dataActions';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
// import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import AccessTimeRoundedIcon from '@material-ui/icons/AccessTimeRounded';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import { categories, location, maxSizeMB } from '../../dbSchema';
import Divider from '@material-ui/core/Divider';

import imageCompression from 'browser-image-compression';
import uuidv4 from 'uuid/v4';

import { storage } from '../../Firebase';
import { checkBlockedWords, isEmptyObject, priceFormat, usePersistedStateSession } from '../../util';


// import { firebase } from '../../Firebase';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Belongings = (props) => {

    const { auth, profile } = props;

    // const firebaseIns = useFirebase();

    useFirestoreConnect(() => [
        { collection: 'rents', where: [['userId', '==', auth.uid]], orderBy: [['createdAt', 'desc']], storeAs: 'belongings' } // or `todos/${props.todoId}`
    ])

    const { belongings } = props;

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openDeleteImage, setOpenDeleteImage] = useState(false);

    const [belongingDetails, setBelongingDetails] = useState({})
    const [belongingId, setBelongingId] = useState('');

    const handleChange = (event) => {
        setBelongingDetails({
            ...belongingDetails,
            [event.target.name]: event.target.value
        });
    }

    const handleClickOpen = (belonging) => {
        window.scrollTo(0, 0);
        setBelongingId(belonging.id);
        setBelongingDetails(belonging);
        setOpen(true);
        belonging.subcategory && setIsCategoryChanged(true);
        belonging.district && setIsCityChanged(true);
        belonging.province && setIsDistrictChanged(true);
        belonging.howToUse === '' && setHowToUse(true);
        setMinTime(belonging.minTime);
        setMinDay(belonging.minDay);
    };

    const handleClose = () => {
        Object.keys(belongingInfoErrors).forEach(each => { setBelongingInfoErrors(prevState => ({ ...prevState, [each]: false })) });
        setOpen(false);
    };

    const handleClickOpenDelete = (belonging) => {
        setBelongingId(belonging.id);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleClickOpenDeleteImage = (id) => {
        setImage(id);
        setOpenDeleteImage(true);
    };

    const handleCloseDeleteImage = () => {
        setOpenDeleteImage(false);
    };

    const handleClickBelonging = (id) => {
        props.history.push(`/rentals/${id}`);
    }

    const [belongingInfoErrors, setBelongingInfoErrors] = useState({
        name: false,
        imageUrls: false,
        category: false,
        subcategory: false,
        description: false,
        howToUse: false,
        timePrice: false,
        daily: false,
        city: false,
        district: false,
        province: false,
    })

    // const filterOptions = createFilterOptions({
    //     matchFrom: 'start',
    //     stringify: (option) => option.name,
    // });

    const [isCategoryChanged, setIsCategoryChanged] = useState(false);
    const [isCityChanged, setIsCityChanged] = useState(false);
    const [isDistrictChanged, setIsDistrictChanged] = useState(false);


    const timeSlots = Array.from(new Array(23)).map(
        // (_, index) => `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'}`,
        (_, index) => `${index + 1}`
    );

    const [minTime, setMinTime] = useState(timeSlots[0]);
    const [minDay, setMinDay] = useState(0);

    const [howToUse, setHowToUse] = useState(false);
    // const [showError, setShowError] = useState(false);

    const handleClickUpload = (event) => {
        event.currentTarget.children.item(1).click();
    }

    const [image, setImage] = useState(null);

    const handleSubmit = () => {
        let isValid = true;

        Object.keys(belongingInfoErrors).forEach(info => {
            if (typeof belongingDetails[info] !== 'number') {
                if (info !== 'imageUrls' && belongingDetails[info].trim() === '') {
                    if (
                        (info === 'howToUse' && howToUse) ||
                        (info === 'subcategory' && noSubCategory) ||
                        (info === 'district' && noDistrict) ||
                        (info === 'province' && noProvince)
                    ) {
                        setBelongingInfoErrors(prevState => ({ ...prevState, [info]: false }))
                    }

                    else {
                        setBelongingInfoErrors(prevState => ({ ...prevState, [info]: true })); isValid = false;
                    }
                }
                else if (info === 'imageUrls' && belongingDetails.imageUrls.filter(each => each !== undefined).length === 0) {
                    setBelongingInfoErrors(prevState => ({ ...prevState, [info]: true })); isValid = false;
                }
                else if ((info === 'name' || info === 'description' || info === 'howToUse') && checkBlockedWords(belongingDetails[info])) {
                    setIncludesBlockedWord(prevState => ({ ...prevState, [info]: true })); isValid = false;
                }
                else { setBelongingInfoErrors(prevState => ({ ...prevState, [info]: false })); setIncludesBlockedWord(prevState => ({ ...prevState, [info]: false })); }
            }
            else {
                if ((info === 'timePrice' && minDay >= 1) || belongingDetails[info] > 0) {
                    setBelongingInfoErrors(prevState => ({ ...prevState, [info]: false }))
                }
                else {
                    setBelongingInfoErrors(prevState => ({ ...prevState, [info]: true })); isValid = false;
                }
            }
        })

        if (isValid && belongingDetails.weekly_discount < belongingDetails.monthly_discount) {
            console.log(1)
            const filesPath = `Rents/${auth.uid}/${belongingId}/`;
            let filteredArr = belongingDetails.imageUrls.filter((elem) => typeof elem === 'object' ? true : false);

            if (filteredArr.length > 0) {

                Promise.all(filteredArr.map(each => storage.ref(filesPath + uuidv4()).put(each, { cacheControl: 'public, max-age=31536000' })))
                    .then((res) => {
                        return Promise.all(res.map(each => each.ref.getDownloadURL()));
                    })
                    .then((url) => {
                        const imageUrlsArr = [...belongingDetails.imageUrls.filter((elem) => typeof elem === 'string' ? true : false), ...url];
                        // props.postRent({ ...belongingDetails, ...Time, ...day, imageUrls: photos }, props.history);
                        props.editRentDetails(belongingId,
                            { ...belongingDetails, minTime: minTime, minDay: minDay, imageUrls: imageUrlsArr }, belongings.find(each => each.id === belongingId));
                        handleClose();
                    })
                    .catch(err => console.log(err))
            }
            else {
                console.log(2)
                props.editRentDetails(belongingId,
                    { ...belongingDetails, imageUrls: belongingDetails.imageUrls.filter(each => each !== undefined), minTime: minTime, minDay: minDay }, belongings.find(each => each.id === belongingId));
                handleClose();
            }
        }

    }

    const [imgResolutionError, setImgResolutionError] = useState({ 0: false, 1: false, 2: false, 3: false });

    const handleChangeUpload = (event) => {
        const inputIns = event.currentTarget;
        const index = Number(inputIns.name.split('-')[1]);
        if (inputIns.files[0]) {
            const img = new Image();
            img.src = URL.createObjectURL(inputIns.files[0]);
            img.onload = (e) => {
                if (e.target.naturalWidth >= e.target.naturalHeight) {
                    setImgResolutionError({ ...imgResolutionError, [index]: false });

                    imageCompression(inputIns.files[0], {
                        maxSizeMB: maxSizeMB,
                        maxWidthOrHeight: 1440,
                        useWebWorker: true,
                        initialQuality: 1
                    })
                        .then((compressedFile) => {
                            let imageUrlsArr = [...belongingDetails.imageUrls];
                            const index = Number(inputIns.name.split('-')[1]);
                            imageUrlsArr[index] = new File([compressedFile], uuidv4(), { type: compressedFile.type });
                            if (belongingInfoErrors.imageUrls) setBelongingInfoErrors({ ...belongingInfoErrors, imageUrls: false });
                            return setBelongingDetails({ ...belongingDetails, imageUrls: imageUrlsArr });
                        })
                        .catch((error) => console.log(error.message));
                }
                else {
                    setImgResolutionError({ ...imgResolutionError, [index]: true });
                    inputIns.value = null;
                }
            }
        }
    }

    const [openCategory1, setOpenCategory1] = useState(false);
    const [openCategory2, setOpenCategory2] = useState(false);

    const [openCity, setOpenCity] = useState(false);
    const [openDistrict, setOpenDistrict] = useState(false);
    const [openProvince, setOpenProvince] = useState(false);

    const [openMinTime, setOpenMinTime] = useState(false);

    const [includesBlockedWord, setIncludesBlockedWord] = useState({
        name: false,
        description: false,
        howToUse: false
    });

    let noSubCategory = false;
    let noDistrict = false;
    let noProvince = false;

    const [rentPosted, setRentPosted] = usePersistedStateSession('rentPosted', false);



    useEffect(() => {
        if (!profile.isEmpty && rentPosted) {
            props.verifyDialogOBJ.setVerifyDialogDetails({
                content: profile.verified === undefined ? 'Elanın dərc olunması üçün hesabınızı doğrulayın' : <>
                    Hesabınız doğrulandıqdan sonra elanınız dərc olunacaq <AccessTimeRoundedIcon style={{
                        color: 'rgb(30, 152, 200)',
                        verticalAlign: 'text-top'
                    }} fontSize='small' />
                </>,
                btn_text: profile.verified === undefined ? 'Doğrula' : 'Hesabım',
                openVerifyDialog: true,
                handleCloseVerifyDialog: () => {
                    props.verifyDialogOBJ.setVerifyDialogDetails((prevS) => ({...prevS, openVerifyDialog: false}));
                    setRentPosted(false);
                }
            });
        }
    }, [profile, rentPosted])

    return (
        <div className="belongings">

            <div className="belongings_Box" style={{ display: open ? 'none' : 'block' }}>
                <div className="belongings_search_section">
                    <div>
                        <h1>Əşyalarım</h1>
                        <div>
                            <SearchIcon color='primary' />
                            <input type="text" placeholder="Axtar" />
                        </div>
                    </div>
                </div>

                <div className="belongings_list">
                    {!profile.isEmpty && belongings ? Array.from(belongings).length > 0 ?
                        <>
                            {belongings.map(belonging =>
                                <Card key={belonging.id} className='belongings_listCard' elevation={4} >
                                    <div className='belonging_ImageSection'>
                                        <div className='belonging_ImageSection_Box'>
                                            <img src={belonging.imageUrls[0]}
                                                alt={belonging.name}
                                                className='belonging_ImageSection_Img'
                                                onClick={() => handleClickBelonging(belonging.id)} />
                                            <span className='belonging_ImageSection_Name'>{belonging.name}</span>
                                        </div>
                                        {profile.verified === undefined ?
                                            <div className='belonging_verificationProcess'>
                                                Elanın dərc olunması üçün hesabınızı <a href='/user#profile'>doğrulayın</a>
                                            </div>
                                            :
                                            !belonging.verified ?
                                                <div className='belonging_verificationProcess'>
                                                    Hesabınız doğrulandıqdan sonra elanınız dərc olunacaq <AccessTimeRoundedIcon fontSize='small' />
                                                </div>
                                                : null
                                        }
                                    </div>
                                    <div className='belonging_Details'>
                                        <div className='belonging_PriceSection'>
                                            <span><span>Günlük</span><span>{belonging.daily} <span className='manat'>&#8380;</span></span></span>
                                            <span><span>Həftəlik</span><span>{(belonging.weekly_discount !== 0) ? priceFormat((belonging.daily * 7 - (belonging.daily * 7 * belonging.weekly_discount / 100))) : belonging.daily * 7} <span className='manat'>&#8380;</span></span></span>
                                            <span><span>Aylıq</span><span>{(belonging.monthly_discount !== 0) ? priceFormat((belonging.daily * 30 - (belonging.daily * 30 * belonging.monthly_discount / 100))) : belonging.daily * 30} <span className='manat'>&#8380;</span></span></span>
                                        </div>
                                        <div className='belonging_InfoSection'>
                                            <span style={{ marginBottom: belonging.district ? '2.5px' : 54.5 }}>Şəhər: {belonging.city}</span>
                                            {belonging.district &&
                                                <>
                                                    <span>Rayon: {belonging.district}</span>
                                                    <span>Qəsəbə: {belonging.province}</span>
                                                </>
                                            }
                                            <span>Dəyərləndirmə: {belonging.commentCount}</span>
                                        </div>
                                        <div className='belonging_ActionSection'>
                                            <IconButton
                                                size='small'
                                                edge='end'
                                                color='secondary'
                                                className='belonging_ActionSection_Remove'
                                                onClick={() => handleClickOpenDelete(belonging)}>
                                                Sil
                                    </IconButton>
                                            <Button variant="outlined" color="primary" onClick={() => handleClickOpen(belonging)}>
                                                Düzəliş et
                                    </Button>
                                        </div>
                                    </div>
                                </Card>
                            )}
                            {belongings.length === 1 ?
                                <>
                                    <div></div>
                                    <div></div>
                                </>
                                : belongings.length === 2 ?
                                    <div></div>
                                    : null
                            }

                        </>

                        :
                        <div className='empty_Data' style={{ display: belongings.length > 0 ? 'none' : 'flex' }}>
                            <img src={require('../../Images/undraw_empty.svg')} alt='boş' />
                            <span>Əşyanız yoxdur.</span>
                        </div>
                        : null
                    }

                </div>

            </div>

            <Slide direction="right" in={open} mountOnEnter unmountOnExit exit={false}>
                {!isEmptyObject(belongingDetails) ?
                    <div className='belongingDetails_Box'>
                        <span className='belongingDetails_returnBTN' onClick={handleClose}>
                            <KeyboardBackspaceRoundedIcon style={{ color: '#149EB0', marginRight: '7.5px' }} />
                        Əşyalarıma qayıt
                    </span>
                        <span className='belongingDetails_headerTxt' >Elana düzəliş et</span>
                        <div className='belongingDetails_Grid1' >
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        error={(belongingDetails.name.trim() === '' && belongingInfoErrors.name) || includesBlockedWord.name}
                                        helperText={(belongingDetails.name.trim() === '' && belongingInfoErrors.name) ? 'Əşyanın adını daxil edin.' : includesBlockedWord.name ? 'Nömrə, email vəya sayt adı yazmaq sizin məxfiliyiniz üçün güvənli deyil.' : null}
                                        name="name"
                                        label="Əşyanın adı"
                                        fullWidth
                                        autoComplete='off'
                                        defaultValue={belongingDetails.name}
                                        onBlur={handleChange}
                                        variant='outlined'
                                        onChange={() => {
                                            if (includesBlockedWord.product) setIncludesBlockedWord({ ...includesBlockedWord, name: false })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" error={belongingDetails.category.trim() === '' && belongingInfoErrors.category}>
                                        <InputLabel id="category1_label" >Əsas Kateqoriya</InputLabel>
                                        <Select
                                            name='category1'
                                            labelId="category1_label"
                                            id="category1"
                                            open={openCategory1}
                                            value={belongingDetails.category}
                                            onOpen={() => {
                                                setOpenCategory1(true);
                                                setBelongingDetails({
                                                    ...belongingDetails,
                                                    subcategory: ''
                                                })
                                                // setIsCategoryChanged(false)
                                            }}
                                            onChange={(event) => {
                                                setBelongingDetails({
                                                    ...belongingDetails,
                                                    category: event.target.value,
                                                    subcategory: ''
                                                })

                                                setIsCategoryChanged(true);
                                            }}
                                            onClose={(event) => {
                                                setOpenCategory1(false);
                                                setIsCategoryChanged(true)
                                            }}

                                            label="Əsas Kateqoriya"
                                            MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                        >
                                            {categories.map(each => {
                                                return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                            })}

                                            <MenuItem value='Digər'>Digər</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>

                                {(isCategoryChanged && belongingDetails.category && categories.find(category => category.name === belongingDetails.category) && categories.find(category => category.name === belongingDetails.category).sub) ?
                                    <Grid item xs={12}>

                                        {noSubCategory = false}

                                        <FormControl fullWidth variant="outlined" error={belongingDetails.subcategory.trim() === '' && belongingInfoErrors.subcategory}>
                                            <InputLabel id="category2_label" >İkincil Kateqoriya</InputLabel>
                                            <Select
                                                name='category2'
                                                labelId="category2_label"
                                                id="category2"
                                                open={openCategory2}
                                                value={belongingDetails.subcategory}
                                                onOpen={() => {
                                                    setOpenCategory2(true);
                                                }}
                                                onChange={(event) => {
                                                    setBelongingDetails({
                                                        ...belongingDetails,
                                                        subcategory: event.target.value
                                                    })
                                                }}
                                                onClose={(event) => {
                                                    setOpenCategory2(false);
                                                }}
                                                label="İkincil Kateqoriya"
                                                MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                            >
                                                {categories.find(category => category.name === belongingDetails.category).sub.map(each => {
                                                    return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                })}

                                            </Select>
                                        </FormControl>

                                    </Grid>
                                    :
                                    <>
                                        {noSubCategory = true}
                                    </>
                                }

                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>

                                    <FormControl fullWidth variant="outlined" error={belongingDetails.city.trim() === '' && belongingInfoErrors.city}>
                                        <InputLabel id="city_label" >Şəhəri seçin</InputLabel>
                                        <Select
                                            name='city'
                                            labelId="city_label"
                                            id="city"
                                            open={openCity}
                                            value={belongingDetails.city}
                                            onOpen={() => {
                                                setOpenCity(true);

                                                setBelongingDetails({
                                                    ...belongingDetails,
                                                    district: ''
                                                })
                                                // setIsCityChanged(false)
                                            }}
                                            onChange={(event) => {
                                                setBelongingDetails({
                                                    ...belongingDetails,
                                                    city: event.target.value,
                                                    district: '',
                                                    province: ''
                                                })

                                                setIsCityChanged(true);
                                            }}
                                            onClose={(event) => {
                                                setOpenCity(false);
                                                setIsCityChanged(true)
                                            }}

                                            label="Şəhəri seçin"
                                            MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                        >
                                            {location.map(each => {
                                                return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                            })}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                {isCityChanged && belongingDetails.city === location[0].name ?
                                    (
                                        <>
                                            {noDistrict = false}
                                            <Grid item xs={12}>

                                                <FormControl fullWidth variant="outlined" error={belongingDetails.district.trim() === '' && belongingInfoErrors.district}>
                                                    <InputLabel id="district_label" >Rayonu seçin</InputLabel>
                                                    <Select
                                                        name='district'
                                                        labelId="district_label"
                                                        id="district"
                                                        open={openDistrict}

                                                        onOpen={() => {
                                                            setOpenDistrict(true);

                                                            setBelongingDetails({
                                                                ...belongingDetails,
                                                                province: ''
                                                            })
                                                            // setIsDistrictChanged(false)
                                                        }}
                                                        onChange={(event) => {

                                                            setBelongingDetails({
                                                                ...belongingDetails,
                                                                district: event.target.value,
                                                                province: ''
                                                            })

                                                            setIsDistrictChanged(true)

                                                        }}
                                                        onClose={(event) => {
                                                            setOpenDistrict(false);
                                                            setIsDistrictChanged(true)
                                                        }}
                                                        value={belongingDetails.district}
                                                        label="Rayonu seçin"
                                                        MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                                    >
                                                        {location[0].districts.map(each => {
                                                            return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                        })}

                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {isDistrictChanged && belongingDetails.district && location[0].districts.filter(district => district.name === belongingDetails.district)[0].sub ?
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth variant="outlined" error={belongingDetails.province.trim() === '' && belongingInfoErrors.province}>
                                                        <InputLabel id="province_label" >Qəsəbəni seçin</InputLabel>
                                                        <Select
                                                            name='province'
                                                            labelId="province_label"
                                                            id="province"
                                                            open={openProvince}
                                                            onOpen={() => setOpenProvince(true)}
                                                            onChange={(event) => {
                                                                setBelongingDetails({
                                                                    ...belongingDetails,
                                                                    province: event.target.value
                                                                })
                                                            }}
                                                            onClose={(event) => setOpenProvince(false)}
                                                            value={belongingDetails.province}
                                                            label="Qəsəbəni seçin"
                                                            MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                                        >
                                                            {location[0].districts.filter(district => district.name === belongingDetails.district)[0].sub.map(each => {
                                                                return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                            })}

                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                :
                                                <>
                                                    {noProvince = true}
                                                </>
                                            }
                                        </>
                                    )
                                    : <>
                                        {noDistrict = true}
                                        {noProvince = true}
                                    </>
                                }
                            </Grid>
                        </div>
                        <Divider variant='fullWidth' />
                        <div className='belongingDetails_Grid2' >
                            <div className='belongingDetails_TimeBox'>
                                <span>Minimum kirayə müddəti</span>
                                <div className='belongingDetails_TimeContent'>
                                    <div className='belongingDetails_TIME_box'>
                                        <span>
                                            Saat
                                </span>

                                        <FormControl
                                            size='small'
                                            style={{ width: 90 }}
                                            fullWidth
                                            variant="outlined"
                                        >
                                            <Select
                                                disabled={minDay > 0 ? true : false}
                                                value={minTime}
                                                name='minTime'
                                                labelId="minTime_label"
                                                id="minTime"
                                                open={openMinTime}
                                                onOpen={() => setOpenMinTime(true)}
                                                onChange={(event) => {
                                                    let number = Number(event.target.value);
                                                    if (number === 0) {
                                                        setMinTime(timeSlots[0]);
                                                    }
                                                    else {
                                                        setMinTime(`${number}`);
                                                    }
                                                }}
                                                onClose={(event) => setOpenMinTime(false)}

                                                MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                            >
                                                {timeSlots.map(each => {
                                                    return <MenuItem key={each} value={each}>{each}</MenuItem>
                                                })}

                                            </Select>
                                        </FormControl>


                                    </div>
                                    <div className='customBelongingDivider'></div>
                                    <div className='belongingDetails_DAY_box'>
                                        <span>
                                            Gün
                                    </span>
                                        <TextField
                                            name='minDay'
                                            defaultValue={minDay}
                                            type='number'
                                            variant="outlined"
                                            size='small'
                                            style={{ width: 90 }}
                                            onChange={(e) => {
                                                let number = Number(e.target.value);
                                                // showError !== false && setShowError(false);
                                                let timePriceInp = document.getElementsByName('timePrice')[0];

                                                if (number > 0) {
                                                    setMinTime('');
                                                    if (number <= 1000) {
                                                        timePriceInp.value = 0;
                                                        timePriceInp.disabled = true;
                                                        timePriceInp.parentElement.parentElement.style.backgroundColor = '#E0E0E0';
                                                        setMinDay(number);
                                                        setBelongingDetails({ ...belongingDetails, timePrice: 0 });
                                                    }
                                                    else {
                                                        number = 1000
                                                        e.target.value = number;
                                                        setMinDay(number);
                                                    }
                                                }
                                                else if (number === 0) {
                                                    timePriceInp.disabled = false;
                                                    timePriceInp.parentElement.parentElement.style.backgroundColor = 'initial';
                                                    setMinTime(timeSlots[0])
                                                    setMinDay(number);
                                                }
                                                else {
                                                    number = 0;
                                                    e.target.value = number;
                                                    setMinDay(number);
                                                }

                                            }} />

                                    </div>
                                </div>
                            </div>
                        </div>
                        <Divider variant='fullWidth' />
                        <div className='belongingDetails_Grid3' >
                            <h4>Qiymət</h4>
                            <div className='belongingDetails_Grid3_box' >

                                <div className='belongingDetails_PRICE_box'>
                                    <span>
                                        Saatlıq
                                    </span>
                                    <TextField
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" >
                                                <span className='manat' style={{ fontSize: '1rem' }}>
                                                    &#8380;
                                            </span>
                                            </InputAdornment>,
                                        }}

                                        name='timePrice'
                                        error={belongingDetails.timePrice === 0 && minDay === 0}
                                        disabled={minDay > 0}
                                        defaultValue={belongingDetails.timePrice}
                                        type='number'
                                        variant='outlined'
                                        // variant={minDay > 0 ? 'standard' : 'outlined'}
                                        // disabled={minDay > 0 ? true : false}
                                        size='small'
                                        style={{ width: 95 }}
                                        onChange={(e) => {
                                            let number = Number(e.target.value);
                                            // showError !== false && setShowError(false);
                                            if (number >= 0) {
                                                setBelongingDetails({ ...belongingDetails, timePrice: number });
                                            }
                                            else {
                                                number = 0;
                                                e.target.value = number;
                                                setBelongingDetails({ ...belongingDetails, timePrice: number });
                                            }
                                        }}
                                    />
                                </div>
                                <div className='belongingDetails_PRICE_box'>
                                    <span>
                                        Günlük
                                    </span>
                                    <TextField
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" >
                                                <span className='manat' style={{ fontSize: '1rem' }}>
                                                    &#8380;
                                            </span>
                                            </InputAdornment>,
                                        }}
                                        name='daily'
                                        defaultValue={belongingDetails.daily}
                                        type='number'
                                        variant="outlined"
                                        size='small'
                                        style={{ width: 95 }}
                                        onChange={(e) => {
                                            let number = Number(e.target.value);
                                            // showError !== false && setShowError(false);
                                            if (number >= 0) {
                                                setBelongingDetails({ ...belongingDetails, daily: number });
                                            }
                                            else {
                                                number = 0;
                                                e.target.value = number;
                                                setBelongingDetails({ ...belongingDetails, daily: number });
                                            }
                                        }} />
                                </div>
                                <div className='belongingDetails_PRICE_box'>
                                    <span>
                                        Həftəlik endirim faizi
                                    </span>
                                    <TextField
                                        error={belongingDetails.weekly_discount > belongingDetails.monthly_discount}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" >
                                                %
                                        </InputAdornment>,
                                        }}
                                        name='weekly_discount'
                                        defaultValue={belongingDetails.weekly_discount}
                                        type='number'
                                        variant="outlined"
                                        size='small'
                                        style={{ width: 95 }}
                                        onChange={(e) => {
                                            let number = Number(e.target.value);
                                            // showError !== false && setShowError(false);
                                            if (number >= 0) {
                                                setBelongingDetails({ ...belongingDetails, weekly_discount: number });
                                            }
                                            else {
                                                number = 0;
                                                e.target.value = number;
                                                setBelongingDetails({ ...belongingDetails, weekly_discount: number });
                                            }
                                        }} />
                                </div>
                                <div className='belongingDetails_PRICE_box'>
                                    <span>
                                        Aylıq endirim faizi
                                    </span>
                                    <TextField
                                        error={belongingDetails.weekly_discount > belongingDetails.monthly_discount}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" >
                                                %
                                        </InputAdornment>,
                                        }}
                                        name='monthly_discount'
                                        defaultValue={belongingDetails.monthly_discount}
                                        type='number'
                                        variant="outlined"
                                        size='small'
                                        style={{ width: 95 }}
                                        onChange={(e) => {
                                            let number = Number(e.target.value);
                                            // showError !== false && setShowError(false);
                                            if (number >= 0) {
                                                if (number <= 100) {
                                                    setBelongingDetails({ ...belongingDetails, monthly_discount: number });
                                                }
                                                else {
                                                    number = 100;
                                                    e.target.value = number;
                                                    setBelongingDetails({ ...belongingDetails, monthly_discount: number });
                                                }

                                            }
                                            else {
                                                number = 0;
                                                e.target.value = number;
                                                setBelongingDetails({ ...belongingDetails, monthly_discount: number });
                                            }
                                        }} />
                                </div>

                            </div>
                            {belongingDetails.weekly_discount > belongingDetails.monthly_discount && <div className='helperText center_text'>Aylıq endirim faizi Həftəlik-dən kiçik ola bilməz.</div>}
                        </div>
                        <Divider variant='fullWidth' />
                        <div className='belongingDetails_Grid4'>
                            <div className='belongingDetails_Grid4_Elems'>
                                <h4>
                                    Əşyanın təsviri
                                    </h4>
                                <TextField
                                    name="description"
                                    // label="Məlumat"
                                    multiline
                                    rows={7}
                                    placeholder="Kirayə vermək istədiyiniz əşya barədə məlumat verin"
                                    variant="outlined"
                                    fullWidth
                                    defaultValue={belongingDetails.description}
                                    error={(belongingDetails.description.trim() === '' && belongingInfoErrors.description) || includesBlockedWord.description}
                                    helperText={(belongingDetails.description.trim() === '' && belongingInfoErrors.description) ? 'Əşya barədə məlumat daxil edin.' : includesBlockedWord.description ? 'Nömrə, email vəya sayt adı yazmaq sizin məxfiliyiniz üçün güvənli deyil.' : null}
                                    onBlur={handleChange}
                                    onChange={() => {
                                        if (includesBlockedWord.description) setIncludesBlockedWord({ ...includesBlockedWord, description: false })
                                    }}
                                />
                            </div>
                            <div className='belongingDetails_Grid4_Elems'>
                                <h4>
                                    İşlənmə qaydası
                                    </h4>
                                <TextField
                                    name="howToUse"
                                    // label="İşlənmə qaydası"
                                    multiline
                                    rows={7}
                                    disabled={howToUse}
                                    defaultValue={belongingDetails.howToUse}
                                    placeholder="Kirayə vermək istədiyiniz əşyanın istifadə qaydası barədə məlumat verin"
                                    variant={howToUse ? "filled" : 'outlined'}
                                    fullWidth
                                    error={(belongingDetails.howToUse.trim() === '' && howToUse === false && belongingInfoErrors.howToUse) || includesBlockedWord.howToUse}
                                    helperText={(belongingDetails.howToUse.trim() === '' && howToUse === false && belongingInfoErrors.howToUse) ? 'Əşyanın işlənmə qaydası barədə məlumat daxil edin.' : includesBlockedWord.howToUse ? 'Nömrə, email vəya sayt adı yazmaq sizin məxfiliyiniz üçün güvənli deyil.' : null}
                                    onBlur={handleChange}
                                    onChange={() => {
                                        if (includesBlockedWord.howToUse) setIncludesBlockedWord({ ...includesBlockedWord, howToUse: false })
                                    }}
                                />

                                <FormControlLabel
                                    control={<Checkbox checked={howToUse} onChange={() => {
                                        setHowToUse((previous) => !previous);
                                        setBelongingDetails({ ...belongingDetails, howToUse: '' });
                                        setIncludesBlockedWord(prevState => ({ ...prevState, howToUse: false }));
                                    }} color="primary" />}
                                    label="Xüsusi istifadə qaydası yoxdur."
                                />
                            </div>
                        </div>
                        <Divider variant='fullWidth' />
                        <div className='belongingDetails_Grid5'>
                            <h4>Şəkillər</h4>
                            <div className='belongingDetails_Grid5_box'>
                                {Array.from(new Array(4)).map((_, index) =>
                                    <Fragment key={`image-${index}`}>
                                        {belongingDetails.imageUrls && belongingDetails.imageUrls[index] ?
                                            <div className='belongingDetails_Grid5_box_Elems' onClick={() => handleClickOpenDeleteImage(index)}>
                                                <img src={typeof belongingDetails.imageUrls[index] === 'object' ? URL.createObjectURL(belongingDetails.imageUrls[index]) : belongingDetails.imageUrls[index]} />
                                                <div className='belongingDetails_Grid5_box_img_remove'>
                                                    Sil
                                                <CloseRoundedIcon style={{ fontSize: '3rem', color: 'red' }} />
                                                </div>
                                            </div>
                                            :
                                            <div
                                                className='belongingDetails_Grid5_box_Elems belongingDetails_emptyBox'
                                                onClick={(handleClickUpload)}
                                            >
                                                <PhotoLibraryIcon fontSize='large' />
                                            Şəkil əlavə et
                                            <input type='file' accept='images/*' name={`imageInput-${index}`} hidden onChange={handleChangeUpload} />
                                                {imgResolutionError[index] &&
                                                    <p className='belongings_ResolutionError'>Şəklin hündürlüyünün genişliyindən böyük olmamasına diqqət yetirin</p>
                                                }
                                            </div>
                                        }
                                    </Fragment>
                                )
                                }

                            </div>
                        </div>

                        {belongingInfoErrors.imageUrls && <div className='belongings_ImageError'>Minimum 1 şəkil yerləşdirilmiş olmalıdır.</div>}

                        <div className='belongings_EditSave_box'>
                            <Button variant='contained' className='skyColor_btn belongings_EditSave' onClick={handleSubmit}>
                                Yadda Saxla
                    </Button>
                        </div>
                    </div>
                    :
                    <>
                    </>
                }
            </Slide>

            <Dialog
                open={openDelete}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDelete}
                aria-labelledby="form-dialog"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle ><span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WarningRoundedIcon fontSize='large' style={{ color: '#FF6600', marginRight: 10, marginTop: '-1.5px' }} /></span></DialogTitle>
                <DialogContent dividers>
                    <DialogContentText id="alert-dialog-slide-description" style={{ marginBottom: 0 }}>
                        Elanı silmək istədiyinizdən əminsinizmi?
                                                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} color="primary">
                        Geriyə
                            </Button>
                    <Button onClick={() => {
                        props.deleteRent(belongingId);
                        handleCloseDelete();
                    }}
                        color="secondary">
                        Sil
                            </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDeleteImage}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDeleteImage}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title"><span style={{ display: 'flex', alignItems: 'center' }}><WarningRoundedIcon style={{ color: '#FF6600', marginRight: 10, marginTop: '-1.5px' }} />Diqqət</span></DialogTitle>
                <DialogContent dividers>
                    <DialogContentText id="alert-dialog-slide-description" style={{ marginBottom: 0 }}>
                        Şəkli silmək istədiyinizdən əminsinizmi?
                                                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteImage} color="primary">
                        Geriyə
                            </Button>
                    <Button onClick={() => {
                        let imageUrlsArr = [...belongingDetails.imageUrls];
                        imageUrlsArr[image] = undefined;
                        setBelongingDetails({ ...belongingDetails, imageUrls: imageUrlsArr });

                        handleCloseDeleteImage();
                    }}
                        color="secondary">
                        Sil
                            </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}


const mapStateToProps = (state) => ({
    // user: state.user,
    belongings: state.firestore.ordered.belongings,
    auth: state.firebase.auth,
    profile: state.firebase.profile
})

const mapActionsToProps = { editRentDetails, deleteRent };

Belongings.propTypes = {
    // user: PropTypes.object.isRequired,
    editRentDetails: PropTypes.func.isRequired,
    deleteRent: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapActionsToProps)(Belongings);


// export default compose(
//     withFirestore,
//     connect(mapStateToProps, mapActionsToProps)
// )(Belongings);