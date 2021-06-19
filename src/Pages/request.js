import React, { useState } from 'react';
import '../Css/request.css';
import TextField from '@material-ui/core/TextField';
// import { KeyboardDatePicker, DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
// import DateFnsUtils from '@date-io/date-fns';
// import azLocale from "date-fns/locale/az";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import DateRangePickerWrapper from '../Components/DateTimePickerWrapper';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { categories, location } from '../dbSchema';

import dayjs from '../util/customDayJs';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { demand } from '../Redux/actions/userActions';
import { isEmptyObject } from '../util';
import { Helmet } from 'react-helmet';

import { pageTitlesAndDescriptions } from '../dbSchema';

const Request = (props) => {

    const matches_900 = useMediaQuery('(min-width:900px)');
    const matches_770 = useMediaQuery('(min-width:770px)');
    const matches_500 = useMediaQuery('(min-width:500px)');

    const demandInputNames = [
        'name',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'category',
        'subcategory',
        'city',
        'district',
        'province'
    ]

    const [demandDetails, setDemandDetails] = useState({
        name: '',
        start_date: {},
        end_date: {},
        start_time: '',
        end_time: '',
        description: '',
        category: '',
        subcategory: '',
        city: '',
        district: '',
        province: '',
    })

    const [demandDetailsErrors, setDemandDetailsErrors] = useState({
        name: false,
        start_date: false,
        end_date: false,
        start_time: false,
        end_time: false,
        category: false,
        subcategory: false,
        city: false,
        district: false,
        province: false,
    })


    const handleChange = (event) => {
        setDemandDetails({
            ...demandDetails,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = () => {
        let isValid = true;

        demandInputNames.forEach(each => {
            if (typeof demandDetails[each] === 'string' && demandDetails[each].trim() === '') {

                if (
                    (each === 'subcategory' && noSubCategory) ||
                    (each === 'district' && noDistrict) ||
                    (each === 'province' && noProvince)
                ) {
                    setDemandDetailsErrors((prevState) => ({ ...prevState, [each]: false }))
                }
                else {
                    setDemandDetailsErrors((prevState) => ({ ...prevState, [each]: true }))
                    isValid = false;
                }
            }
            else if (typeof demandDetails[each] === 'object' &&
                (
                    (each === 'start_date' && startDate === null || isEmptyObject(startDate)) ||
                    (each === 'end_date' && (endDate === null || isEmptyObject(endDate)))
                )
            ) {
                setDemandDetailsErrors((prevState) => ({ ...prevState, [each]: true }));
                isValid = false;
            }
            else {
                setDemandDetailsErrors((prevState) => ({ ...prevState, [each]: false }))
            }
        })

        if (isValid) {
            props.demand({ ...demandDetails, start_date: startDate._d.toISOString(), end_date: endDate._d.toISOString() }, props.history);
        }
    }

    const [isCategoryChanged, setIsCategoryChanged] = useState(false);
    const [isCityChanged, setIsCityChanged] = useState(false);
    const [isDistrictChanged, setIsDistrictChanged] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    const timeSlots = Array.from(new Array(17)).map(
        // (_, index) => `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'}`,
        (_, index) => `${(index + 7) < 10 ? '0' : ''}${index + 7}:00`
    );

    const [openStartTime, setOpenStartTime] = useState(false);
    const [openEndTime, setOpenEndTime] = useState(false);

    const [openCategory1, setOpenCategory1] = useState(false);
    const [openCategory2, setOpenCategory2] = useState(false);

    const [openCity, setOpenCity] = useState(false);
    const [openDistrict, setOpenDistrict] = useState(false);
    const [openProvince, setOpenProvince] = useState(false);

    let noSubCategory = false;
    let noDistrict = false;
    let noProvince = false;

    return (
        <div className='main'>
            <Helmet>
                <title>{pageTitlesAndDescriptions.request.title}</title>
                <meta name="description" content={pageTitlesAndDescriptions.request.description} />
            </Helmet>

            <div className='container'>
                <div className='requestContent'>
                    <div className='requestHeader'>
                        <div className='requestHeaderTxtDiv'>
                            <h4 className='requestHeaderTxt'>
                                Tələb et
                        </h4>
                            <img src={require('../Images/need2.png')} alt='request' />
                        </div>
                        <span>
                            Ehtiyacın olan əşyanı təsvir et və əldə et
                    </span>
                    </div>
                    <div className='requestInnerContent'>
                        <div className='requestSection1'>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="name"
                                        label="Əşyanın adı"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete='off'
                                        placeholder="Tələb etdiyiniz əşyanın adı"
                                        onChange={handleChange}
                                        error={demandDetails.name.trim() === '' && demandDetailsErrors.name}
                                        helperText={demandDetails.name.trim() === '' && demandDetailsErrors.name && 'Əşyanın adını daxil edin.'}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <DateRangePickerWrapper
                                        startDatePlaceholderText='Başlanğıc'
                                        endDatePlaceholderText='Bitiş'
                                        // showClearDates 
                                        // showDefaultInputIcon
                                        // anchorDirection='right'
                                        block
                                        inputIconPosition="after"
                                        displayFormat='DD/MM/YYYY'
                                        hideKeyboardShortcutsPanel
                                        numberOfMonths={1}
                                        minimumNights={0}
                                        initialStartDate={startDate}
                                        initialEndDate={endDate}
                                        setStartDate={setStartDate}
                                        setEndDate={setEndDate}
                                        readOnly
                                        customArrowIcon={
                                            <div className='vertLine_DateTimePicker' />
                                        }
                                    />

                                    {((demandDetailsErrors.start_date || demandDetailsErrors.end_date) && (!startDate && !endDate)) &&
                                        <Grid item style={{ padding: '0 8px' }}>
                                            <div className='helperText'>Vaxt aralığını daxil edin.</div>
                                        </Grid>
                                    }
                                </Grid>

                                <Grid item xs={matches_900 ? 6 : matches_770 ? 12 : matches_500 ? 6 : 12}>
                                    <FormControl fullWidth variant="outlined"
                                        error={demandDetails.start_time.trim() === '' && demandDetailsErrors.start_time}>
                                        <InputLabel id="start_time_label" >Başlanğıc saatı</InputLabel>
                                        <Select
                                            disabled={startDate === null || endDate === null}
                                            name='start_time'
                                            labelId="start_time_label"
                                            id="start_time"
                                            open={openStartTime}
                                            onClose={() => setOpenStartTime(false)}
                                            onOpen={() => setOpenStartTime(true)}
                                            onChange={handleChange}
                                            label="Başlanğıc saatı"
                                            MenuProps={{ style: { maxHeight: 300 } }}
                                        >
                                            {timeSlots.map(each => {
                                                return <MenuItem
                                                    key={each}
                                                    value={each}
                                                    disabled={dayjs(startDate).isSame(dayjs(), 'd') && Number(each.split(':')[0]) <= new Date().getHours() ? true : false}
                                                >
                                                    {each}
                                                </MenuItem>
                                            })}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={matches_900 ? 6 : matches_770 ? 12 : matches_500 ? 6 : 12}>
                                    <FormControl fullWidth variant="outlined"
                                        error={demandDetails.end_time.trim() === '' && demandDetailsErrors.end_time}>
                                        <InputLabel id="end_time_label" >Bitiş saatı</InputLabel>
                                        <Select
                                            disabled={demandDetails.start_time === ''}
                                            name='end_time'
                                            labelId="end_time_label"
                                            id="end_time"
                                            open={openEndTime}
                                            onClose={() => setOpenEndTime(false)}
                                            onOpen={() => setOpenEndTime(true)}
                                            onChange={handleChange}
                                            label="Bitiş saatı"
                                            MenuProps={{ style: { maxHeight: 300 } }}
                                        >
                                            {timeSlots.map(each => {
                                                return <MenuItem
                                                    key={each}
                                                    value={each}
                                                    disabled={(dayjs(startDate).isSame(dayjs(endDate), 'd') && demandDetails.start_time !== '') ? Number(each.split(':')[0]) - Number(demandDetails.start_time.split(':')[0]) > 0 ? false : true : false}
                                                >
                                                    {each}
                                                </MenuItem>
                                            })}

                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </div>
                        <div className='requestSection2'>
                            <img src={require('../Images/pull_request.svg')} alt='pull request' className='pull_request' />
                        </div>
                        <div className='requestSection3'>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="description"
                                        label="Əlavə məlumat"
                                        multiline
                                        rows={6}
                                        placeholder="Tələbiniz barədə əlavə məlumat verin"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div className='requestSection4'>
                            <Grid container spacing={3}>
                                <Grid item xs={matches_900 ? 6 : matches_770 ? 12 : matches_500 ? 6 : 12}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>

                                            <FormControl fullWidth variant="outlined" error={demandDetails.city.trim() === '' && demandDetailsErrors.city}>
                                                <InputLabel id="city_label" >Şəhəri seçin</InputLabel>
                                                <Select
                                                    name='city'
                                                    labelId="city_label"
                                                    id="city"
                                                    open={openCity}

                                                    onOpen={() => {
                                                        setOpenCity(true);

                                                        setDemandDetails({
                                                            ...demandDetails,
                                                            district: ''
                                                        })
                                                        // setIsCityChanged(false)
                                                    }}
                                                    onChange={(event) => {
                                                        setDemandDetails({
                                                            ...demandDetails,
                                                            city: event.target.value
                                                        })

                                                        setIsCityChanged(true);
                                                    }}
                                                    onClose={(event) => {
                                                        setOpenCity(false);
                                                        setIsCityChanged(true)
                                                    }}

                                                    label="Şəhəri seçin"
                                                    MenuProps={{ style: { maxHeight: 300 } }}
                                                >
                                                    {location.map(each => {
                                                        return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {isCityChanged && demandDetails.city === location[0].name ?
                                            (
                                                <>
                                                    {noDistrict = false}
                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth variant="outlined" error={demandDetails.district.trim() === '' && demandDetailsErrors.district}>
                                                            <InputLabel id="district_label" >Rayonu seçin</InputLabel>
                                                            <Select
                                                                name='district'
                                                                labelId="district_label"
                                                                id="district"
                                                                open={openDistrict}

                                                                onOpen={() => {
                                                                    setOpenDistrict(true);

                                                                    setDemandDetails({
                                                                        ...demandDetails,
                                                                        province: ''
                                                                    })
                                                                    // setIsDistrictChanged(false)
                                                                }}
                                                                onChange={(event) => {
                                                                    setDemandDetails({
                                                                        ...demandDetails,
                                                                        district: event.target.value
                                                                    })

                                                                    setIsDistrictChanged(true)

                                                                }}
                                                                onClose={(event) => {
                                                                    setOpenDistrict(false);
                                                                    setIsDistrictChanged(true)
                                                                }}

                                                                label="Rayonu seçin"
                                                                MenuProps={{ style: { maxHeight: 300 } }}
                                                            >
                                                                {location[0].districts.map(each => {
                                                                    return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                                })}

                                                            </Select>
                                                        </FormControl>

                                                    </Grid>

                                                    {isDistrictChanged && demandDetails.district && location[0].districts.find(district => district.name === demandDetails.district).sub ?
                                                        <Grid item xs={12}>
                                                            {noProvince = false}
                                                            <FormControl fullWidth variant="outlined" error={demandDetails.province.trim() === '' && demandDetailsErrors.province}>
                                                                <InputLabel id="province_label" >Qəsəbəni seçin</InputLabel>
                                                                <Select
                                                                    name='province'
                                                                    labelId="province_label"
                                                                    id="province"
                                                                    open={openProvince}

                                                                    onOpen={() => setOpenProvince(true)}
                                                                    onChange={(event) => {
                                                                        setDemandDetails({
                                                                            ...demandDetails,
                                                                            province: event.target.value
                                                                        })
                                                                    }}
                                                                    onClose={(event) => setOpenProvince(false)}

                                                                    label="Qəsəbəni seçin"
                                                                    MenuProps={{ style: { maxHeight: 300 } }}
                                                                >
                                                                    {location[0].districts.find(district => district.name === demandDetails.district).sub.map(each => {
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
                                </Grid>
                                <Grid item xs={matches_900 ? 6 : matches_770 ? 12 : matches_500 ? 6 : 12}>
                                    <Grid container spacing={3} justify='flex-end'>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth variant="outlined" error={demandDetails.category.trim() === '' && demandDetailsErrors.category}>
                                                <InputLabel id="category1_label" >Əsas Kateqoriya</InputLabel>
                                                <Select
                                                    name='category1'
                                                    labelId="category1_label"
                                                    id="category1"
                                                    open={openCategory1}

                                                    onOpen={() => {
                                                        setOpenCategory1(true);
                                                        setDemandDetails({
                                                            ...demandDetails,
                                                            subcategory: ''
                                                        })
                                                        // setIsCategoryChanged(false)
                                                    }}
                                                    onChange={(event) => {
                                                        setDemandDetails({
                                                            ...demandDetails,
                                                            category: event.target.value
                                                        })
                                                        setIsCategoryChanged(true);
                                                    }}
                                                    onClose={(event) => {
                                                        setOpenCategory1(false);
                                                        setIsCategoryChanged(true)
                                                    }}

                                                    label="Əsas Kateqoriya"
                                                    MenuProps={{ style: { maxHeight: 300 } }}
                                                >
                                                    {categories.map(each => {
                                                        return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                    })}

                                                    <MenuItem value='Digər'>Digər</MenuItem>

                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {isCategoryChanged && demandDetails.category && categories.find(category => category.name === demandDetails.category) && categories.find(category => category.name === demandDetails.category).sub ?
                                            <Grid item xs={12}>
                                                {noSubCategory = false}

                                                <FormControl fullWidth variant="outlined" error={demandDetails.subcategory.trim() === '' && demandDetailsErrors.subcategory}>
                                                    <InputLabel id="category2_label" >İkincil Kateqoriya</InputLabel>
                                                    <Select
                                                        name='category2'
                                                        labelId="category2_label"
                                                        id="category2"
                                                        open={openCategory2}

                                                        onOpen={() => {
                                                            setOpenCategory2(true);
                                                        }}
                                                        onChange={(event) => {
                                                            setDemandDetails({
                                                                ...demandDetails,
                                                                subcategory: event.target.value
                                                            })
                                                        }}
                                                        onClose={(event) => {
                                                            setOpenCategory2(false);
                                                        }}

                                                        label="İkincil Kateqoriya"
                                                        MenuProps={{ style: { maxHeight: 300 } }}
                                                    >
                                                        {categories.find(category => category.name === demandDetails.category).sub.map(each => {
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

                                        <Grid item>
                                            <Button variant='contained' color='secondary' className='requestbtn' size='large' onClick={handleSubmit}>
                                                Tələb et
                                        </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = (state) => ({
    data: state.data,
    UI: state.UI
});

const mapActionsToProps = { demand };

Request.propTypes = {
    demand: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
}


export default connect(mapStateToProps, mapActionsToProps)(Request);