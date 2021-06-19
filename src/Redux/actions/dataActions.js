import * as actionTypes from '../types';

// import axios from 'axios';
import { getIpAddress, pay, sendSMS } from './userActions';
import uuidv4 from 'uuid/v4';
import { firebase, storage } from '../../Firebase';

import dayjs from '../../util/customDayJs';

async function getSortedData(db, lastRentData) {
    let offerBasedData = !lastRentData
        ? await db.collection('rents').where('sortIndex', '>', 0).orderBy('sortIndex', 'desc').limit(actionTypes.RENT_DATA_LIMIT).get()
        : await db.collection('rents').where('sortIndex', '>', 0).orderBy('sortIndex', 'desc').startAfter(lastRentData).limit(actionTypes.RENT_DATA_LIMIT).get();

    let timeBasedData = [];
    if (offerBasedData.size < 12)
        timeBasedData = !lastRentData
            ? await db.collection('rents').where('sortIndex', '==', 0).orderBy('createdAt', 'desc').limit(actionTypes.RENT_DATA_LIMIT - offerBasedData.size).get()
            : await db.collection('rents').where('sortIndex', '==', 0).orderBy('createdAt', 'desc').startAfter(lastRentData).limit(actionTypes.RENT_DATA_LIMIT - offerBasedData.size).get();

    return timeBasedData.docs ? offerBasedData.docs.concat(timeBasedData.docs) : offerBasedData.docs;
}

export const getRents = () => (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: actionTypes.LOADING_DATA });
    const db = getFirestore();

    Promise.resolve().then(() => getSortedData(db, null))
        .then((data) => {
            let rents = [];
            data.forEach(doc => {
                rents.push({ ...doc.data(), id: doc.id });
            });

            dispatch({
                type: actionTypes.LAST_RENT_DATA,
                payload: data[data.length - 1]
            })

            return rents;
        })
        .then((data) => {
            dispatch({
                type: actionTypes.SET_RENTS,
                payload: data
            })
        })
        .catch((err) => {
            dispatch({
                type: actionTypes.SET_RENTS,
                payload: []
            })
        });
}

export const showMoreRents = () => (dispatch, getState, { getFirebase, getFirestore }) => {
    // dispatch({ type: actionTypes.LOADING_DATA });
    const db = getFirestore();
    const state = getState();


    Promise.resolve().then(() => getSortedData(db, state.data.lastRentData))
        .then((data) => {
            if (data.length > 0) {
                let moreRents = [];
                data.forEach(doc => {
                    moreRents.push({ ...doc.data(), id: doc.id });
                });

                dispatch({
                    type: actionTypes.LAST_RENT_DATA,
                    payload: data.length < actionTypes.RENT_DATA_LIMIT ? null : data[data.length - 1]
                })

                return moreRents;
            }
            else {
                dispatch({
                    type: actionTypes.LAST_RENT_DATA,
                    payload: null
                })
            }
        })
        .then((data) => {
            if (data)
                dispatch({
                    type: actionTypes.SET_MORE_RENTS,
                    payload: data
                })
        })
        .catch((err) => {
            console.log(err)
            dispatch({
                type: actionTypes.SET_MORE_RENTS,
                payload: []
            })
        });
}

export const getDemands = () => (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: actionTypes.LOADING_DATA });
    const db = getFirestore();

    db.collection('demands').orderBy('createdAt', 'desc').get()
        .then((data) => {
            // console.log(data.docs[0].data())
            let demands = [];
            data.forEach(doc => {
                demands.push({ ...doc.data(), id: doc.id });
            });

            return demands;
        })
        .then((data) => {
            dispatch({
                type: actionTypes.SET_DEMANDS,
                payload: data
            })
        })
        .catch((err) => {
            console.error(err);
            dispatch({
                type: actionTypes.SET_DEMANDS,
                payload: []
            })
        });
}

export const getLikedRents = (_likes) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const state = getState();
    const likes = _likes;

    if (likes.length > 0) {
        Promise.all(likes.map(data => db.doc(`/rents/${data}`).get()))
            .then((docs) => {
                if (docs.length > 0) {
                    return dispatch({
                        type: actionTypes.SET_LIKEDRENTS,
                        payload: state.data.likedRentsList.concat(docs.map((each, index) => {
                            return { ...each.data(), id: likes[index] }
                        }))
                    })
                }
            })
            .catch((err) => {
                console.log(err);
                return dispatch({
                    type: actionTypes.SET_LIKEDRENTS,
                    payload: state.data.likedRentsList
                })
            });
    }
    else {
        dispatch({
            type: actionTypes.SET_LIKEDRENTS,
            payload: []
        })
    }
}

export const likeRent = (rentId) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const state = getState();
    const currentUser = state.firebase.auth;

    let likes = state.firebase.profile.likes;
    if (!likes.find(each => each === rentId)) {
        likes.unshift(rentId);
        db.doc(`/users/${currentUser.uid}`).update({ likes: likes });
    }
}

export const unlikeRent = (rentId) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();

    const state = getState();
    const currentUser = state.firebase.auth;

    let likes = state.firebase.profile.likes;

    if (likes.find(each => each === rentId))
        db.doc(`/users/${currentUser.uid}`).update({ likes: likes.filter(each => each !== rentId) })
            .then(() => {
                return dispatch({
                    type: actionTypes.SET_LIKEDRENTS,
                    payload: state.data.likedRentsList.filter(each => each.id !== rentId)
                })
            })
            .catch(err => {
                console.log(err);
            })
}

export const getRent = (rentId) => (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: actionTypes.LOADING_DATA });

    const db = getFirestore();
    // const state = getState();
    let rentData = {};
    db.doc(`/rents/${rentId}`).get()
        .then(doc => {
            rentData = doc.data();
            if (rentData.verified || rentData.preVerified) {
                rentData.id = doc.id;
                return db.collection('comments').where('rentId', '==', rentId).get()
                    .then((data) => {
                        rentData.comments = [];
                        data.forEach(doc => {
                            rentData.comments.push({ ...doc.data(), commentId: doc.id })
                        });

                        return db.collection('offers').where('rentId', '==', rentId).get();
                    })
                    .then((data) => {
                        rentData.offers = [];
                        data.forEach(doc => {
                            rentData.offers.push({ start_date: doc.data().start_date, end_date: doc.data().end_date })
                        });
                        return db.collection('rents').where('userId', '==', rentData.userId).get();
                    })
                    .then((data) => {
                        rentData.otherRents = [];
                        data.forEach(doc => {
                            if (doc.id != rentId) {
                                rentData.otherRents.push({ ...doc.data(), id: doc.id });
                            }
                        });

                        return rentData;
                    })
                    .then((data) => {
                        dispatch({
                            type: actionTypes.GET_RENT,
                            payload: data
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            else {
                return dispatch({
                    type: actionTypes.GET_RENT,
                    payload: {}
                });
            }
        })
        .catch(err => {
            console.log(err);
        })
}

export const removeRent = () => (dispatch) => {
    dispatch({ type: actionTypes.REMOVE_RENT });
}

export const postRent = (newRent, history) => (dispatch, getState, { getFirebase, getFirestore }) => {
    // dispatch({ type: actionTypes.LOADING_UI });
    const db = getFirestore();
    const state = getState();
    // const batch = db.batch();

    const isElit = state.firebase.profile.elit ? true : dayjs(dayjs()).isSameOrBefore(dayjs('2021-01-05'), 'd') ? true : false;

    const newRentDetails = {
        name: newRent.product,
        filter: newRent.product.toLowerCase(),
        // imageUrls: newRent.imageUrls,
        category: newRent.category,
        subcategory: newRent.subcategory,
        description: newRent.description,
        howToUse: newRent.howToUse,
        timePrice: newRent.timePrice,
        daily: newRent.daily,
        weekly_discount: newRent.weekly_discount,
        monthly_discount: newRent.monthly_discount,
        city: newRent.city,
        district: newRent.district,
        province: newRent.province,
        minTime: newRent.minTime,
        minDay: newRent.minDay,
        commentCount: 0,
        offerCount: 0,
        rating: [],
        sortIndex: 0,
        userId: state.firebase.auth.uid,
        userPhoto: state.firebase.profile.photoUrl,
        userFullname: state.firebase.profile.name + ' ' + state.firebase.profile.surname,
        userRating: state.firebase.profile.rating,
        elit: isElit,
        verified:  Boolean(state.firebase.profile.verified),
        createdAt: new Date().toISOString(),
        // createdAt: admin.firestore.Timestamp.fromDate(new Date)
    }

    let docId;

    db.collection('rents').add(newRentDetails)
        .then((doc) => {
            docId = doc.id;
            const filesPath = `Rents/${state.firebase.auth.uid}/${docId}/`;
            return Promise.all(newRent.imageUrls.map(each => storage.ref(filesPath + uuidv4()).put(each.file, { cacheControl: 'public, max-age=31536000' })))
        })
        .then((res) => {
            return Promise.all(res.map(each => each.ref.getDownloadURL()))
        })
        .then((url) => {
            return db.doc(`/rents/${docId}`).update({ imageUrls: url });
        })
        .then(() => Boolean(state.firebase.profile.verified) ? history.push(`/user#belongings`) : history.push(`/rentals/${docId}`))
        .then(() => {
            if (!state.firebase.profile.elit && isElit) {
                return db.doc(`/users/${state.firebase.auth.uid}`).update({ elit: true });
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

export const offerOnRent = (rentId, newOffer, basketId, history) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const state = getState();

    const newOfferDetails = {
        start_date: newOffer.start_date,
        end_date: newOffer.end_date,
        startTime: newOffer.startTime,
        endTime: newOffer.endTime,
        userPhoto: state.firebase.profile.photoUrl,
        price: newOffer.price,
        rentId: rentId,
        rentOwnerFullname: newOffer.rentOwnerFullname,
        rentOwnerPhoto: newOffer.rentOwnerPhoto,
        productName: newOffer.productName,
        fromId: state.firebase.auth.uid,
        toId: newOffer.rentOwner,
        userFullname: state.firebase.profile.name + ' ' + state.firebase.profile.surname,
        userRating: state.firebase.profile.rating,
        imageUrls: newOffer.imageUrls,
        createdAt: new Date().toISOString(),
        calculation: newOffer.calculation,
        status: 'waiting'
    }

    db.doc(`/rents/${rentId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return console.log({ error: 'Rent not found' })
            }

            return dispatch(pay(newOffer.calculation.commission));
        })
        .then(() => {
            return db.collection('offers').add(newOfferDetails);
        })
        .then((doc) => {
            history.push('/user#offers-sent');

            return db.doc(`/notifications/${doc.id}`).set({
                recipient: newOfferDetails.toId,
                sender: newOfferDetails.fromId,
                senderPhoto: newOfferDetails.userPhoto,
                rentName: newOfferDetails.productName,
                title: 'Elanınıza təklif gəlib',
                content: 'Kirayə ver və gəlir əldə et.',
                rentId: rentId,
                type: 'offer',
                link: 'offers',
                createdAt: new Date().toISOString()
            })
        })
        // .then(() => {
        //     return db.doc(`/baskets/${basketId}`).delete();
        // })
        .then(() => db.doc(`/users/${newOfferDetails.toId}`).get())
        .then((doc) => {
            if (doc.exists && doc.data().phoneNumber.trim() !== '') {
                const content = `${newOfferDetails.productName} adlı elanınıza Kirayə Təklifi gəlib. Kirayə ver və gəlir qazan. Sayta keçid et: www.mandarent.com/user#offers-received`;
                const phoneNumber = `994${doc.data().phoneNumber.match(/\d+/g).join('').slice(1)}`;
                return dispatch(sendSMS(phoneNumber, content));
            }
        })
        .catch(err => {
            console.log(err);
        })

}

export const deleteRent = (rentId) => (dispatch, getState, { getFirebase, getFirestore }) => {

    const db = getFirestore();
    const firebaseIns = getFirebase();
    const state = getState();
    const currentUser = state.firebase.auth;
    const storageRef = firebaseIns.storage().ref();
    const document = db.doc(`/rents/${rentId}`);

    // const stor = firebase.storage().ref('').list({ maxResults: 4 })

    document.get()
        .then(doc => {
            if (doc.data().userId === currentUser.uid) {
                return document.delete();
            }
        })
        .then(() => {
            return storageRef.child(`Rents/${currentUser.uid}/${rentId}/`).list({ maxResults: 4 });
        })
        .then((result) => {
            return result.items.forEach(each => each.delete());
        })
        .catch(err => {
            console.log(err);
        })
}

export const editRentDetails = (rentId, rentDetails, previousList) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const state = getState();
    const firebaseIns = getFirebase();
    const storageRef = firebaseIns.storage().ref();

    db.doc(`/rents/${rentId}`).update(rentDetails)
        .then(() => {
            previousList.imageUrls.forEach(each => {
                if (!rentDetails.imageUrls.find(img => img === each)) {
                    storageRef.child(`Rents/${state.firebase.auth.uid}/${rentId}/${each.split('%2F')[3].split('?alt')[0]}`).delete();
                }
            })
        })
        .catch(err => console.log(err));
}

export const getProfileData = (userId) => (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: actionTypes.LOADING_DATA });
    const db = getFirestore();

    let userData = {};
    db.doc(`/users/${userId}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.user = { ...doc.data(), id: doc.id };
                return db.collection('rents').where('userId', '==', userId)
                    .orderBy('createdAt', 'desc')
                    .limit(9)
                    .get();
            }
            else {
                return console.log({ error: 'User not found' });
            }
        })
        .then((data) => {
            userData.rents = [];
            if (!data.empty)
                data.forEach(doc => {
                    userData.rents.push({
                        ...doc.data(),
                        id: doc.id
                    })
                })

            return db.collection('comments').where('recipient', '==', userId).orderBy('createdAt', 'desc').get();
        })
        .then((data) => {
            userData.comments = [];
            if (!data.empty)
                data.forEach(doc => {
                    userData.comments.push({
                        ...doc.data(),
                        commentId: doc.id
                    })
                })

            dispatch({
                type: actionTypes.SET_PROFILE,
                payload: userData
            })

        })
        .catch(err => {
            console.log(err);
        })
}

export const removeProfileData = () => (dispatch) => {
    dispatch({ type: actionTypes.REMOVE_PROFILE });
}

export const clearErrors = () => (dispatch) => {
    dispatch({ type: actionTypes.CLEAR_ERRORS })
}

export const getFilteredRents = (filterDetails) => (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: actionTypes.LOADING_DATA });
    const db = getFirestore();

    const state = getState();
    // const currentUser = state.firebase.auth;
    if (
        filterDetails.search &&
        filterDetails.category &&
        filterDetails.subcategory &&
        filterDetails.city
    ) {
        db.collection('rents')
            // .where('name', 'array-contains-any', filterDetails.search.split(''))
            // .where('filter2', 'in', [filterDetails.search])
            .where('category', '==', filterDetails.category)
            .where('subcategory', '==', filterDetails.subcategory)
            .where('city', '==', filterDetails.city)
            .orderBy('filter')
            .startAt(filterDetails.search)
            .endAt(filterDetails.search + "\uf8ff")
            .limit(actionTypes.RENT_DATA_LIMIT)
            .get()
            .then((data) => {
                if (!data.empty) {
                    console.log(data)
                    let filteredRents = [];
                    data.forEach(doc => {
                        filteredRents.push({ ...doc.data(), id: doc.id });
                    });

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: filteredRents
                    })
                }
                else {
                    console.log(data)
                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: []
                    })
                }
            })
            .catch((err) => {
                dispatch({
                    type: actionTypes.SET_FILTERED_RENTS,
                    payload: []
                })
            });
    }
    else if (
        filterDetails.search &&
        filterDetails.category &&
        !filterDetails.subcategory &&
        filterDetails.city
    ) {
        db.collection('rents')
            // .where('name', 'array-contains-any', filterDetails.search.split(''))
            // .where('filter2', 'in', [filterDetails.search])
            .where('category', '==', filterDetails.category)
            .where('city', '==', filterDetails.city)
            .orderBy('filter')
            .startAt(filterDetails.search)
            .endAt(filterDetails.search + "\uf8ff")
            .limit(actionTypes.RENT_DATA_LIMIT)
            .get()
            .then((data) => {
                if (!data.empty) {

                    let filteredRents = [];
                    data.forEach(doc => {
                        filteredRents.push({ ...doc.data(), id: doc.id });
                    });

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: filteredRents
                    })
                }
                else {

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: []
                    })
                }
            })

            .catch((err) => {
                dispatch({
                    type: actionTypes.SET_FILTERED_RENTS,
                    payload: []
                })
            });
    }
    else if (
        filterDetails.search &&
        filterDetails.category &&
        !filterDetails.subcategory &&
        !filterDetails.city
    ) {
        db.collection('rents')
            .where('category', '==', filterDetails.category)
            .orderBy('filter')
            .startAt(filterDetails.search)
            .endAt(filterDetails.search + "\uf8ff")
            .limit(actionTypes.RENT_DATA_LIMIT)
            .get()
            .then((data) => {
                if (!data.empty) {

                    let filteredRents = [];
                    data.forEach(doc => {
                        filteredRents.push({ ...doc.data(), id: doc.id });
                    });

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: filteredRents
                    })
                }
                else {
                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: []
                    })
                }
            })
            .catch((err) => {
                dispatch({
                    type: actionTypes.SET_FILTERED_RENTS,
                    payload: []
                })
            });
    }
    else if (
        !filterDetails.search &&
        filterDetails.category &&
        !filterDetails.subcategory &&
        filterDetails.city
    ) {
        db.collection('rents')
            .where('category', '==', filterDetails.category)
            .where('city', '==', filterDetails.city)
            .limit(actionTypes.RENT_DATA_LIMIT)
            .get()
            .then((data) => {
                if (!data.empty) {
                    let filteredRents = [];
                    data.forEach(doc => {
                        filteredRents.push({ ...doc.data(), id: doc.id });
                    });

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: filteredRents
                    })
                }
                else {
                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: []
                    })
                }
            })
            .catch((err) => {
                dispatch({
                    type: actionTypes.SET_FILTERED_RENTS,
                    payload: []
                })
            });
    }
    else if (
        filterDetails.search &&
        !filterDetails.category &&
        !filterDetails.subcategory &&
        filterDetails.city
    ) {
        db.collection('rents')
            .where('city', '==', filterDetails.city)
            .orderBy('filter')
            .startAt(filterDetails.search)
            .endAt(filterDetails.search + "\uf8ff")
            .limit(actionTypes.RENT_DATA_LIMIT)
            .get()
            .then((data) => {
                if (!data.empty) {

                    let filteredRents = [];
                    data.forEach(doc => {
                        filteredRents.push({ ...doc.data(), id: doc.id });
                    });

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: filteredRents
                    })
                }
                else {
                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: []
                    })
                }
            })
            .catch((err) => {
                dispatch({
                    type: actionTypes.SET_FILTERED_RENTS,
                    payload: []
                })
            });
    }
    else if (
        filterDetails.search &&
        filterDetails.category &&
        filterDetails.subcategory &&
        !filterDetails.city
    ) {
        db.collection('rents')
            .where('category', '==', filterDetails.category)
            .where('subcategory', '==', filterDetails.subcategory)
            .orderBy('filter')
            .startAt(filterDetails.search)
            .endAt(filterDetails.search + "\uf8ff")
            .limit(actionTypes.RENT_DATA_LIMIT)
            .get()
            .then((data) => {
                if (!data.empty) {

                    let filteredRents = [];
                    data.forEach(doc => {
                        filteredRents.push({ ...doc.data(), id: doc.id });
                    });

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: filteredRents
                    })
                }
                else {

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: []
                    })
                }
            })

            .catch((err) => {
                dispatch({
                    type: actionTypes.SET_FILTERED_RENTS,
                    payload: []
                })
            });
    }
    else if (
        !filterDetails.search &&
        filterDetails.category &&
        filterDetails.subcategory &&
        filterDetails.city
    ) {
        db.collection('rents')
            .where('category', '==', filterDetails.category)
            .where('subcategory', '==', filterDetails.subcategory)
            .where('city', '==', filterDetails.city)
            .limit(actionTypes.RENT_DATA_LIMIT)
            .get()
            .then((data) => {
                if (!data.empty) {

                    let filteredRents = [];
                    data.forEach(doc => {
                        filteredRents.push({ ...doc.data(), id: doc.id });
                    });

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: filteredRents
                    })
                }
                else {

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: []
                    })
                }
            })

            .catch((err) => {
                dispatch({
                    type: actionTypes.SET_FILTERED_RENTS,
                    payload: []
                })
            });
    }
    else if (
        !filterDetails.search &&
        filterDetails.category &&
        filterDetails.subcategory &&
        !filterDetails.city
    ) {
        db.collection('rents')
            .where('category', '==', filterDetails.category)
            .where('subcategory', '==', filterDetails.subcategory)
            .limit(actionTypes.RENT_DATA_LIMIT)
            .get()
            .then((data) => {
                if (!data.empty) {

                    let filteredRents = [];
                    data.forEach(doc => {
                        filteredRents.push({ ...doc.data(), id: doc.id });
                    });

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: filteredRents
                    })
                }
                else {

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: []
                    })
                }
            })

            .catch((err) => {
                dispatch({
                    type: actionTypes.SET_FILTERED_RENTS,
                    payload: []
                })
            });
    }
    else if (filterDetails.search) {
        db.collection('rents')
            .orderBy('filter')
            .startAt(filterDetails.search)
            .endAt(filterDetails.search + "\uf8ff")
            .limit(actionTypes.RENT_DATA_LIMIT)
            .get()
            .then((data) => {
                if (!data.empty) {
                    let filteredRents = [];
                    data.forEach(doc => {
                        filteredRents.push({ ...doc.data(), id: doc.id });
                    });

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: filteredRents
                    })
                }
                else {
                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: []
                    })
                }
            })

            .catch((err) => {
                dispatch({
                    type: actionTypes.SET_FILTERED_RENTS,
                    payload: []
                })
            });
    }
    else if (filterDetails.category) {
        db.collection('rents')
            .where('category', '==', filterDetails.category)
            .limit(actionTypes.RENT_DATA_LIMIT)
            .get()
            .then((data) => {
                if (!data.empty) {
                    let filteredRents = [];
                    data.forEach(doc => {
                        filteredRents.push({ ...doc.data(), id: doc.id });
                    });

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: filteredRents
                    })
                }
                else {
                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: []
                    })
                }
            })
            .catch((err) => {
                dispatch({
                    type: actionTypes.SET_FILTERED_RENTS,
                    payload: []
                })
            });
    }
    else if (filterDetails.city) {
        db.collection('rents')
            .where('city', '==', filterDetails.city)
            .limit(actionTypes.RENT_DATA_LIMIT)
            .get()
            .then((data) => {
                if (!data.empty) {
                    let filteredRents = [];
                    data.forEach(doc => {
                        filteredRents.push({ ...doc.data(), id: doc.id });
                    });

                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: filteredRents
                    })
                }
                else {
                    dispatch({
                        type: actionTypes.SET_FILTERED_RENTS,
                        payload: []
                    })
                }
            })
            .catch((err) => {
                dispatch({
                    type: actionTypes.SET_FILTERED_RENTS,
                    payload: []
                })
            });
    }
    else {
        dispatch({
            type: actionTypes.SET_FILTERED_RENTS,
            payload: []
        })
    }
}


export const addToBasket = (basketDetails, history) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();

    const state = getState();
    const currentUser = state.firebase.auth;

    db.collection('baskets').add({ ...basketDetails, userId: currentUser.uid, createdAt: new Date().toISOString() })
        .then(() => {
            // history.push('/user/basket');
            history.push('/user#offers-sent');
        })
        .catch(err => {
            console.log(err);
        })
}

export const deleteFromBasket = (basketId) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();

    db.doc(`/baskets/${basketId}`).delete().catch(err => console.err);
}

