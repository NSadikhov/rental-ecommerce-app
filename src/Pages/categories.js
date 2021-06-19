import React, { useState, useEffect } from 'react';
import '../Css/categories.css'

// import makeStyles from '@material-ui/core/styles/makeStyles';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
// import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

// import red from '@material-ui/core/colors/red';

import SearchIcon from '@material-ui/icons/Search';

// import DateFnsUtils from '@date-io/date-fns';

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { categories, location, pageTitlesAndDescriptions } from '../dbSchema';
import Rent from '../Components/Rent';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { useFirestoreConnect, useFirebase } from 'react-redux-firebase';
import { getRents, getFilteredRents } from '../Redux/actions/dataActions';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import DialpadRoundedIcon from '@material-ui/icons/DialpadRounded';
import IconButton from '@material-ui/core/IconButton'
import { Helmet } from 'react-helmet';

const filters = [
    {
        value: 'Tövsiyə olunan',
    },
    {
        value: 'Bahadan ucuza',
    },
    {
        value: 'Ucuzdan bahaya',
    }
];

const selectWallpaper = (category) => {
    switch (category) {
        case 'Fotoqrafiya':
            return 'WP-photo';
        case 'Dron':
            return 'WP-drone';
        case 'Skuter':
            return 'WP-scooter';
        case 'Təmir alətləri':
            return 'WP-tools';
        case 'Video Oyun':
            return 'WP-game';
        case 'İdman':
            return 'WP-fitness';
        case 'Musiqi':
            return 'WP-music';
        case 'Bağ və Həyət':
            return 'WP-home';
        case 'Səyahət':
            return 'WP-travel';
        case 'Kitablar':
            return 'WP-books';
        case 'Əyləncə':
            return 'WP-board-games';
        case 'Velosiped':
            return 'WP-bicycle';
        case 'Elektronika':
            return 'WP-technology';
        case 'Hobbi':
            return 'WP-drawing';
        case 'Avadanlıq':
            return 'WP-equipment';
        case 'Xidmətlər':
            return 'WP-service';
        case 'Uşaq və Körpə':
            return 'WP-kid_stroller';
        default:
            return '';
    }
}

const selectTitleDesc = (category) => {
    switch (category) {
        case 'Fotoqrafiya':
            return 'category_photography';
        // case 'Dron':
        //     return 'WP-drone';
        // case 'Skuter':
        //     return 'WP-scooter';
        // case 'Təmir alətləri':
        //     return 'WP-tools';
        case 'Video Oyun':
            return 'category_videoGames';
        // case 'İdman':
        //     return 'WP-fitness';
        // case 'Musiqi':
        //     return 'WP-music';
        // case 'Bağ və Həyət':
        //     return 'WP-home';
        // case 'Səyahət':
        //     return 'WP-travel';
        case 'Kitablar':
            return 'category_books';
        case 'Əyləncə':
            return 'category_boardGames';
        // case 'Velosiped':
        //     return 'WP-bicycle';
        case 'Elektronika':
            return 'category_Electronics';
        // case 'Hobbi':
        //     return 'WP-drawing';
        // case 'Avadanlıq':
        //     return 'WP-equipment';
        // case 'Xidmətlər':
        //     return 'WP-service';
        // case 'Uşaq və Körpə':
        //     return 'WP-kid_stroller';
        default:
            return 'category_All';
    }
}

const Categories = (props) => {

    const matches_600 = useMediaQuery('(min-width:600px)');
    const matches_703 = useMediaQuery('(min-width:703px)');

    const [filterDetails, setFilterDetails] = useState({
        category: '',
        subcategory: '',
        city: '',
        district: '',
        province: ''
    });

    let searchUrl = new URLSearchParams(props.location.search);

    let category = searchUrl.get('category');
    let subcategory = searchUrl.get('subcategory');
    let search = searchUrl.get('search');
    let city = searchUrl.get('city');
    // console.log(categories.find((each) => each.name === category))

    const catInstance = categories.find((each) => each.name === category);
    const subcatInstance = catInstance &&
        catInstance.sub &&
        catInstance.sub.find(each => each.name === subcategory);

    const citInstance = location.find((each) => each.name === city);

    const [currentCategory, setCurrentCategory] = useState(catInstance && category);
    const [currentSubCategory, setCurrentSubCategory] = useState(subcatInstance && subcategory);
    const [currentSearch, setCurrentSearch] = useState(search);
    const [wallpaper, setWallpaper] = useState(catInstance && category);

    // const [temp_Category, setTemp_Category] = useState(catInstance && category);
    const [temp_Search, setTemp_Search] = useState(search);

    const [currentCity, setCurrentCity] = useState(citInstance && city);

    // useFirestoreConnect(() => [
    //     {
    //         collection: 'rents',
    //         where: [['category', '==', 'Fotoqrafiya']],
    //         where: [['subcategory', '==', 'Kameralar']],
    //         // where: [['city', '==', 'Bakı-Abşeron']],
    //         orderBy: [['daily', 'desc']],
    //         // orderBy: [['filter']],
    //         // startAt: [['gi']],
    //         // endAt: [['gi' + "\uf8ff"]],

    //         storeAs: 'fRents'
    //     } // or `todos/${props.todoId}`
    // ])

    const { filteredRents } = props.data;


    useEffect(() => {

        window.scrollTo(0, 0);

        if (catInstance) {
            setCurrentCategory(category);
            setWallpaper(category);
            // setTemp_Category(category);
            setIsCategoryChanged(true);

            if (subcatInstance) {
                setCurrentSubCategory(subcategory);
            }
        }


        if (search) {
            setCurrentSearch(search);
            setTemp_Search(search);
        }

        if (citInstance) {
            setCurrentCity(city);
            setIsCityChanged(true);
        }

        setFilterDetails({
            ...filterDetails,
            category: categories.find((each) => each.name === category) ? category : '',
            subcategory: catInstance && catInstance.sub && catInstance.sub.find(each => each.name === subcategory) ? subcategory : '',
            city: location.find((each) => each.name === city) ? city : ''
        })

    }, [category, subcategory, search, city])

    useEffect(() => {
        if (currentSearch && currentCategory && currentSubCategory && currentCity) {
            props.getFilteredRents({
                search: currentSearch.trim().toLowerCase(),
                category: currentCategory,
                subcategory: currentSubCategory,
                city: currentCity
            });
        }
        else if (currentSearch && currentCategory && !currentSubCategory && currentCity) {
            props.getFilteredRents({
                search: currentSearch.trim().toLowerCase(),
                category: currentCategory,
                city: currentCity
            });
        }
        else if (currentSearch && currentCategory && !currentSubCategory && !currentCity) {
            props.getFilteredRents({ search: currentSearch.trim().toLowerCase(), category: currentCategory });
        }
        else if (currentSearch && !currentCategory && !currentSubCategory && currentCity) {
            props.getFilteredRents({ search: currentSearch.trim().toLowerCase(), city: currentCity });
        }
        else if (!currentSearch && currentCategory && !currentSubCategory && currentCity) {
            props.getFilteredRents({ category: currentCategory, city: currentCity });
        }
        else if (currentSearch && currentCategory && currentSubCategory && !currentCity) {
            props.getFilteredRents({ search: currentSearch.trim().toLowerCase(), category: currentCategory, subcategory: currentSubCategory });
        }
        else if (!currentSearch && currentCategory && currentSubCategory && currentCity) {
            props.getFilteredRents({ category: currentCategory, subcategory: currentSubCategory, city: currentCity });
        }
        else if (!currentSearch && currentCategory && currentSubCategory && !currentCity) {
            props.getFilteredRents({ category: currentCategory, subcategory: currentSubCategory });
        }
        else if (currentSearch) {
            props.getFilteredRents({ search: currentSearch.trim().toLowerCase() });
        }
        else if (currentCategory) {
            props.getFilteredRents({ category: currentCategory });
        }
        else if (currentCity) {
            props.getFilteredRents({ city: currentCity });
        }
        else {
            props.getFilteredRents({});
        }
    }, [currentSearch, currentCategory, currentSubCategory, currentCity])

    const [isCategoryChanged, setIsCategoryChanged] = useState(false);
    const [isCityChanged, setIsCityChanged] = useState(false);
    const [isDistrictChanged, setIsDistrictChanged] = useState(false);

    const handleFilter = () => {
        if (filterDetails.category !== '') {
            searchUrl.has('category') ? searchUrl.set('category', filterDetails.category) : searchUrl.append('category', filterDetails.category);
            setCurrentCategory(filterDetails.category);
            setWallpaper(filterDetails.category);
        } else {
            searchUrl.delete('category');
            setCurrentCategory(filterDetails.category);
            setWallpaper(null);
        }

        if (filterDetails.subcategory !== '') {
            searchUrl.has('subcategory') ? searchUrl.set('subcategory', filterDetails.subcategory) : searchUrl.append('subcategory', filterDetails.subcategory);
            setCurrentSubCategory(filterDetails.subcategory);
        } else {
            searchUrl.delete('subcategory');
            setCurrentSubCategory(filterDetails.subcategory);
        }

        if (temp_Search) {
            const filteredTemp_Search = temp_Search.trim();
            searchUrl.has('search') ? searchUrl.set('search', filteredTemp_Search) : searchUrl.append('search', filteredTemp_Search);
            setCurrentSearch(filteredTemp_Search);
        } else {
            searchUrl.delete('search');
            setCurrentSearch(temp_Search);
        }

        if (filterDetails.city !== '') {
            searchUrl.has('city') ? searchUrl.set('city', filterDetails.city) : searchUrl.append('city', filterDetails.city);
            setCurrentCity(filterDetails.city);
            // setWallpaper(temp_Category);
        } else {
            searchUrl.delete('city');
            setCurrentCity(filterDetails.city);
        }

        window.history.replaceState({}, '', `${props.location.pathname}?${searchUrl}`);
    }

    const [showFilters, setShowFilter] = useState(false);

    const [openCategory1, setOpenCategory1] = useState(false);
    const [openCategory2, setOpenCategory2] = useState(false);

    const [openCity, setOpenCity] = useState(false);
    const [openDistrict, setOpenDistrict] = useState(false);
    const [openProvince, setOpenProvince] = useState(false);

    return (
        <div className='main'>
            <Helmet>
                <title>{pageTitlesAndDescriptions[selectTitleDesc(currentCategory)].title}</title>
                <meta name="description" content={pageTitlesAndDescriptions[selectTitleDesc(currentCategory)].description} />
            </Helmet>


            <div className={`wallpaper_categories ${selectWallpaper(wallpaper)}`} style={{ display: wallpaper ? 'block' : 'none' }}>
                {/* <div>
                    <p>Almaq nəyə lazım,</p>
                    <p>Kirayələmək mümkündürsə?</p>
                    <img src={require('../Images/mandarent_Drawing3.png')} alt="" />
                </div> */}
            </div>

            <div className='container'>
                <div className='searchBar_categories' style={{ marginTop: wallpaper ? 'unset' : 110 }}>
                    <div className='searchBar_categories_SearchBox'>
                        <TextField
                            fullWidth
                            style={{ marginBottom: showFilters && !matches_600 ? 0 : '1.5rem' }}
                            id="outlined-search"
                            placeholder='Mən axtarıram'
                            type="search"
                            variant="outlined"
                            defaultValue={temp_Search}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <SearchIcon color='primary' />
                                </InputAdornment>,
                            }}
                            onChange={(e) => {
                                if (e.target.value.trim() !== '') {
                                    // setCurrentCategory(value.name);
                                    // setWallpaper(value.name);
                                    setTemp_Search(e.target.value);
                                }
                                else {
                                    // setCurrentCategory(null);
                                    setTemp_Search(null);
                                }
                            }}
                        />

                        {!matches_600 &&
                            <IconButton
                                className='searchBar_categories_SearchFilterBtn'
                                color='secondary'
                                onClick={() => setShowFilter((prevState) => !prevState)}
                            >
                                <DialpadRoundedIcon fontSize='large' color='error' />
                            </IconButton>

                        }

                        {!matches_703 && matches_600 &&
                            <div>
                                <FormControl fullWidth variant="outlined" style={{ marginBottom: '1.5rem' }}>
                                    <InputLabel id="city_label" >Şəhəri seçin</InputLabel>
                                    <Select
                                        name='city'
                                        labelId="city_label"
                                        id="city"
                                        open={openCity}
                                        onOpen={() => {
                                            setOpenCity(true);

                                            // setFilterDetails({
                                            //     ...filterDetails,
                                            //     district: ''
                                            // })
                                            // setIsCityChanged(false)
                                        }}
                                        onChange={(event) => {
                                            setFilterDetails({
                                                ...filterDetails,
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
                                        defaultValue={filterDetails.city}
                                        label="Şəhəri seçin"
                                        MenuProps={{
                                            style: { maxHeight: 300 },
                                            onExited: () => document.activeElement.blur()
                                        }}
                                    >
                                        <MenuItem key='city1-none' value=''><span style={{ fontSize: '1.5rem' }}>∅</span></MenuItem>
                                        {location.map(each => {
                                            return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                        })}

                                    </Select>
                                </FormControl>
                                {isCityChanged && filterDetails.city === location[0].name ?
                                    (
                                        <>
                                            <FormControl fullWidth variant="outlined" style={{ marginBottom: '1.5rem' }}>
                                                <InputLabel id="district_label" >Rayonu seçin</InputLabel>
                                                <Select
                                                    name='district'
                                                    labelId="district_label"
                                                    id="district"
                                                    open={openDistrict}
                                                    onOpen={() => {
                                                        setOpenDistrict(true);

                                                        // setFilterDetails({
                                                        //     ...filterDetails,
                                                        //     province: ''
                                                        // })
                                                        // setIsDistrictChanged(false)
                                                    }}
                                                    onChange={(event) => {
                                                        setFilterDetails({
                                                            ...filterDetails,
                                                            district: event.target.value,
                                                            province: ''
                                                        })

                                                        setIsDistrictChanged(true)
                                                    }}
                                                    onClose={(event) => {
                                                        setOpenDistrict(false);
                                                        setIsDistrictChanged(true)
                                                    }}

                                                    label="Rayonu seçin"
                                                    MenuProps={{
                                                        style: { maxHeight: 300 },
                                                        onExited: () => document.activeElement.blur()
                                                    }}
                                                >
                                                    <MenuItem key='district1-none' value=''><span style={{ fontSize: '1.5rem' }}>∅</span></MenuItem>
                                                    {location[0].districts.map(each => {
                                                        return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                    })}

                                                </Select>
                                            </FormControl>

                                            {isDistrictChanged && filterDetails.district && location[0].districts.find(district => district.name === filterDetails.district).sub ?
                                                <FormControl fullWidth variant="outlined" style={{ marginBottom: '1.5rem' }}>
                                                    <InputLabel id="province_label" >Qəsəbəni seçin</InputLabel>
                                                    <Select
                                                        name='province'
                                                        labelId="province_label"
                                                        id="province"
                                                        open={openProvince}
                                                        onOpen={() => setOpenProvince(true)}
                                                        onChange={(event) => {
                                                            setFilterDetails({
                                                                ...filterDetails,
                                                                province: event.target.value
                                                            })
                                                        }}
                                                        onClose={(event) => setOpenProvince(false)}

                                                        label="Qəsəbəni seçin"
                                                        MenuProps={{
                                                            style: { maxHeight: 300 },
                                                            onExited: () => document.activeElement.blur()
                                                        }}
                                                    >
                                                        <MenuItem key='province1-none' value=''><span style={{ fontSize: '1.5rem' }}>∅</span></MenuItem>
                                                        {location[0].districts.find(district => district.name === filterDetails.district).sub.map(each => {
                                                            return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                        })}
                                                    </Select>
                                                </FormControl>
                                                :
                                                <>
                                                    {isDistrictChanged && setIsDistrictChanged(false)}
                                                </>

                                            }
                                        </>
                                    )
                                    : <>
                                        {isCityChanged && setIsCityChanged(false)}
                                    </>
                                }
                            </div>
                        }
                    </div>
                    {(showFilters || matches_600) &&
                        <>
                            <div>
                                <FormControl fullWidth variant="outlined" style={{ marginBottom: isCategoryChanged ? '1.5rem' : '' }}>
                                    <InputLabel id="category1_label" >Əsas Kateqoriya</InputLabel>
                                    <Select
                                        name='category1'
                                        labelId="category1_label"
                                        id="category1"
                                        open={openCategory1}
                                        value={filterDetails.category}
                                        onOpen={() => {
                                            setOpenCategory1(true);

                                            // setFilterDetails({
                                            //     ...filterDetails,
                                            //     subcategory: ''
                                            // })
                                            // setIsCategoryChanged(false)
                                        }}
                                        onChange={(event) => {
                                            setFilterDetails({
                                                ...filterDetails,
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
                                        MenuProps={{
                                            style: { maxHeight: 300 },
                                            onExited: () => document.activeElement.blur()
                                        }}
                                    >

                                        <MenuItem key='category1-none' value=''><span style={{ fontSize: '1.5rem' }}>∅</span></MenuItem>
                                        {categories.map(each => {
                                            return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                        })}

                                    </Select>
                                </FormControl>

                                {(isCategoryChanged && filterDetails.category && categories.find(category => category.name === filterDetails.category).sub) ?
                                    <>
                                        <FormControl fullWidth variant="outlined" style={{ marginBottom: matches_703 ? '1.5rem' : 0 }}>
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
                                                    setFilterDetails({
                                                        ...filterDetails,
                                                        subcategory: event.target.value
                                                    })
                                                }}
                                                onClose={(event) => {
                                                    setOpenCategory2(false);
                                                }}
                                                value={filterDetails.subcategory}
                                                label="İkincil Kateqoriya"
                                                MenuProps={{
                                                    style: { maxHeight: 300 },
                                                    onExited: () => document.activeElement.blur()
                                                }}
                                            >
                                                <MenuItem key='subcategory1-none' value=''><span style={{ fontSize: '1.5rem' }}>∅</span></MenuItem>
                                                {categories.find(category => category.name === filterDetails.category).sub.map(each => {
                                                    return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                })}

                                            </Select>
                                        </FormControl>
                                    </>

                                    :
                                    <>
                                        {isCategoryChanged && setIsCategoryChanged(false)}
                                    </>
                                }
                            </div>
                            {(showFilters || matches_703) && (!matches_600 || matches_703) &&
                                <div>
                                    <FormControl fullWidth variant="outlined" style={{ marginBottom: '1.5rem' }}>
                                        <InputLabel id="city_label" >Şəhəri seçin</InputLabel>
                                        <Select
                                            name='city'
                                            labelId="city_label"
                                            id="city"
                                            open={openCity}
                                            onOpen={() => {
                                                setOpenCity(true);

                                                // setFilterDetails({
                                                //     ...filterDetails,
                                                //     district: ''
                                                // })
                                                // setIsCityChanged(false)
                                            }}
                                            onChange={(event) => {
                                                setFilterDetails({
                                                    ...filterDetails,
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
                                            MenuProps={{
                                                style: { maxHeight: 300 },
                                                onExited: () => document.activeElement.blur()
                                            }}
                                            value={filterDetails.city}
                                        >
                                            <MenuItem key='city1-none' value=''><span style={{ fontSize: '1.5rem' }}>∅</span></MenuItem>
                                            {location.map(each => {
                                                return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                            })}

                                        </Select>
                                    </FormControl>
                                    {isCityChanged && filterDetails.city === location[0].name ?
                                        (
                                            <>
                                                <FormControl fullWidth variant="outlined" style={{ marginBottom: '1.5rem' }}>
                                                    <InputLabel id="district_label" >Rayonu seçin</InputLabel>
                                                    <Select
                                                        name='district'
                                                        labelId="district_label"
                                                        id="district"
                                                        open={openDistrict}
                                                        onOpen={() => {
                                                            setOpenDistrict(true);

                                                            // setFilterDetails({
                                                            //     ...filterDetails,
                                                            //     province: ''
                                                            // })
                                                            // setIsDistrictChanged(false)
                                                        }}
                                                        onChange={(event) => {
                                                            setFilterDetails({
                                                                ...filterDetails,
                                                                district: event.target.value,
                                                                province: ''
                                                            })

                                                            setIsDistrictChanged(true)
                                                        }}
                                                        onClose={(event) => {
                                                            setOpenDistrict(false);
                                                            setIsDistrictChanged(true)
                                                        }}

                                                        label="Rayonu seçin"
                                                        MenuProps={{
                                                            style: { maxHeight: 300 },
                                                            onExited: () => document.activeElement.blur()
                                                        }}
                                                    >
                                                        <MenuItem key='district1-none' value=''><span style={{ fontSize: '1.5rem' }}>∅</span></MenuItem>
                                                        {location[0].districts.map(each => {
                                                            return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                        })}

                                                    </Select>
                                                </FormControl>
                                                {isDistrictChanged && filterDetails.district && location[0].districts.filter(district => district.name === filterDetails.district)[0].sub ?
                                                    <>
                                                        <FormControl fullWidth variant="outlined" style={{ marginBottom: '1.5rem' }}>
                                                            <InputLabel id="province_label" >Qəsəbəni seçin</InputLabel>
                                                            <Select
                                                                name='province'
                                                                labelId="province_label"
                                                                id="province"
                                                                open={openProvince}
                                                                onOpen={() => setOpenProvince(true)}
                                                                onChange={(event) => {
                                                                    setFilterDetails({
                                                                        ...filterDetails,
                                                                        province: event.target.value
                                                                    })
                                                                }}
                                                                onClose={(event) => setOpenProvince(false)}

                                                                label="Qəsəbəni seçin"
                                                                MenuProps={{
                                                                    style: { maxHeight: 300 },
                                                                    onExited: () => document.activeElement.blur()
                                                                }}
                                                            >
                                                                <MenuItem key='province1-none' value=''><span style={{ fontSize: '1.5rem' }}>∅</span></MenuItem>
                                                                {location[0].districts.filter(district => district.name === filterDetails.district)[0].sub.map(each => {
                                                                    return <MenuItem key={each.name} value={each.name}>{each.name}</MenuItem>
                                                                })}

                                                            </Select>
                                                        </FormControl>
                                                    </>
                                                    :
                                                    <>
                                                        {isDistrictChanged && setIsDistrictChanged(false)}
                                                    </>

                                                }
                                            </>
                                        )
                                        : <>
                                            {isCityChanged && setIsCityChanged(false)}
                                        </>
                                    }
                                </div>
                            }

                        </>
                    }

                </div>
                <div className='categories_search_btnBox'>
                    <Button
                        variant='contained'
                        size='large'
                        color='secondary'
                        className='lightRedColor_btn'
                        // fullWidth
                        onClick={handleFilter}
                    >
                        Axtar
                        </Button>
                </div>
                <Divider variant='fullWidth' />

                <div className='header_filter'>
                    <div className='header_filter_headerBox'>
                        {/* <img src={require('../Images/mandarin.svg')} alt='mandarin' /> */}
                        <h2 className='categoriesHeader_txt'>Trend təkliflər</h2>
                    </div>

                    <TextField
                        select
                        label='Filtrələ'
                        // onChange={handleChange}
                        variant="filled"
                        className='filterInput'
                        size='small'
                        SelectProps={{
                            className: 'filterInputInside',
                            MenuProps: { onExited: () => document.activeElement.blur() }
                        }}
                        defaultValue={filters[0].value}
                    >
                        {filters.map((option) => (
                            <MenuItem key={option.value} value={option.value} >
                                {option.value}
                            </MenuItem>
                        ))}
                    </TextField>

                </div>

                <div className='categoriesRentalsBox'>

                    {filteredRents.length > 0 &&
                        <div className='categoriesRentals'>

                            {filteredRents.map(rent => <Rent key={rent.id} rent={rent} history={props.history} />)}

                            {filteredRents.length === 1 ?
                                <>
                                    <div></div>
                                    <div></div>
                                </>
                                : filteredRents.length === 2 ?
                                    <div></div>
                                    : null
                            }
                        </div>
                    }

                    <div className='empty_Data' style={{ display: filteredRents.length > 0 ? 'none' : 'flex' }}>
                        <img src={require('../Images/undraw_empty.svg')} alt='boş' />
                        <span>Belə mövcud bir elan yoxdur.</span>
                    </div>

                    {filteredRents.length % 12 === 0 && <span className='showMore' >( daha çox göstər )</span>}

                </div>
            </div>
        </div>
    )
}

Categories.propTypes = {
    getRents: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapActionsToProps = { getRents, getFilteredRents };

const mapStateToProps = (state) => ({
    data: state.data
})


export default connect(mapStateToProps, mapActionsToProps)(Categories);