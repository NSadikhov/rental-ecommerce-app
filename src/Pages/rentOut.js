import React, { useState, useEffect } from 'react';
import '../Css/rentOut.css';

// import ImageUploader from "react-images-upload";
// import Dropzone from 'react-dropzone-uploader'
// import axios from 'axios';
import InputAdornment from '@material-ui/core/InputAdornment';
// import { Switch } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
// import { KeyboardDatePicker, DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import { createFilterOptions } from '@material-ui/lab/Autocomplete';
// import DateFnsUtils from '@date-io/date-fns';
// import azLocale from "date-fns/locale/az";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { postRent } from '../Redux/actions/dataActions';

import { useFirebase } from 'react-redux-firebase';

import ImageUploading from 'react-images-uploading';

import imageCompression from 'browser-image-compression';

import Tooltip from '@material-ui/core/Tooltip';

import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import AddAPhotoRoundedIcon from '@material-ui/icons/AddAPhotoRounded';
import Divider from '@material-ui/core/Divider';
// import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';

import { categories, location, maxSizeMB, pageTitlesAndDescriptions } from '../dbSchema';

// import { firebase } from '../Firebase';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { checkBlockedWords, priceFormat, usePersistedStateSession } from '../util';
import { Helmet } from 'react-helmet';

function getSteps() {
    return ['Birinci add??m', '??kinci add??m', '??????nc?? add??m', 'Son add??m'];
}

const RentOut = (props) => {

    const firebaseIns = useFirebase();

    const [activeStep, setActiveStep] = useState(1);
    const steps = getSteps();

    const { auth } = props;

    // const [pictures, setPictures] = useState([]);

    useEffect(() => {
        if (window.location.hash) {
            if (rentInfo.product.trim() !== '') {
                const step = Number(window.location.hash.split('#')[1]);
                (activeStep !== step) && setActiveStep(step)
            }
            else {
                setActiveStep(1)
                props.history.replace('/rent-out')
            }
        }
        else {
            setActiveStep(1)
        }
        window.scrollTo(0, 0);
    }, [props.location.hash])

    const [rentInfo, setRentInfo] = useState({
        product: '',
        imageUrls: [],
        category: '',
        subcategory: '',
        description: '',
        howToUse: '',
        timePrice: 0,
        daily: 0,
        weekly_discount: 5,
        monthly_discount: 10,
        city: '',
        district: '',
        province: '',
        // minTime: 0,
        // maxTime: 0,
        // minDay: 0,
        // maxDay: 0,
    })

    const [rentInfoErrors, setRentInfoErrors] = useState({
        product: false,
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

    // const onDrop = (files ,pictures) => {
    //     console.log(pictures);
    //     setRentInfo({ ...rentInfo, imageUrls: pictures });
    // };

    // const [images, setImages] = useState([]);
    const maxNumber = 4;

    const onImageChange = (imageList, addUpdateIndex) => {
        // data for submit
        // console.log(imageList);
        // console.log(addUpdateIndex);

        setRentInfo({ ...rentInfo, imageUrls: imageList });
    };

    const handleChange = (event) => {

        // let value;
        // if (event.currentTarget.type === 'number') {
        //     value = (Number(event.currentTarget.value) < 0) ?
        //         0 :
        //         Number(event.currentTarget.value) % 1 !== 0 ?
        //             Number(event.currentTarget.value.toFixed(0)) :
        //             Number(event.currentTarget.value);
        // }
        // else {
        //     value = event.currentTarget.value;
        // }

        setRentInfo({
            ...rentInfo,
            [event.currentTarget.name]: event.currentTarget.value
        });
    }

    const handleChangeWeeklyDiscount = (event) => {
        let value = Number(event.currentTarget.value);

        if (value > 100) {
            value = 100;
            setRentInfo({
                ...rentInfo,
                [event.currentTarget.name]: value
            });
        }
        else if (value < 0) {
            value = 0;
            setRentInfo({
                ...rentInfo,
                [event.currentTarget.name]: value
            });
        }
        else {

            if (value <= rentInfo.monthly_discount) {
                setMonthlyDiscountError(false);
            }
            else {
                setMonthlyDiscountError(true);
            }

            setRentInfo({
                ...rentInfo,
                [event.currentTarget.name]: value
            });
        }

        event.currentTarget.value = value % 1 !== 0 ?
            Number(event.currentTarget.value).toFixed(0) :
            Number(event.currentTarget.value);

    }

    const [monthlyDiscountError, setMonthlyDiscountError] = useState(false);

    const handleChangeMonthlyDiscount = (event) => {
        let value = Number(event.currentTarget.value);

        if (value > 100) {
            value = 100;
            setRentInfo({
                ...rentInfo,
                [event.currentTarget.name]: value
            });
        }
        else if (value < 0) {
            value = 0;
            setRentInfo({
                ...rentInfo,
                [event.currentTarget.name]: value
            });
        }
        else if (value < rentInfo.weekly_discount) {
            setMonthlyDiscountError(true);

            setRentInfo({
                ...rentInfo,
                [event.currentTarget.name]: value
            });
        }
        else {
            setMonthlyDiscountError(false)

            setRentInfo({
                ...rentInfo,
                [event.currentTarget.name]: value
            });
        }

        event.currentTarget.value = value % 1 !== 0 ?
            Number(event.currentTarget.value).toFixed(0) :
            Number(event.currentTarget.value);
    }

    const [isAllowed, setIsAllowed] = useState(true);

    const handleSubmit = () => {

        if (!showError && isAllowed) {
            setIsAllowed(false);
            setRentPosted(true);
            props.postRent({ ...rentInfo, minTime, minDay }, props.history);
        }

    }

    const handleNext = (keyArray) => {
        let isValid = true;

        Array.from(keyArray).forEach(info => {
            if (typeof rentInfo[info] !== 'number') {
                if (info !== 'imageUrls' && rentInfo[info].trim() === '') {
                    if (
                        (info === 'howToUse' && howToUse) ||
                        (info === 'subcategory' && noSubCategory) ||
                        (info === 'district' && noDistrict) ||
                        (info === 'province' && noProvince)
                    ) {
                        setRentInfoErrors(prevState => ({ ...prevState, [info]: false }))
                    }
                    else {
                        setRentInfoErrors(prevState => ({ ...prevState, [info]: true })); isValid = false;
                    }
                }
                else if (info === 'imageUrls' && rentInfo[info].length === 0) {
                    setRentInfoErrors(prevState => ({ ...prevState, [info]: true })); isValid = false;
                }
                else if ((info === 'product' || info === 'description' || info === 'howToUse') && checkBlockedWords(rentInfo[info])) {
                    setIncludesBlockedWord(prevState => ({ ...prevState, [info]: true })); isValid = false;
                }
                else { setRentInfoErrors(prevState => ({ ...prevState, [info]: false })); setIncludesBlockedWord(prevState => ({ ...prevState, [info]: false })) }
            }
            else {
                if ((info === 'timePrice' && minDay >= 1) || rentInfo[info] > 0) {
                    setRentInfoErrors(prevState => ({ ...prevState, [info]: false }))
                }
                else {
                    setRentInfoErrors(prevState => ({ ...prevState, [info]: true })); isValid = false;
                }
            }
        })

        // if (checkBlockedWords(rentInfo.description)) { setRentInfoErrors(prevState => ({ ...prevState, description: true })); isValid = false }

        if (isValid && !showError && !monthlyDiscountError) {
            if (keyArray.find(val => val === 'imageUrls')) {
                let tempCompressedArr = [];
                rentInfo.imageUrls.forEach(image => {
                    imageCompression(image.file, {
                        maxSizeMB: maxSizeMB,
                        maxWidthOrHeight: 1440,
                        useWebWorker: true,
                        initialQuality: 1
                    })
                        .then((compressedFile) => {
                            return tempCompressedArr.push({ data_url: image.data_url, file: compressedFile });
                        })
                        .then(() => {
                            if (tempCompressedArr.length === rentInfo.imageUrls.length) {
                                setRentInfo({ ...rentInfo, imageUrls: tempCompressedArr });
                            }
                        })
                        .catch((error) => console.log(error.message));
                })
            }

            let isFirst = true;
            setActiveStep((prevActiveStep) => {
                if (isFirst) {
                    let step = prevActiveStep + 1;
                    props.history.push('/rent-out#' + (step));
                    isFirst = false;
                }
                return prevActiveStep + 1
            });

        }
    };

    const handleBack = () => {
        let isFirst = true;
        setActiveStep((prevActiveStep) => {
            if (isFirst) {
                props.history.push('/rent-out#' + (prevActiveStep - 1));
                isFirst = false;
            }
            return prevActiveStep - 1
        });

    };

    const timeSlots = Array.from(new Array(23)).map(
        // (_, index) => `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'}`,
        (_, index) => `${index + 1}`
    );

    const [minTime, setMinTime] = useState(timeSlots[0]);
    const [minDay, setMinDay] = useState(0);

    const [howToUse, setHowToUse] = useState(false);
    const [showError, setShowError] = useState(false);

    let noSubCategory = false;
    let noDistrict = false;
    let noProvince = false;

    let noTimePrice = false;

    const [includesBlockedWord, setIncludesBlockedWord] = useState({
        product: false,
        description: false,
        howToUse: false
    });

    const [rentPosted, setRentPosted] = usePersistedStateSession('rentPosted', false);

    function getStepContent(stepIndex) {
        return (<>
            <div className='rentOut_stepContent' index={1} style={{ display: !(stepIndex === 1) && 'none' }}>
                <div className="left">
                    <Grid container spacing={3}>

                        {/* <input type="file" onChange={fileChangedHandler} /> */}

                        <Grid item xs={12}>

                            {/* <img src={imgRszBfr} height={300} width={225} />
                        
                                <img src={imgRsz} /> */}

                            <TextField
                                onBlur={handleChange}
                                error={(rentInfo.product.trim() === '' && rentInfoErrors.product) || includesBlockedWord.product}
                                helperText={(rentInfo.product.trim() === '' && rentInfoErrors.product) ? '????yan??n ad??n?? daxil edin.' : includesBlockedWord.product ? 'N??mr??, email v??ya sayt ad?? yazmaq sizin m??xfiliyiniz ??????n g??v??nli deyil.' : null}
                                name="product"
                                label="????yan??n ad??"
                                variant="outlined"
                                fullWidth
                                autoComplete='off'
                                placeholder="Kiray?? verm??k ist??diyiniz ????yan??n ad??"
                                onChange={() => {
                                    if (includesBlockedWord.product) setIncludesBlockedWord({ ...includesBlockedWord, product: false })
                                }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete='off'
                                onBlur={handleChange}
                                name="description"
                                label="M??lumat"
                                multiline
                                rows={5}
                                placeholder="Kiray?? verm??k ist??diyiniz ????ya bar??d?? m??lumat verin"
                                variant="outlined"
                                fullWidth
                                error={(rentInfo.description.trim() === '' && rentInfoErrors.description) || includesBlockedWord.description}
                                helperText={(rentInfo.description.trim() === '' && rentInfoErrors.description) ? '????ya bar??d?? m??lumat daxil edin.' : includesBlockedWord.description ? 'N??mr??, email v??ya sayt ad?? yazmaq sizin m??xfiliyiniz ??????n g??v??nli deyil.' : null}
                                onChange={() => {
                                    if (includesBlockedWord.description) setIncludesBlockedWord({ ...includesBlockedWord, description: false })
                                }} />
                        </Grid>
                        <Grid item xs={12}>


                            <TextField
                                autoComplete='off'
                                name="howToUse"
                                label="????l??nm?? qaydas??"
                                multiline
                                rows={5}
                                // onFocus={(event) => { event.preventDefault(); }}
                                // inputProps={{ onBlur: (event) => event.preventDefault() }}
                                disabled={howToUse}
                                placeholder="Kiray?? verm??k ist??diyiniz ????yan??n i??l??nm?? qaydas?? bar??d?? m??lumat verin"
                                variant={howToUse ? "filled" : 'outlined'}
                                fullWidth
                                error={(rentInfo.howToUse.trim() === '' && howToUse === false && rentInfoErrors.howToUse) || includesBlockedWord.howToUse}
                                helperText={(rentInfo.howToUse.trim() === '' && howToUse === false && rentInfoErrors.howToUse) ? '????yan??n i??l??nm?? qaydas?? bar??d?? m??lumat daxil edin.' : includesBlockedWord.howToUse ? 'N??mr??, email v??ya sayt ad?? yazmaq sizin m??xfiliyiniz ??????n g??v??nli deyil.' : null}
                                // onChange={handleChange}
                                onBlur={handleChange}
                                onChange={() => {
                                    if (includesBlockedWord.howToUse) setIncludesBlockedWord({ ...includesBlockedWord, howToUse: false })
                                }} />

                            <FormControlLabel
                                control={<Checkbox checked={howToUse} onChange={() => { setHowToUse((previous) => !previous); setIncludesBlockedWord({ ...includesBlockedWord, howToUse: false }); setRentInfo({ ...rentInfo, howToUse: '' }) }} color="primary" />}
                                label="X??susi istifad?? qaydas?? yoxdur."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container justify='flex-end'>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            handleNext(['product', 'description', 'howToUse']);
                                        }}>
                                        N??vb??ti
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <div className="right" >

                    <div className="advices">
                        <div className='advices_title'>
                            <img src={require('../Images/idea.png')} alt="" />
                            <h1>M??sl??h??tl??r</h1>
                        </div>
                        <div>
                            <h4>1. Ad</h4>
                            <span>
                                ????yan??n n?? oldu??unu v?? modelini qeyd edin hans?? ki, elan??n??z bu ba??l??qla yarad??lacaq. Diqq??t
                                ????kici v?? axtar??lan ad qoyma??a ??al??????n.
                                    </span>
                        </div>
                        <div>
                            <h4>2. T??svir</h4>
                            <span>
                                ????yan??z??n ??z??llikl??rini v?? ??st??nl??kl??rini vur??ulay??n. M????t??ril??r sizin ????yada ??n ??ox n??yi g??rm??k
                                ist??y??rl??r sual??na cavab tap??n v?? bu x??susiyy??ti qabard??n.
                                    </span>
                        </div>
                        <div>
                            <h4>3. ???? prinsipi</h4>
                            <span>
                                ??g??r varsa ????yan??z??n x??susi i??l??tm?? qaydas?? v?? yaxud hans??sa funksiyas??ndan nec?? yararlanmaq
                                laz??m oldu??unu t??svir edin.
                                    </span>
                        </div>


                    </div>

                </div>
            </div>
            <div className='rentOut_stepContent' index={2} style={{ display: !(stepIndex === 2) && 'none' }}>
                <div className="left">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <ImageUploading
                                multiple
                                value={rentInfo.imageUrls}
                                onChange={onImageChange}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                                // acceptType={['jpg', 'jpeg', 'png']}
                                resolutionType="landscape"
                                resolutionWidth={3}
                                resolutionHeight={2}
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                    errors
                                }) => (
                                    // write your building UI
                                    <div className="upload__image-wrapper" {...dragProps} style={isDragging ? { borderColor: '' } : null}>
                                        {/* <img src={require('../Images/Upload-Icon.svg')} /> */}
                                        <img src={require('../Images/undraw_images.svg')} />
                                        <button
                                            className='rentOut_uploadBtn'
                                            onClick={onImageUpload}
                                        >
                                            klikl??yin v?? ya s??kili ??z??rin?? burax??n
                                                </button>
                                        {errors &&
                                            <div className='rentOut_upload_errors'>
                                                {errors.maxNumber && <span>Sad??c?? 4 ????kil?? icaz?? verilir</span>}
                                                {errors.acceptType && <span>Se??ilmi?? fayl??n tipi d??zg??n deyil</span>}
                                                {/* {errors.maxFileSize && <span>Selected file size exceed maxFileSize</span>} */}
                                                {errors.resolution && <span>????klin h??nd??rl??y?? geni??liyind??n b??y??k olmamal??d??r</span>}
                                            </div>
                                        }
                                        {/* <button onClick={onImageRemoveAll}>B??t??n ????kill??ri sil</button> */}
                                        <div className='rentOut_imageContainer'>
                                            {imageList.map((image, index) => (
                                                <div key={index} className="rentOut_image-item">
                                                    <img src={image.data_url} alt="" width="100" />

                                                    <Tooltip title='D??yi??dir' placement="left" arrow >
                                                        <button onClick={() => onImageUpdate(index)} className='rentOut_image-item_Update'><AddAPhotoRoundedIcon /> </button>
                                                    </Tooltip>
                                                    <Tooltip title='Sil' placement="right" arrow >
                                                        <button onClick={() => onImageRemove(index)} className='rentOut_image-item_Cancel'><CloseRoundedIcon /> </button>
                                                    </Tooltip>
                                                </div>
                                            ))}
                                        </div>
                                        {rentInfo.imageUrls.length === 0 && rentInfoErrors.imageUrls && rentInfoErrors.imageUrls && <div className='helperText' >????kil ??lav?? edin.</div>}

                                        <span className='rentOut_upload_advice'>????klin h??nd??rl??y??n??n geni??liyind??n b??y??k olmamas??na diqq??t yetirin</span>

                                    </div>

                                )}
                            </ImageUploading>

                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" error={rentInfo.category.trim() === '' && rentInfoErrors.category}>
                                        <InputLabel id="category1_label" >??sas Kateqoriya</InputLabel>
                                        <Select
                                            name='category1'
                                            labelId="category1_label"
                                            id="category1"
                                            open={openCategory1}

                                            onOpen={() => {
                                                setOpenCategory1(true);
                                                setRentInfo({
                                                    ...rentInfo,
                                                    subcategory: ''
                                                })
                                                // setIsCategoryChanged(false)
                                            }}
                                            onChange={(event) => {
                                                setRentInfo({
                                                    ...rentInfo,
                                                    category: event.target.value,
                                                    subcategory: ''
                                                })

                                                setIsCategoryChanged(true);
                                            }}
                                            onClose={(event) => {
                                                setOpenCategory1(false);
                                                setIsCategoryChanged(true)
                                            }}

                                            label="??sas Kateqoriya"
                                            MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                        >
                                            {categories.map(each => {
                                                return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                            })}

                                            <MenuItem value='Dig??r'>Dig??r</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>

                                {(isCategoryChanged && rentInfo.category && categories.find(category => category.name === rentInfo.category) && categories.find(category => category.name === rentInfo.category).sub) ?
                                    <Grid item xs={12}>
                                        {noSubCategory = false}

                                        <FormControl fullWidth variant="outlined" error={rentInfo.subcategory.trim() === '' && rentInfoErrors.subcategory}>
                                            <InputLabel id="category2_label" >??kincil Kateqoriya</InputLabel>
                                            <Select
                                                name='category2'
                                                labelId="category2_label"
                                                id="category2"
                                                open={openCategory2}
                                                onOpen={() => {
                                                    setOpenCategory2(true);
                                                }}
                                                onChange={(event) => {
                                                    setRentInfo({
                                                        ...rentInfo,
                                                        subcategory: event.target.value
                                                    })
                                                }}
                                                onClose={(event) => {
                                                    setOpenCategory2(false);
                                                }}
                                                label="??kincil Kateqoriya"
                                                MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                                value={rentInfo.subcategory}
                                            >
                                                {categories.find(category => category.name === rentInfo.category).sub.map(each => {
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
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container justify='space-between'>
                                <Grid item>
                                    <Button variant="contained" color="default" onClick={handleBack}>
                                        Geri
                                            </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            handleNext(['imageUrls', 'category', 'subcategory']);
                                        }}>
                                        N??vb??ti
                                        </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <div className="right" >
                    <div className='rentOut_phoneAdvice'>
                        <div>
                            <img src={require('../Images/undraw_vertical.svg')} />
                            <img src={require('../Images/icons-unavailable-240.svg')} />
                        </div>
                        <div>
                            <img src={require('../Images/undraw_horizontal.svg')} />
                            <img src={require('../Images/success-green-check-mark.svg')} />
                        </div>
                    </div>
                    <div className="advices">
                        <div className='advices_title'>
                            <img src={require('../Images/idea.png')} alt="" />
                            <h1>M??sl??h??tl??r</h1>
                        </div>

                        {/* <div>
                            <h4>1. Orijinall??q</h4>
                            <span>
                                ????yan??n ??z ????klini yerl????dirin, bel?? ki, internetd??n tapd??????n??z ??ablon ????kli yerl????dirm??yiniz
                                effektiv olmayacaq. M????t??ril??r ????yan??n ??z ????klini g??rd??kd?? daha ??ox g??v??nirl??r v?? siz daha ??ox
                                t??klif q??bul ed??c??ksiniz.
                            </span>
                        </div> */}
                        <div>
                            <h4>1. Keyfiyy??t</h4>
                            <span>
                                ????kill??ri yax???? i????qland??r??lm???? (yax???? olarki, g??norta vaxt??) m??kanda ????kin. Keyfiyy??tli ????kil, daha
                                ??ox m????t??ri v?? daha ??ox g??lir dem??kdir.
                            </span>
                        </div>
                    </div>

                </div>
            </div>
            <div className='rentOut_stepContent' index={3} style={{ display: !(stepIndex === 3) && 'none' }}>
                <div className="left">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" error={rentInfo.city.trim() === '' && rentInfoErrors.city}>
                                <InputLabel id="city_label" >????h??ri se??in</InputLabel>
                                <Select
                                    name='city'
                                    labelId="city_label"
                                    id="city"
                                    open={openCity}

                                    onOpen={() => {
                                        setOpenCity(true);

                                        setRentInfo({
                                            ...rentInfo,
                                            district: ''
                                        })
                                        // setIsCityChanged(false)
                                    }}
                                    onChange={(event) => {
                                        setRentInfo({
                                            ...rentInfo,
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

                                    label="????h??ri se??in"
                                    MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                >
                                    {location.map(each => {
                                        return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                    })}

                                </Select>
                            </FormControl>
                        </Grid>
                        {isCityChanged && rentInfo.city === location[0].name ?
                            (
                                <>
                                    {noDistrict = false}
                                    <Grid item xs={12}>
                                        <FormControl fullWidth variant="outlined" error={rentInfo.district.trim() === '' && rentInfoErrors.district}>
                                            <InputLabel id="district_label" >Rayonu se??in</InputLabel>
                                            <Select
                                                name='district'
                                                labelId="district_label"
                                                id="district"
                                                open={openDistrict}

                                                onOpen={() => {
                                                    setOpenDistrict(true);

                                                    setRentInfo({
                                                        ...rentInfo,
                                                        province: ''
                                                    })
                                                    // setIsDistrictChanged(false)
                                                }}
                                                onChange={(event) => {

                                                    setRentInfo({
                                                        ...rentInfo,
                                                        district: event.target.value,
                                                        province: ''
                                                    })

                                                    setIsDistrictChanged(true)

                                                }}
                                                onClose={(event) => {
                                                    setOpenDistrict(false);
                                                    setIsDistrictChanged(true)
                                                }}
                                                value={rentInfo.district}
                                                label="Rayonu se??in"
                                                MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                            >
                                                {location[0].districts.map(each => {
                                                    return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                })}

                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {isDistrictChanged && rentInfo.district && location[0].districts.filter(district => district.name === rentInfo.district)[0].sub ?
                                        <Grid item xs={12}>
                                            {noProvince = false}
                                            <FormControl fullWidth variant="outlined" error={rentInfo.province.trim() === '' && rentInfoErrors.province}>
                                                <InputLabel id="province_label" >Q??s??b??ni se??in</InputLabel>
                                                <Select
                                                    name='province'
                                                    labelId="province_label"
                                                    id="province"
                                                    open={openProvince}
                                                    onOpen={() => setOpenProvince(true)}
                                                    onChange={(event) => {
                                                        setRentInfo({
                                                            ...rentInfo,
                                                            province: event.target.value
                                                        })
                                                    }}
                                                    onClose={(event) => setOpenProvince(false)}
                                                    value={rentInfo.province}
                                                    label="Q??s??b??ni se??in"
                                                    MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                                >
                                                    {location[0].districts.filter(district => district.name === rentInfo.district)[0].sub.map(each => {
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
                        <Grid item xs={12}>
                            <Divider variant='fullWidth' />
                        </Grid>
                        <Grid item xs={12}>
                            <h3 className='rentOut_MinMaxHeaderTxt'>Kiray?? m??dd??ti</h3>
                            <h4>
                                Minimum
                            </h4>
                            <span className='rentOut_MinMaxSpan'>
                                ????yan??z?? ??n q??sa hans?? m??dd??t?? kiray?? verirsiniz?
                            </span>

                            <div className='rentOut_MinMaxBox'>
                                <div className='rentOut_MinMax_time'>
                                    <FormControl
                                        size='small'
                                        style={{ width: 70, marginRight: 10 }}
                                        fullWidth
                                        variant="standard"
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

                                    <span>
                                        saat
                                </span>

                                </div>
                                <div className='customDivider' />
                                <div className='rentOut_MinMax_day'>

                                    <TextField
                                        autoComplete='off'
                                        name='minDay'
                                        defaultValue={minDay}
                                        type='number'
                                        variant="standard"
                                        size='small'
                                        style={{ width: 70, marginRight: 10 }}
                                        onChange={(e) => {
                                            let number = Number(e.target.value);
                                            showError !== false && setShowError(false);
                                            if (number > 0) {
                                                setMinTime('');
                                                if (number <= 1000) {
                                                    setMinDay(number);
                                                }
                                                else {
                                                    number = 1000
                                                    e.target.value = number;
                                                    setMinDay(number);
                                                }

                                            }
                                            else if (number === 0) {
                                                setMinTime(timeSlots[0])
                                                setMinDay(number);
                                            }
                                            else {
                                                number = 0;
                                                e.target.value = number;
                                                setMinDay(number);
                                            }
                                        }} />

                                    <span>
                                        g??n
                                </span>

                                </div>
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container justify='space-between'>
                                <Grid item>
                                    <Button variant="contained" color="default" onClick={handleBack}>
                                        Geri
                                            </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            handleNext(['city', 'district', 'province']);
                                        }}>
                                        N??vb??ti
                                        </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>

                </div>
                <div className="right" >
                    <div className="advices">
                        <div className='advices_title'>
                            <img src={require('../Images/idea.png')} alt="" />
                            <h1>M??sl??h??tl??r</h1>
                        </div>

                        <div>
                            <h4>1. ??nvan</h4>
                            <span>
                                M????t??ril??riniz sizi rahat taps??n dey?? harada qald??????n??z?? qeyd edin.
                                </span>
                        </div>
                        <div>
                            <h4>2. M??dd??t</h4>
                            <span>
                                Minimum kiray?? m??dd??tini m????t??ril??riniz?? v?? ????yan??z??n t??yinat??na g??r?? m????yy??n edin.
                                M??s: Minimum kiray?? m??dd??tinin 3 saat olmas?? m????t??rinizin sizin ????yan?? ??n az?? 3 saat m??dd??tind??
                                kiray??l??m??si dem??kdir.
                                </span>
                        </div>

                    </div>
                </div>

            </div>
            <div className='rentOut_stepContent' index={4} style={{ display: !(stepIndex === 4) && 'none' }}>
                <div className="left">
                    <Grid container spacing={3}>
                        {minDay === 0 ?
                            <>
                                {noTimePrice = false}
                                <Grid item xs={12}>
                                    <TextField
                                        name="timePrice"
                                        label="????yan??n saatl??q d??y??ri"
                                        type="number"
                                        // placeholder='??mumi kiray?? m??dd??ti ??????n ver??c??yiniz m??bl????'
                                        variant="outlined"
                                        fullWidth
                                        autoComplete='off'
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">
                                                <span style={{ fontFamily: 'Ubuntu' }} className='manat'>&#8380;</span>
                                            </InputAdornment>,
                                        }}
                                        defaultValue={rentInfo.timePrice === 0 ? '' : rentInfo.timePrice}
                                        onBlur={(event) => {
                                            let value;
                                            value = (Number(event.currentTarget.value) < 0) ? 0 : Number(event.currentTarget.value);

                                            setRentInfo({
                                                ...rentInfo,
                                                [event.currentTarget.name]: value
                                            });

                                            event.currentTarget.value = priceFormat(value);
                                        }}
                                        error={rentInfo.timePrice === 0 && rentInfoErrors.timePrice} helperText={rentInfo.timePrice === 0 && rentInfoErrors.timePrice && 'Saatl??q d??y??ri daxil edin.'}
                                    />
                                </Grid>
                            </>
                            :
                            <>
                                {noTimePrice = true}
                            </>
                        }

                        <Grid item xs={12}>

                            <TextField
                                name="daily"
                                label="????yan??n g??nd??lik d??y??ri"
                                type="number"
                                // placeholder='??mumi kiray?? m??dd??ti ??????n ver??c??yiniz m??bl????'
                                variant="outlined"
                                fullWidth
                                autoComplete='off'
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        <span style={{ fontFamily: 'Ubuntu' }} className='manat'>&#8380;</span>
                                    </InputAdornment>,
                                }}
                                defaultValue={rentInfo.daily === 0 ? '' : rentInfo.daily}
                                onBlur={(event) => {
                                    let value;
                                    value = (Number(event.currentTarget.value) < 0) ? 0 : Number(event.currentTarget.value);

                                    setRentInfo({
                                        ...rentInfo,
                                        [event.currentTarget.name]: value
                                    });

                                    event.currentTarget.value = priceFormat(value);
                                }}
                                error={rentInfo.daily === 0 && rentInfoErrors.daily} helperText={rentInfo.daily === 0 && rentInfoErrors.daily && 'G??nl??k d??y??ri daxil edin.'}
                            />

                        </Grid>


                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    <span className='rentOut_priceExplanationSpan'>
                                        Uzun-m??dd??tli (h??ft??lik, ayl??q v?? daha ??ox) kiray??l??r?? endirim t??tbiq etm??yiniz t??vsiy?? olunur.
                                        M????t??riniz daha ??ox olacaq v?? g??liriniz artacaq.
                                        </span>
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        name="weekly_discount"
                                        label="H??ft??lik Endirim"
                                        type="number"
                                        // placeholder='??mumi kiray?? m??dd??ti ??????n ver??c??yiniz m??bl????'
                                        variant="filled"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">
                                                %
                                                    </InputAdornment>,
                                        }}
                                        fullWidth
                                        autoComplete='off'
                                        defaultValue={rentInfo.weekly_discount === 0 ? '' : rentInfo.weekly_discount}
                                        onChange={handleChangeWeeklyDiscount}

                                    />
                                </Grid>
                                <Grid item xs={7}>
                                    <TextField
                                        name="weekly"
                                        label="H??ft??lik qiym??ti"
                                        type="number"
                                        // placeholder='??mumi kiray?? m??dd??ti ??????n ver??c??yiniz m??bl????'
                                        variant="outlined"
                                        disabled
                                        fullWidth
                                        autoComplete='off'
                                        value={(7 * (rentInfo.daily - (rentInfo.daily * rentInfo.weekly_discount / 100))).toFixed(2)}
                                    // onChange={handleChange}
                                    />
                                </Grid>

                            </Grid>
                        </Grid>
                        <Grid item xs={12}>

                            <Grid container spacing={2}>
                                <Grid item xs={5}>
                                    <TextField
                                        name="monthly_discount"
                                        label="Ayl??q Endirim"
                                        type="number"
                                        // placeholder='??mumi kiray?? m??dd??ti ??????n ver??c??yiniz m??bl????'
                                        variant="filled"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">
                                                %
                                                    </InputAdornment>,
                                        }}
                                        autoComplete='off'
                                        onChange={handleChangeMonthlyDiscount}
                                        defaultValue={rentInfo.monthly_discount === 0 ? '' : rentInfo.monthly_discount}
                                    />
                                </Grid>
                                <Grid item xs={7}>
                                    <TextField
                                        name="monthly"
                                        label="Ayl??q qiym??ti"
                                        type="number"
                                        // placeholder='??mumi kiray?? m??dd??ti ??????n ver??c??yiniz m??bl????'
                                        variant="outlined"
                                        disabled
                                        fullWidth
                                        autoComplete='off'
                                        value={(30 * (rentInfo.daily - (rentInfo.daily * rentInfo.monthly_discount / 100))).toFixed(2)}

                                    // onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                            {monthlyDiscountError && <div className='helperText'>Ayl??q endirim faizi H??ft??lik-d??n ki??ik ola bilm??z.</div>}

                        </Grid>


                        <Grid item xs={12}>
                            <Grid container justify='space-between'>
                                <Grid item>
                                    <Button variant="contained" color="default" onClick={handleBack}>
                                        Geri
                                        </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={() => handleNext(['timePrice', 'daily'])}>
                                        N??vb??ti
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                </div>
                <div className="right" >
                    <div className="advices">
                        <div className='advices_title'>
                            <img src={require('../Images/idea.png')} alt="" />
                            <h1>M??sl??h??tl??r</h1>
                        </div>

                        <div>
                            <h4>1. S??rf??lilik</h4>
                            <span>
                                ????yan??z??n qiym??tini ortalamaya yax??n edin.
                                </span>
                        </div>
                        <div>
                            <h4>2. G??rs??nm?? say??</h4>
                            <span>
                                Endirim t??tbiq ets??niz elan??n??z endirim t??tbiq etm??y??nl??rd??n daha ??ox g??rs??n??c??k.
                                </span>
                        </div>
                        <div>
                            <h4>3. A????ll?? endirim</h4>
                            <span>
                                H??ft??lik v?? ayl??q endirim t??tbiq etdiyiniz halda aral??q g??nl??r?? endirim miqdar??, endirim faizinin
                                kiray?? g??n??n??n say??n??n nisb??tin?? b??l??n??r??k hesablan??r. Y??ni 1 g??n v?? 1 h??ft?? aras??nda, 1 h??ft??
                                v?? 1 ay aras??nda kiray?? m??dd??tl??ri se??il??rs?? t??tbiq etdiyiniz endirim faizi a????ll?? endirim
                                hesablama sistemi il?? g??n miqdar??na uy??un nisb??td?? t??yin olunacaq.
                                </span>
                        </div>

                    </div>
                </div>

            </div>
            <div className='rentOut_stepContent_LastStep' index={5} style={{ display: !(stepIndex === 5) && 'none' }}>
                <h1 className='rentOut_stepContent_LastStep_header'>
                    Sonluq
                </h1>
                <h3 className='rentOut_stepContent_LastStep_subheader'>
                    Mandarentd?? Kiray?? prosesi a??a????dak?? kimidir:
                </h3>
                <p>
                    <FiberManualRecordRoundedIcon color='error' fontSize='small' className='dotIcon' /> <span>Elan??n??za Mandarentin istifad????il??ri t??r??find??n kiray?? vaxt??n??n (g??n v?? saat) v??
                    qazanaca????n??z g??lirin g??st??rildiyi t??klif g??nd??rilir. T??klifi g??nd??rm??mi??d??n ??vv??l m????t??ri
                    siz?? Mandarent ??z??rind??n elan??n??zla ba??l?? mesaj g??nd??r?? bil??r. G??v??nliyiniz ??????n telefon
                    n??mr??niz istifad????il??r t??r??find??n g??r??lm??y??c??k.</span>
                </p>
                <p>
                    <FiberManualRecordRoundedIcon color='error' fontSize='small' className='dotIcon' /> <span>Kiray?? t??klifini q??bul edirsiniz. ??g??r istifad????il?? bundan ??vv??lki m??rh??l??d??
                    dan????mam??s??n??zsa, bu m??rh??l??d?? mesaj hiss??si vasit??sil?? ????yan?? harada ver??c??yinizi
                    m????t??rinizl?? raz??la??d??r??n.</span>
                </p>
                <p>
                    <FiberManualRecordRoundedIcon color='error' fontSize='small' className='dotIcon' /> <span>Kiray?? vaxt?? ba??lananda, m????t??rinizl?? raz??la??d??rd??????n??z m??kanda ????yan?? verin v??
                    m????t??rid??n kiray?? haqq??n?? na??d v?? yaxud dig??r formada ??ld?? edin.</span>
                </p>
                <p>
                    <FiberManualRecordRoundedIcon color='error' fontSize='small' className='dotIcon' /> <span>Kiray?? m??dd??tinin sonunda m????t??rinizl?? raz??la??d??rd??????n??z formada ????yan??z?? t??hvil al??n v??
                    Mandarentd?? ??m??liyyatlar??m hiss??sind??n m????t??riniz?? reytinq verib r??y bildirin.</span>

                </p>
                <div className='rentOut_stepContent_LastStep_btnBox'>
                    <Button variant="contained" color="default" onClick={handleBack}>
                        Geri
                    </Button>
                    <Button className='rentOut_stepContent_LastStep_btn' variant="contained" color="primary" onClick={handleSubmit}>
                        Sonland??r
                </Button>
                </div>
            </div>

        </>);

    }


    // const filterOptions = createFilterOptions({
    //     matchFrom: 'start',
    //     stringify: (option) => option.name,
    // });

    const [isCategoryChanged, setIsCategoryChanged] = useState(false);
    const [isCityChanged, setIsCityChanged] = useState(false);
    const [isDistrictChanged, setIsDistrictChanged] = useState(false);

    const [openCategory1, setOpenCategory1] = useState(false);
    const [openCategory2, setOpenCategory2] = useState(false);

    const [openCity, setOpenCity] = useState(false);
    const [openDistrict, setOpenDistrict] = useState(false);
    const [openProvince, setOpenProvince] = useState(false);

    const [openMinTime, setOpenMinTime] = useState(false);


    return (
        <div className='main'>

            <Helmet>
                <title>{pageTitlesAndDescriptions.rentOut.title}</title>
                <meta name="description" content={pageTitlesAndDescriptions.rentOut.description} />
            </Helmet>

            <div className="container">
                <div className='rentOut_Steps'>
                    <Stepper activeStep={activeStep - 1} alternativeLabel style={{ paddingLeft: 0, paddingRight: 0 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {getStepContent(activeStep)}

                    {/* <Dialog
                        open={openDialog}
                        // onClose={handleCloseDialog}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogContent dividers>
                            <DialogContentText id="alert-dialog-slide-description" style={{ marginBottom: 0 }}>
                                <span style={{ display: 'flex', alignItems: 'center', fontSize: '1.25rem' }}>
                                    <CheckCircleIcon style={{ color: 'green', marginRight: 10, fontSize: '2.5rem' }} />
                                    Elan??n??z u??urla yerl????dirildi
                                </span>
                            </DialogContentText>
                        </DialogContent>

                    </Dialog> */}
                    {/* <div className="safety">
                        <div className="safety_inside">

                            <div>
                                <img src={require('../Images/logo_mandarin.png')} alt="" width="50px" />
                                <h1>????yalar??n??z g??v??nd??dir!</h1>
                            </div>

                            <span>
                                Bizim ??n vacib prinsipl??rimizd??n biri Mandarentin m????t??rimiz ??????n g??v??nli bir onlayn kiray?? platformas??
                                olmas??n?? t??min etm??kdir. Bel?? ki, ??g??r kiray?? m??dd??tind?? ????yan??z??n ba????na h??r hans?? bir hadis?? g??l??rs?? (q??r??lsa, its??,
                                o??urlansa v?? s.) biz sizi s????ortalay??r??q! 7/24 xidm??tinizd?? olan ??m??kda??lar??m??z is?? h??r zaman siz?? bir
                                z??ng uzaql??????ndad??r!
                                <a> S????orta siyas??ti</a>
                            </span>

                        </div>
                    </div> */}
                </div>
            </div>

        </div>
    )
}

RentOut.propTypes = {
    UI: PropTypes.object.isRequired,
    postRent: PropTypes.func.isRequired,
}

const mapActionsToProps = { postRent };

const mapStateToProps = (state) => ({
    UI: state.UI,
    auth: state.firebase.auth,
})


export default connect(mapStateToProps, mapActionsToProps)(RentOut);
