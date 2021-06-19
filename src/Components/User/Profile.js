import React, { useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
// import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
// import CreditCardIcon from '@material-ui/icons/CreditCard';
import red from '@material-ui/core/colors/red';
import StarsIcon from '@material-ui/icons/Stars';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import EditDetails from '../EditDetails';
import ChangePassword from '../ChangePassword';

import AddAPhotoRoundedIcon from '@material-ui/icons/AddAPhotoRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import ImageUploading from 'react-images-uploading';
import Tooltip from '@material-ui/core/Tooltip';

import { connect } from 'react-redux';
// import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import AccessTimeRoundedIcon from '@material-ui/icons/AccessTimeRounded';

import { uploadImage, editUserDetails, getSMSUnits, sendSMS, changePassword, verifyAccount } from '../../Redux/actions/userActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { calculateRating, isEmptyObject } from '../../util';

import imageCompression from 'browser-image-compression';
// import ChangeEmail from '../ChangeEmail';
import { ID_series_list, maxSizeMB } from '../../dbSchema';

// const useStylesCustom = makeStyles((theme) => ({
//     root: {
//         position: 'relative',
//         width: 25,
//         height: 25
//     },
//     bottom: {
//         color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
//     },
//     top: {
//         color: '#1a90ff',
//         animationDuration: '1300ms',
//         position: 'absolute',
//         left: 0,
//     },
//     circle: {
//         strokeLinecap: 'round',
//     },
// }));

// function CustomCircularProgress(props) {
//     const classes = useStylesCustom();

//     return (
//         <div className={classes.root}>
//             <CircularProgress
//                 variant="determinate"
//                 className={classes.bottom}
//                 size={25}
//                 thickness={4}
//                 {...props}
//                 value={100}
//             />
//             <CircularProgress
//                 variant="indeterminate"
//                 disableShrink
//                 className={classes.top}
//                 classes={{
//                     circle: classes.circle,
//                 }}
//                 size={25}
//                 thickness={4}
//                 {...props}
//             />
//         </div>
//     );
// }

const useStyles = makeStyles((theme) => ({
    star: {
        color: red[500],
        marginRight: 2,
        marginLeft: 10
    },
}));


const Profile = (props) => {
    const classes = useStyles();

    const matches_550 = useMediaQuery('(min-width:550px)');
    const matches_600 = useMediaQuery('(min-width:600px)');

    const { profile, auth } = props;

    const handlePhotoChange = (event) => {
        imageCompression(event.target.files[0], {
            maxSizeMB: maxSizeMB,
            maxWidthOrHeight: 600,
            useWebWorker: true,
            initialQuality: 1
        })
            .then((compressedFile) => {
                return props.uploadImage(new File([compressedFile], 'profile-picture', { type: compressedFile.type }));
            })
            .catch((error) => console.log(error.message));
    }

    const handleEditPhoto = () => {
        const fileInput = document.getElementById('photoInput');
        fileInput.click();
    }

    const handleSubmit = () => {
        props.editUserDetails({ biography });
    }

    const [biography, setBiography] = useState('')
    const [firstAttempt, setFirstAttempt] = useState(false);

    const handleChange = (event) => {
        setBiography(event.target.value);
        setFirstAttempt(true)
    }

    useEffect(() => {

        if (!profile.isEmpty) {
            setBiography(profile.biography);
            setVerificationDetails(prevState => ({ ...prevState, name: profile.name, surname: profile.surname }));
        }
    }, [profile])

    const [openID_series, setOpenID_series] = useState(false);

    const [verificationDetails, setVerificationDetails] = useState({
        ID_series: ID_series_list[0],
        ID_number: '',
        name: '',
        surname: '',
        fatherName: '',
        address: ''
    })

    const handleVerificationChange = (event) => {
        setVerificationDetails((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));
    }

    const handleVerificationSubmit = () => {
        let isValid = true;
        Object.keys(verificationDetails).forEach(each => {
            if (verificationDetails[each].trim() === '') {
                isValid = false;
                return;
            }
        })

        if (isValid && verificationImages.length === 2) {

            Promise.all(verificationImages.map(each =>
                imageCompression(each.file, {
                    maxSizeMB: maxSizeMB,
                    maxWidthOrHeight: 600,
                    useWebWorker: true,
                    initialQuality: 1
                })
            ))
                .then((compressedFiles) => {
                    return Promise.all(compressedFiles.map(each => each.arrayBuffer()))
                })
                .then((bufs) => {
                    props.verifyAccount(verificationDetails, bufs.map(each => new Buffer.from(each)));
                    setVerifySubmitted(false);
                })
                .catch((err) => console.log(err));

        }
        else {
            setVerifySubmitted(true);
        }
    }

    const [verifySubmitted, setVerifySubmitted] = useState(false);

    const [verificationImages, setVerificationImages] = useState([]);

    const onImageChange = (imageList, addUpdateIndex) => {
        setVerificationImages(imageList);
    };

    return (
        <div className="profile">
            <div className='profile_inside'>
                {profile.isLoaded &&
                    <Grid container spacing={2} className='profile_ContentGrid'>
                        <Grid item xs={4}>
                            <div className="profile_left">

                                <img src={profile.photoUrl} alt="" />
                                <input type='file' accept='image/*' id='photoInput' hidden onChange={handlePhotoChange} />
                                <span onClick={handleEditPhoto} className='profileUploadImg'>
                                    Yenilə
                            </span>
                                <div className="profile_line_top"></div>
                                <div>
                                    <label id="pr_name" htmlFor="profile_name">Ad: </label>
                                    <input id="profile_name" className="profile_name" type="text" value={profile.name} disabled />
                                </div>
                                <div>
                                    <label htmlFor="profile_suranme">Soyad: </label>
                                    <input id="profile_suranme" className="profile_suranme" type="text" value={profile.surname} disabled />
                                </div>
                                <div>
                                    <label htmlFor="profile_number">Nömrə: </label>
                                    <input id="profile_number" className="profile_number" type="text" value={profile.phoneNumber} disabled />
                                </div>
                                {profile.rating && profile.rating.length > 0 ?
                                    <span className='ratingBar'>Reytinq: <StarsIcon fontSize='small' className={classes.star} />{calculateRating(profile.rating)}</span>
                                    :
                                    null
                                }
                                <div className="profile_line_bottom"></div>
                                {!isEmptyObject(profile) &&
                                    <>
                                        {/* <EditDetails credentials={profile} /> */}
                                        <ChangePassword />

                                        {/* <ChangeEmail /> */}
                                    </>
                                }
                            </div>
                        </Grid>
                        <Grid item xs={8}>
                            <div className="profile_right_biography">
                                <h2 className='profile_right_biography_header'>
                                    Bioqrafiya
                                </h2>
                                <div className='profile_right_biography_box'>
                                    <TextField
                                        name="biography"
                                        defaultValue={profile.biography}
                                        multiline
                                        rows={6}
                                        placeholder="Müştərilərinizə özünüz haqqında bəhs edin."
                                        variant="outlined"
                                        fullWidth
                                        autoComplete='off'
                                        className="profile_description"

                                        onChange={handleChange}
                                    />
                                    {firstAttempt && biography !== profile.biography &&
                                        <Button onClick={handleSubmit} className='skyColor_btn' size='medium' color='primary' variant='contained'>
                                            Yadda Saxla
                                        </Button>
                                    }
                                </div>
                            </div>

                            <div className='profile_right_verification'>
                                <div className='profile_right_verification_header'>
                                    <img src={require('../../Images/verification_icon.svg')} alt='verification icon' />
                                    <h4 className='profile_right_verification_header_text'>Doğrulama</h4>
                                </div>
                                <div className='profile_right_verification_content'>
                                    <p className='profile_right_verification_content_Explanation'>Kirayə elanı yerləşdirmək vəya əşyaları kirayələmək üçün hesabınızı doğrulamalısınız.</p>
                                    <p className='profile_right_verification_content_Explanation'>Şəxsiyyətin doğrulanması üçün aşağıdaki boşluqları doldurun.</p>
                                    <p className='profile_right_verification_content_InputHeader'>Şəxsiyyət Vəsiqəsinin: </p>
                                    <Grid container spacing={2} className='profile_right_verification_content_InputBox'>
                                        <Grid item xs={3} className='grid-noPad-top-bottom'>
                                            <FormControl className='profile_right_verification_content_ID_series' fullWidth variant="standard" size='small' margin='dense'>
                                                <InputLabel id="series" >Seriyası</InputLabel>
                                                <Select
                                                    name='ID_series'
                                                    labelId="series"
                                                    value={!profile.ID_series ? verificationDetails.ID_series : profile.ID_series}
                                                    readOnly={Boolean(profile.ID_series)}
                                                    open={openID_series}
                                                    onOpen={() => {
                                                        setOpenID_series(true);
                                                    }}
                                                    onChange={handleVerificationChange}
                                                    onClose={() => {
                                                        setOpenID_series(false);
                                                    }}
                                                    MenuProps={{ style: { maxHeight: 300 }, onExited: () => document.activeElement.blur() }}
                                                >
                                                    {ID_series_list.map(each => {
                                                        return <MenuItem key={each} value={each}>{each}</MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={9} className='grid-noPad-top-bottom'>
                                            <TextField
                                                name="ID_number"
                                                label="Nömrəsi"
                                                fullWidth
                                                autoComplete='off'
                                                size='small'
                                                margin='dense'
                                                className='profile_right_verification_content_ID_number'
                                                variant='standard'
                                                defaultValue={!profile.ID_number ? verificationDetails.ID_number : profile.ID_number}
                                                InputProps={{ readOnly: Boolean(profile.ID_number) }}
                                                onChange={(event) => event.target.value = event.target.value.replace(/[^\d]/g, '')}
                                                onBlur={handleVerificationChange}
                                                error={verifySubmitted && verificationDetails.ID_number.trim() === ''}
                                            />
                                        </Grid>
                                        <Grid item xs={matches_550 ? 4 : 6} className='grid-noPad-top-bottom'>
                                            <TextField
                                                label="Ad"
                                                name="name"
                                                fullWidth
                                                autoComplete='off'
                                                size='small'
                                                margin='dense'
                                                variant='standard'
                                                defaultValue={profile.name}
                                                InputProps={{ readOnly: profile.verified !== undefined }}
                                                onBlur={handleVerificationChange}
                                                error={verifySubmitted && verificationDetails.name.trim() === ''}
                                            />
                                        </Grid>
                                        <Grid item xs={matches_550 ? 4 : 6} className='grid-noPad-top-bottom'>
                                            <TextField
                                                label="Soyad"
                                                name="surname"
                                                fullWidth
                                                autoComplete='off'
                                                size='small'
                                                margin='dense'
                                                variant='standard'
                                                defaultValue={profile.surname}
                                                InputProps={{ readOnly: profile.verified !== undefined }}
                                                onBlur={handleVerificationChange}
                                                error={verifySubmitted && verificationDetails.surname.trim() === ''}
                                            />
                                        </Grid>
                                        <Grid item xs={matches_550 ? 4 : 12} className='grid-noPad-top-bottom'>
                                            <TextField
                                                label="Ata adı"
                                                name="fatherName"
                                                fullWidth
                                                autoComplete='off'
                                                size='small'
                                                margin='dense'
                                                variant='standard'
                                                defaultValue={!profile.fatherName ? verificationDetails.fatherName : profile.fatherName}
                                                InputProps={{ readOnly: Boolean(profile.fatherName) }}
                                                onBlur={handleVerificationChange}
                                                error={verifySubmitted && verificationDetails.fatherName.trim() === ''}
                                            />
                                        </Grid>
                                        {/* <Grid item xs={matches_550 ? 3 : 12} className='grid-noPad-top-bottom'>
                                            <TextField
                                                label="Doğum tarixi"
                                                name='birth_date'
                                                fullWidth
                                                autoComplete='off'
                                                size='small'
                                                margin='dense'
                                                variant='standard'
                                                helperText='gün/ay/il'
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    let onlyDate;

                                                    if (value.length < 3 && value.match(/^\d+$/)) {
                                                        onlyDate = value;
                                                        if (value.length === 2)
                                                            onlyDate += '/';
                                                    }
                                                    else if (value.length < 6 && value.match(/^\d{2}[/]{1}\d+$/)) {
                                                        onlyDate = value;
                                                        if (value.length === 5)
                                                            onlyDate += '/';
                                                    }
                                                    else if (value.length <= 10 && value.match(/^\d{2}[/]{1}\d{2}[/]\d+$/)) {
                                                        onlyDate = value;
                                                    }
                                                    else if (value.length > 10) {
                                                        onlyDate = value.substr(0, 10);
                                                    }
                                                    else {
                                                        onlyDate = '';
                                                    }

                                                    event.target.value = onlyDate;
                                                }}
                                                defaultValue={verificationDetails.birth_date}
                                                onBlur={handleVerificationChange}
                                            />
                                        </Grid> */}

                                        <Grid item xs={12} className='grid-noPad-top-bottom'>
                                            <TextField
                                                label="Yaşadığınız ünvan"
                                                name='address'
                                                fullWidth
                                                autoComplete='off'
                                                size='small'
                                                margin='dense'
                                                variant='standard'
                                                helperText='Faktiki yaşadığınız ünvan'
                                                defaultValue={!profile.address ? verificationDetails.address : profile.address}
                                                InputProps={{ readOnly: Boolean(profile.address) }}
                                                onBlur={handleVerificationChange}
                                                error={verifySubmitted && verificationDetails.address.trim() === ''}
                                            />
                                        </Grid>


                                    </Grid>
                                    <div className='profile_right_verification_expContent'>
                                        <p><span className='bold red-text'>*</span> Ad, Soyad, Ata adı, Ünvan, Şəxsiyyət vəsiqəsinin seriya və nömrəsi Kirayə müqaviləsində qeyd olunacaq.</p>
                                    </div>
                                    {profile.verified === undefined &&
                                        <>
                                            <p className='profile_right_verification_content_InputHeader'>Şəxsiyyət vəsiqənizi təsdiqləmək üçün <span className='bold black-text'>Şəxsiyyət vəsiqənizin hər iki üzünü</span> aşağıya əlavə edin.</p>
                                            <Grid container spacing={2} className='profile_right_verification_content_ImgBox' justify='center'>
                                                <Grid item xs={matches_600 ? 8 : 12} className='grid-noPad-top-bottom' >
                                                    <ImageUploading
                                                        multiple
                                                        value={verificationImages}
                                                        onChange={onImageChange}
                                                        maxNumber={2}
                                                        dataURLKey="data_url"
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
                                                            <div className="profile_right_verification_content_ImgInput" {...dragProps} style={isDragging ? { borderColor: 'red' } : null}>
                                                                <img src={require('../../Images/id-card.svg')} alt='id card' />
                                                                <button
                                                                    className='rentOut_uploadBtn'
                                                                    onClick={onImageUpload}
                                                                >
                                                                    klikləyin və ya səkili üzərinə buraxın
                                                        </button>
                                                                {errors &&
                                                                    <div className='rentOut_upload_errors'>
                                                                        {errors.maxNumber && <span>Sadəcə 2 şəkilə icazə verilir</span>}
                                                                        {errors.acceptType && <span>Seçilmiş faylın tipi düzgün deyil</span>}
                                                                        {/* {errors.maxFileSize && <span>Selected file size exceed maxFileSize</span>} */}
                                                                        {/* {errors.resolution && <span>Şəklin hündürlüyü genişliyindən böyük olmamalıdır</span>} */}
                                                                    </div>
                                                                }
                                                                {/* <button onClick={onImageRemoveAll}>Bütün şəkilləri sil</button> */}
                                                                {imageList.length > 0 &&
                                                                    <div className='rentOut_imageContainer'>
                                                                        {imageList.map((image, index) => (
                                                                            <div key={index} className="rentOut_image-item">
                                                                                <img src={image.data_url} alt="" width="100" />

                                                                                <Tooltip title='Dəyişdir' placement="left" arrow >
                                                                                    <button onClick={() => onImageUpdate(index)} className='rentOut_image-item_Update'><AddAPhotoRoundedIcon /> </button>
                                                                                </Tooltip>
                                                                                <Tooltip title='Sil' placement="right" arrow >
                                                                                    <button onClick={() => onImageRemove(index)} className='rentOut_image-item_Cancel'><CloseRoundedIcon /> </button>
                                                                                </Tooltip>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                }

                                                                {verificationImages.length === 0 && verifySubmitted && <div className='helperText' >Şəkil əlavə edin.</div>}
                                                                {verificationImages.length === 1 && verifySubmitted && <div className='helperText'>Minimum 2 şəkil olmalıdır.</div>}
                                                            </div>

                                                        )}
                                                    </ImageUploading>
                                                </Grid>
                                            </Grid>
                                        </>
                                    }
                                    <div className='profile_right_verification_expContent'>
                                        <p><span className='bold red-text'>*</span> Əgər Doğrulama prosesi ilə bağlı bir sualınız varsa, <span className='blue-custom-text bold cursor fontS-09' onClick={() => window.open('https://t.me/mandarent', '_blank')}>Telegram</span> hesabımıza keçid edin.</p>
                                        <p><span className='bold black-text'>Açıqlama: </span>Şəxsiyyət vəsiqənizin şəkli daim gizli olaraq saxlanılacaq və heç bir halda digər istifadəçilərlə paylaşılmayacaq.</p>
                                        {profile.verified === false &&
                                            <p><span className='bold black-text'>Doğrulama prosesi: </span>Hesabınız ən gec halda iş gününün sonuna qədər texniki heyətimiz tərəfindən doğrulanacaqdır.</p>
                                        }
                                    </div>
                                    {profile.verified === undefined ?
                                        <div className='profile_right_verification_content_InputSaveBtn'>
                                            <Button onClick={handleVerificationSubmit} className='skyLightColor_btn' size='medium' color='primary' variant='contained'>
                                                Təsdiqlə
                                            </Button>
                                        </div>
                                        :
                                        <div className='profile_right_verification_content_verificationSubmitted'>
                                            {!profile.verified ?
                                                <div className='profile_right_verification_content_verificationSubmitted_NV'>
                                                    <span>İCRA OLUNUR</span>
                                                    <AccessTimeRoundedIcon fontSize='small' />
                                                </div>
                                                :
                                                <div className='profile_right_verification_content_verificationSubmitted_V'>
                                                    <span>DOĞRULANDI</span>
                                                    <img src={require('../../Images/success-green-check-mark.svg')} alt='verify icon' />
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>

                        </Grid>
                    </Grid>
                }
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    user: state.user,
    // UI: state.UI
    profile: state.firebase.profile,
    auth: state.firebase.auth
})

const mapActionsToProps = { uploadImage, editUserDetails, getSMSUnits, sendSMS, changePassword, verifyAccount };

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    uploadImage: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapActionsToProps)(Profile);
