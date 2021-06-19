// import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTHENTICATED, LOADING_USER, CLOSE_SIGNIN, SEND_MESSAGE, GET_ALL_MESSAGES, DEMAND } from '../types';
import * as actionTypes from '../types';


import axios from 'axios';

import { firebase, storage } from '../../Firebase';
import { calculateRating, validateEmail } from '../../util';

import { templateDocx } from '../../util/customDocxTemplate';
import dayjs from 'dayjs';


// export const loginUser = (userData, history) => (dispatch, getState, { getFirebase }) => {
//     dispatch({ type: actionTypes.LOADING_UI });
//     const firebaseIns = getFirebase();

//     axios.post('/login', userData)
//         .then((res) => {
//             setAuthorizationHeader(res.data.token);
//             dispatch(getUserData());
//             dispatch({ type: actionTypes.CLOSE_SIGNIN })
//             dispatch({ type: actionTypes.CLEAR_ERRORS });

//             // firebaseIns.auth().signInWithEmailAndPassword(userData.email, userData.password);
//         })
//         .catch(err => {
//             dispatch({
//                 type: actionTypes.SET_ERRORS,
//                 payload: err.response.data
//             })

//         })
// }

export const loginUser = (userData, history) => (dispatch, getState, { getFirebase }) => {
    const firebaseIns = getFirebase();
    dispatch({ type: actionTypes.LOADING_UI });

    firebaseIns.auth().signInWithEmailAndPassword(userData.email, userData.password)
        .then(() => {
            dispatch({ type: actionTypes.CLOSE_SIGNIN });
            dispatch({ type: actionTypes.CLEAR_ERRORS });
        })
        .catch((err) => {
            dispatch({
                type: actionTypes.SET_ERRORS,
                payload: err.code === 'auth/user-not-found'
                    ? { general: 'Daxil etdiyiniz məlumatlar yanlışdır.' }
                    : err.code === 'auth/invalid-email'
                        ? { email: 'Daxil etdiyiniz email adresi yanlışdır.' }
                        : err.code === 'auth/wrong-password'
                            ? { password: 'Daxil etdiyiniz şifrə yanlışdır.' }
                            : { general: 'Xahiş olunur bir daha cəhd edəsiniz.' }
            })
        })
}


export const signinWithGoogle = (token) => (dispatch) => {

    // axios.post('/signinWithGoogle', { token })
    //     .then((res) => {
    //         setAuthorizationHeader(res.data.token);
    //         dispatch(getUserData());
    //         // dispatch({ type: CLOSE_SIGNIN })
    //         // dispatch({ type: CLEAR_ERRORS });
    //     })
    //     .catch(err => {
    //         dispatch({
    //             type: actionTypes.SET_ERRORS,
    //             payload: err.response.data
    //         })

    //     })
}

export const checkEmailValidity = (email, next) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();

    if (!validateEmail(email)) {
        dispatch({
            type: actionTypes.SET_ERRORS,
            payload: { general: 'Daxil etdiyiniz email adresi yanlışdır.' }
        })
    }
    else {
        db.collection('users').where('email', '==', email).limit(1).get()
            .then((data) => {
                if (!data.empty) {
                    dispatch({
                        type: actionTypes.SET_ERRORS,
                        payload: { general: 'Email adresi hal-hazırda istifadədədir.' }
                    })
                }
                else {
                    next(1)
                }
            })
    }
}

export const checkPhoneNumberExistence = (phoneNumber, verify) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();

    db.collection('users').where('phoneNumber', '==', phoneNumber).limit(1).get()
        .then((data) => {
            if (!data.empty) {
                dispatch({
                    type: actionTypes.SET_ERRORS,
                    payload: { phone: 'Bu nömrə hal-hazırda istifadədədir.' }
                })
            }
            else {
                verify()
            }
        })

}

export const signupUser = (newUserData, history, handleCloseSignUp) => (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: actionTypes.LOADING_UI });
    const defaultProfileImage = 'profile.jpg';
    const firebaseIns = getFirebase();
    const db = getFirestore();
    const storageRef = firebaseIns.storage().ref();

    storageRef.child(defaultProfileImage).getDownloadURL()
        .then(url => {
            return next(url);
        })
        .catch(err => console.log(err))

    function next(url) {

        let newUser = {
            email: newUserData.email,
            password: newUserData.password,
            createdAt: new Date().toISOString(),
            photoUrl: url,
            elit: false,
            name: newUserData.name,
            surname: newUserData.surname,
            rating: [],
            likes: [],
            balance: 0,
            biography: '',
            phoneNumber: newUserData.phoneNumber
        }

        let userId;

        firebaseIns.auth().createUserWithEmailAndPassword(newUserData.email, newUserData.password)
            .then(data => {
                userId = data.user.uid;
                return db.doc(`/users/${userId}`).set(newUser);
            })
            .then(() => {
                return db.doc(`/onlineChats/${userId}`).set({ online: false });
            })
            .then(() => {
                handleCloseSignUp();
                history.push('/user#profile');
                dispatch({ type: actionTypes.CLOSE_SIGNIN })
                dispatch({ type: actionTypes.CLEAR_ERRORS });
            })
            .catch(err => {
                dispatch({
                    type: actionTypes.SET_ERRORS,
                    payload: { general: 'Xahiş olunur bir daha cəhd edin.' }
                    // payload: err.code === 'auth/email-already-in-use'
                    //     ? { general: 'Email adresi hal-hazırda istifadədədir.' }
                    //     : err.code === 'auth/invalid-email'
                    //         ? { general: 'Daxil etdiyiniz email adresi yanlışdır.' }
                    //         : { general: 'Xahiş olunur bir daha cəhd edəsiniz.' }
                })
            });

    }
}

export const logoutUser = () => (dispatch, getState, { getFirebase }) => {
    const firebaseIns = getFirebase();

    Promise.resolve()
        .then(() => dispatch(setUserOffline()))
        .then(() => firebaseIns.logout())
        .catch((err) => console.log(err));

    // localStorage.removeItem('FBIdToken');
    // delete axios.defaults.headers.common['Authorization'];
    // // window.location.assign('/');
    // dispatch({ type: actionTypes.SET_UNAUTHENTICATED });

}

export const getUserData = () => (dispatch) => {
    // dispatch({ type: actionTypes.LOADING_USER })
    // axios.get('/user')
    //     .then(res => {
    //         dispatch({
    //             type: actionTypes.SET_USER,
    //             payload: res.data
    //         })
    //         dispatch(getAllMessages());
    //     })
    //     .catch(err => console.log(err));
}


export const uploadImage = (file) => (dispatch, getState, { getFirebase, getFirestore }) => {
    // dispatch({ type: actionTypes.LOADING_USER })
    const db = getFirestore();
    const firebaseIns = getFirebase();
    const state = getState();
    const currentUser = state.firebase.auth;

    const filesPath = `Images/${currentUser.uid}/${file.name}`;

    storage.ref(filesPath).put(file, { cacheControl: 'public, max-age=31536000' })
        .then(res => {
            // console.log(res);
            res.ref.getDownloadURL()
                .then((url) => {
                    db.doc(`/users/${currentUser.uid}`).update({ photoUrl: url });
                })
                .catch((err) => {
                    console.log(err);
                })
        })
}

export const editUserDetails = (userDetails) => (dispatch, getState, { getFirebase, getFirestore }) => {

    const db = getFirestore();
    const state = getState();
    const currentUser = state.firebase.auth;

    db.doc(`/users/${currentUser.uid}`).update(userDetails)
        .then(() => {
            return console.log({ message: 'Details added succesfully' });
        })
        .catch(err => console.log(err));
}

export const resetPassword = (email) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebaseIns = getFirebase();
    firebaseIns.resetPassword(email).then(() => dispatch({ type: actionTypes.CLOSE_SIGNIN }));
}

export const changePassword = (currentPassword, newPassword, closeUI) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebaseIns = getFirebase();
    const user = firebaseIns.auth().currentUser;
    user.reauthenticateWithCredential(firebaseIns.auth.EmailAuthProvider.credential(user.email, currentPassword))
        .then(() => {
            return user.updatePassword(newPassword);
        })
        .then(() => {
            closeUI();
            dispatch({ type: actionTypes.CLEAR_ERRORS });
        })
        .catch((err) => {
            if (err.code === "auth/wrong-password")
                dispatch({
                    type: actionTypes.SET_ERRORS,
                    payload: { general: 'Daxil etdiyiniz hal-hazırki şifrə yanlışdır.' }
                })
        });
}

// export const resetEmail = (newEmail) => (dispatch, getState, { getFirebase, getFirestore }) => {
//     const firebaseIns = getFirebase();

//     firebaseIns.updateEmail(newEmail)
//         .then((res) => {
//             console.log(res)
//         })
//         .catch(err => console.log(err))
// }

export const sendMessageNotification = (messageDetails) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();

    db.doc(`/onlineChats/${messageDetails.toId}`).get()
        .then(doc => {
            if (doc.exists && !doc.data().online) {
                return db.collection('notifications').where('sender', '==', messageDetails.fromId)
                    .where('recipient', '==', messageDetails.toId)
                    .where('rentId', '==', messageDetails.rentId)
                    .where('type', '==', 'message').limit(1).get()
            }
        })
        .then((data) => {
            if (data) {
                if (data.empty) {
                    return db.doc(`/notifications/${messageDetails.messageId}`).set({
                        recipient: messageDetails.toId,
                        sender: messageDetails.fromId,
                        senderPhoto: messageDetails.senderPhoto,
                        rentName: messageDetails.productName,
                        title: 'Yeni mesajınız var',
                        content: messageDetails.content,
                        rentId: messageDetails.rentId,
                        type: 'message',
                        link: 'messages',
                        read: false,
                        createdAt: new Date().toISOString()
                    })
                }
                else {
                    return db.doc(`/notifications/${messageDetails.messageId}`).update({
                        recipient: messageDetails.toId,
                        sender: messageDetails.fromId,
                        senderPhoto: messageDetails.senderPhoto,
                        content: messageDetails.content,
                        read: false,
                        createdAt: new Date().toISOString()
                    })
                }
            }
        })
        .catch(err => console.log(err))

}

export const readMessages = (chatId) => (dispatch, getState, { getFirebase, getFirestore }) => {
    // const firebaseIns = getFirebase();
    const db = getFirestore();

    db.doc(`/allMessages/${chatId}`).update({
        unseenMessages: 0
    })
        .catch(err => console.log(err))

}


export const sendMessage = (messageDetails) => (dispatch, getState, { getFirebase, getFirestore }) => {
    // const firebaseIns = getFirebase();
    const db = getFirestore();

    const state = getState();
    const currentUser = state.firebase.auth;
    // console.log(currentUser);
    // firebase.auth().currentUser.updateProfile({displayName})

    // firebase.firestore().doc().update({})

    const newMessage = {
        body: messageDetails.body,
        date: new Date().toISOString(),
        fromId: currentUser.uid,
        toId: messageDetails.toId,
        // seen: false,
    }

    // db.collection('allMessages').where(`${currentUser.uid}.allowed`, '==', true).where(`${messageDetails.toId}.allowed`, '==', true).where('rentId', '==', messageDetails.rentId).limit(1).get()
    //     .then(data => {
    //         console.log(data);
    //         if (data.empty) {
    //             // db.collection('allMessages').add({ bind: { [request.user.uid]: true, [request.params.recipientId]: true } })
    //             db.collection('allMessages')
    //                 .add({
    //                     [currentUser.uid]: { allowed: true, userFullname: state.firebase.profile.name + ' ' + state.firebase.profile.surname, userPhoto: state.firebase.profile.photoUrl },
    //                     [messageDetails.toId]: { allowed: true, userFullname: messageDetails.recipientFullname, userPhoto: messageDetails.recipientPhotoUrl },
    //                     rentId: messageDetails.rentId,
    //                     rentName: messageDetails.rentName,
    //                     rentImage: messageDetails.rentImage,

    //                     last_message: {
    //                         body: newMessage.body,
    //                         date: newMessage.date
    //                     },
    //                     unseenMessages: 1,
    //                     senderId: newMessage.fromId
    //                 })
    //                 .then((doc) => {
    //                     db.collection(`allMessages/${doc.id}/messages`).add(newMessage);

    //                 })
    //                 .catch(err => console.log(err))
    //         }
    //         else {
    db.collection(`allMessages/${messageDetails.messageId}/messages`).add(newMessage)
        .then(() => {
            return db.doc(`allMessages/${messageDetails.messageId}`).update({
                last_message_body: newMessage.body,
                last_message_date: newMessage.date,
                unseenMessages: (messageDetails.unseenMessages !== null && messageDetails.unseenMessages > 0) ? (messageDetails.unseenMessages + 1) : 1,
                senderId: newMessage.fromId
            })
        })
        .then(() => {
            return dispatch(sendMessageNotification({
                messageId: messageDetails.messageId,
                toId: messageDetails.toId,
                fromId: currentUser.uid,
                senderPhoto: state.firebase.profile.photoUrl,
                productName: messageDetails.rentName,
                content: newMessage.body,
                rentId: messageDetails.rentId
            }));
        })
        .catch(err => console.log(err))

    //     }
    // })
    // 
}

export const sendFirstMessage = (messageDetails) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    // const batch = db.batch();

    const state = getState();
    const currentUser = state.firebase.auth;

    const DateTimeMessage = {
        dateMessage: true,
        body: messageDetails.dateTimeMessage,

        fromId: currentUser.uid,
        toId: messageDetails.toId,
    }

    const TemplateMessages = messageDetails.templates ? messageDetails.templates.map(each => {
        return {
            body: each,
            fromId: currentUser.uid,
            toId: messageDetails.toId,
        }
    }) : null;

    const SpecialMessage = messageDetails.specialMessage ? {
        body: messageDetails.specialMessage,
        fromId: currentUser.uid,
        toId: messageDetails.toId,
    } : null;

    let messageId;
    db.collection('allMessages')
        .add({
            IDs: [currentUser.uid, messageDetails.toId],
            [currentUser.uid]: { allowed: true, userFullname: state.firebase.profile.name + ' ' + state.firebase.profile.surname, userPhoto: state.firebase.profile.photoUrl },
            [messageDetails.toId]: { allowed: true, userFullname: messageDetails.recipientFullname, userPhoto: messageDetails.recipientPhotoUrl },
            rentId: messageDetails.rentId,
            rentName: messageDetails.rentName,
            rentImage: messageDetails.rentImage,
            rentOwner: messageDetails.rentOwner,
            unseenMessages: SpecialMessage ? TemplateMessages ? 2 + TemplateMessages.length : 2 : 1 + TemplateMessages.length,
            senderId: currentUser.uid
        })
        .then((doc) => {
            messageId = doc.id;
            const DateTimeMessageRef = db.collection(`allMessages/${doc.id}/messages`).doc();
            let TemplateMessagesDate;
            let SpecialMessageDate;

            Promise.resolve().then(() => DateTimeMessageRef.set({ ...DateTimeMessage, date: new Date().toISOString() }))
                .then(() => {
                    if (TemplateMessages) {
                        Promise.all(TemplateMessages.map(each => {
                            const TemplateMessagesRef = db.collection(`allMessages/${doc.id}/messages`).doc();
                            TemplateMessagesDate = new Date().toISOString();
                            TemplateMessagesRef.set({ ...each, date: TemplateMessagesDate });
                        }));
                    }
                })
                .then(() => {
                    if (SpecialMessage) {
                        const SpecialMessageRef = db.collection(`allMessages/${doc.id}/messages`).doc();
                        SpecialMessageDate = new Date().toISOString();
                        SpecialMessageRef.set({ ...SpecialMessage, date: SpecialMessageDate });
                    }
                })
                .then(() => db.doc(doc.path).update({
                    last_message_body: SpecialMessage ? SpecialMessage.body : TemplateMessages[TemplateMessages.length - 1].body,
                    last_message_date: SpecialMessage ? SpecialMessageDate : TemplateMessagesDate
                }))

        })
        .then(() => {
            return dispatch(sendMessageNotification({
                messageId: messageId,
                toId: messageDetails.toId,
                fromId: currentUser.uid,
                senderPhoto: state.firebase.profile.photoUrl,
                productName: messageDetails.rentName,
                content: SpecialMessage ? SpecialMessage.body : TemplateMessages ? TemplateMessages[TemplateMessages.length - 1].body : DateTimeMessage ? DateTimeMessage.body : '',
                rentId: messageDetails.rentId
            }));
        })
        .then(() => db.doc(`/users/${messageDetails.rentOwner}`).get())
        .then((doc) => {
            if (doc.exists && doc.data().phoneNumber.trim() !== '') {
                const content = `${state.firebase.profile.name + ' ' + state.firebase.profile.surname} adlı istifadəçi ${messageDetails.rentName} adlı elanınıza Mesaj göndərib. Sayta keçid et: www.mandarent.com/user#messages`;
                const phoneNumber = `994${doc.data().phoneNumber.match(/\d+/g).join('').slice(1)}`;
                return dispatch(sendSMS(phoneNumber, content));
            }
        })
        .catch(err => console.log(err))

}


export const sendTemplateMessages = (messageDetails) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const batch = db.batch();

    const state = getState();
    const currentUser = state.firebase.auth;

    const TemplateMessages = messageDetails.templates ? messageDetails.templates.map(each => {
        return {
            body: each,
            // date: new Date().toISOString(),
            fromId: currentUser.uid,
            toId: messageDetails.toId,
        }
    }) : null;

    let messageId;

    db.collection('allMessages').where(`${currentUser.uid}.allowed`, '==', true).where(`${messageDetails.toId}.allowed`, '==', true).where('rentId', '==', messageDetails.rentId).limit(1).get()
        .then(async (data) => {
            messageId = data.docs[0].id;
            let TemplateMessagesDate;
            if (TemplateMessages) {
                TemplateMessages.forEach(async each => {
                    const TemplateMessagesRef = db.collection(`allMessages/${data.docs[0].id}/messages`).doc();
                    TemplateMessagesDate = new Date().toISOString();
                    await batch.set(TemplateMessagesRef, { ...each, date: TemplateMessagesDate });
                });
            }
            // console.log(messageDetails.unseenMessages)

            await batch.update(db.doc(data.docs[0].ref.path), {
                last_message_body: TemplateMessages[TemplateMessages.length - 1].body,
                last_message_date: TemplateMessagesDate,
                unseenMessages: (messageDetails.unseenMessages !== null && messageDetails.unseenMessages > 0) ? (messageDetails.unseenMessages + TemplateMessages.length) : 1,
                senderId: currentUser.uid
            });

            return batch.commit();
        })
        .then(() => {
            return dispatch(sendMessageNotification({
                messageId: messageId,
                toId: messageDetails.toId,
                fromId: currentUser.uid,
                senderPhoto: state.firebase.profile.photoUrl,
                productName: messageDetails.rentName,
                content: TemplateMessages[TemplateMessages.length - 1].body,
                rentId: messageDetails.rentId
            }));
        })
        .catch(err => console.log(err))

}

export const createMessageChatBox = (messageDetails, history) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();

    const state = getState();
    const currentUser = state.firebase.auth;

    db.collection('allMessages').where(`${currentUser.uid}.allowed`, '==', true).where(`${messageDetails.toId}.allowed`, '==', true).where('rentId', '==', messageDetails.rentId).limit(1).get()
        .then((data) => {
            if (data.empty) {
                return db.doc(`/users/${messageDetails.toId}`).get();
            }
            else {
                history.push('/user#messages');
            }
        })
        .then((doc) => {
            return db.collection('allMessages')
                .add({
                    IDs: [currentUser.uid, messageDetails.toId],
                    [currentUser.uid]: { allowed: true, userFullname: state.firebase.profile.name + ' ' + state.firebase.profile.surname, userPhoto: state.firebase.profile.photoUrl },
                    [messageDetails.toId]: { allowed: true, userFullname: messageDetails.recipientFullname, userPhoto: messageDetails.recipientPhotoUrl },
                    rentId: messageDetails.rentId,
                    rentName: messageDetails.rentName,
                    rentImage: messageDetails.rentImage,
                    rentOwner: messageDetails.rentOwner,
                    unseenMessages: 0,
                    senderId: currentUser.uid,
                    isAccepted: true,
                    phoneNumbers: { [currentUser.uid]: state.firebase.profile.phoneNumber, [doc.id]: doc.data().phoneNumber },
                    last_message_date: new Date().toISOString()
                })
                .then(() => {
                    history.push('/user#messages');
                })
                .catch(err => console.log(err))
        })
        .catch((err) => console.log(err));

}

export const demand = (demandDetails, history) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const state = getState();

    const newDemand = {
        name: demandDetails.name,
        start_date: demandDetails.start_date,
        end_date: demandDetails.end_date,
        start_time: demandDetails.start_time,
        end_time: demandDetails.end_time,
        description: demandDetails.description,
        category: demandDetails.category,
        subcategory: demandDetails.subcategory,
        city: demandDetails.city,
        district: demandDetails.district,
        province: demandDetails.province,
        userId: state.firebase.auth.uid,
        userPhoto: state.firebase.profile.photoUrl,
        userFullname: state.firebase.profile.name + ' ' + state.firebase.profile.surname,
        userRating: state.firebase.profile.rating,
        createdAt: new Date().toISOString(),
    }

    db.collection('demands').add(newDemand)
        .then(() => {
            history.push('/demands');
        })
        .catch((err) => {
            console.error(err);
        });
}

// export const getAllMessages = () => (dispatch) => {
//     // dispatch({ type: LOADING_USER });
//     axios.get(`/allMessages`)
//         .then((res) => {
//             dispatch({
//                 type: actionTypes.GET_ALL_MESSAGES,
//                 payload: res.data
//             })
//         })
//         .catch(err =>
//             dispatch({
//                 type: actionTypes.GET_ALL_MESSAGES,
//                 payload: []
//             }));
// }

export const cancel_ReceivedOffer = (offerId) => (dispatch, getState, { getFirebase, getFirestore }) => {

    const db = getFirestore();

    let tempData_Offer;

    db.doc(`offers/${offerId}`).get()
        .then((doc) => {
            if (!doc.exists) {
                return console.log({ error: 'Offer not found' })
            }

            tempData_Offer = { ...doc.data(), id: doc.id };
            return doc.ref.delete();
        })
        .then(() => {
            return dispatch(returnPayment(tempData_Offer.fromId, tempData_Offer.calculation.commission));
        })
        .then(() => {
            return db.doc(`/notifications/${tempData_Offer.id}`).delete();
        })
        .then(() => {
            return db.doc(`/notifications/${tempData_Offer.id}`).set({
                recipient: tempData_Offer.fromId,
                sender: tempData_Offer.toId,
                senderPhoto: tempData_Offer.rentOwnerPhoto,
                rentName: tempData_Offer.productName,
                title: `${tempData_Offer.rentOwnerFullname.split(' ')[0]} təklifinizi ləğv etdi`,
                // content: 'Servis haqqı qısa müddətdə balansınıza geri qaytarılacaqdır.',
                content: 'Digər elanlarımıza baxmağınız tövsiyə olunur.',
                rentId: tempData_Offer.rentId,
                read: false,
                type: 'offer',
                createdAt: new Date().toISOString()
            })
        })
        .then(() => db.doc(`/users/${tempData_Offer.fromId}`).get())
        .then((doc) => {
            if (doc.exists && doc.data().phoneNumber.trim() !== '') {
                const content = `${tempData_Offer.productName} adlı elana göndərdiyiniz Kirayə Təklifi qəbul edilməyib. Servis haqqı balansınıza geri qaytarılıb. Sayta keçid et: www.mandarent.com`;
                const phoneNumber = `994${doc.data().phoneNumber.match(/\d+/g).join('').slice(1)}`;
                return dispatch(sendSMS(phoneNumber, content));
            }
        })
        .catch((err) => {
            console.log(err)
        })

}

export const cancel_SentOffer = (offerId) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();

    const state = getState();

    let docId;
    let commission = 0;
    db.doc(`offers/${offerId}`).get()
        .then((doc) => {
            if (!doc.exists) {
                return console.log({ error: 'Offer not found' })
            }

            docId = doc.id;
            commission = doc.data().calculation.commission;
            return doc.ref.delete();
        })
        .then(() => {
            return dispatch(returnPayment(state.firebase.auth.uid, commission))
        })
        .then(() => {
            return db.doc(`/notifications/${docId}`).delete()
        })
        .catch((err) => {
            console.log(err)
        })
}

export const accept_ReceivedOffer = (offerId, offerDetails, messageDetails, history) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();

    const state = getState();
    const currentUser = state.firebase.auth;

    let messageId;

    let recipientPhoneNumber;

    db.doc(`offers/${offerId}`).update({ status: 'accepted' })
        .then(() => {
            history.push('/user#operations');
            return db.doc(`/notifications/${offerId}`).delete();
        })
        .then(() => {
            return db.doc(`/notifications/${offerId}`).set({
                recipient: offerDetails.fromId,
                sender: offerDetails.toId,
                senderPhoto: offerDetails.rentOwnerPhoto,
                rentName: offerDetails.productName,
                title: `${offerDetails.rentOwnerFullname.split(' ')[0]} təklifinizi qəbul etdi`,
                content: 'Əməliyyatlarım bölməsinə yönlən.',
                rentId: offerDetails.rentId,
                read: false,
                type: 'offer',
                link: 'operations',
                createdAt: new Date().toISOString()
            });
        })
        .then(() => {
            return db.collection('allMessages').where(`${currentUser.uid}.allowed`, '==', true).where(`${messageDetails.toId}.allowed`, '==', true).where('rentId', '==', messageDetails.rentId).limit(1).get()
        })
        .then((data) => {
            if (!data.empty) {
                messageId = data.docs[0].id;
                return db.doc(`/users/${offerDetails.fromId}`).get()
                    .then((doc) => {
                        recipientPhoneNumber = doc.data().phoneNumber;
                        return db.doc(`/allMessages/${messageId}`).update({
                            isAccepted: true,
                            phoneNumbers: { [currentUser.uid]: state.firebase.profile.phoneNumber, [doc.id]: recipientPhoneNumber }
                        })
                    })
            }
        })
        .then(() => {
            return db.doc(`rents/${offerDetails.rentId}`).get()
        })
        .then((doc) => {
            return doc.ref.update({
                offerCount: doc.data().offerCount + 1,
                sortIndex: Math.round((((doc.data().offerCount + 1) * 20 / 100) + (calculateRating(doc.data().rating) * 80 / 100)) * 10) / 10
            })
        })
        .then(() => {
            if (recipientPhoneNumber !== '') {
                const content = `${offerDetails.productName} adlı elana göndərdiyiniz Kirayə Təklifi qəbul olunub. Sayta keçid et: www.mandarent.com/user#operations`;
                const phoneNumber = `994${recipientPhoneNumber.match(/\d+/g).join('').slice(1)}`;
                return dispatch(sendSMS(phoneNumber, content));
            }
        })
        .catch(err => {
            console.log(err);
        })
}

// const setAuthorizationHeader = (token) => {
//     const FBIdToken = `Bearer ${token}`;
//     localStorage.setItem('FBIdToken', FBIdToken);
//     axios.defaults.headers.common['Authorization'] = FBIdToken;
// }

export const check_operationStatus = (offerIdArr) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const batch = db.batch();

    // const state = getState();
    // const currentUser = state.firebase.auth;

    // console.log(offerIdArr)


    offerIdArr.length > 0 && offerIdArr.forEach((each) => {
        batch.update(db.doc(`/offers/${each.id}`), { status: each.statusToChange });
    })

    batch.commit();
}


export const sendComment = (commentDetails) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const state = getState();
    const currentUser = state.firebase.auth;

    const newComment = {
        body: commentDetails.body,
        rating: commentDetails.rating,
        // createdAt: new Date().toISOString(),
        // createdAt: admin.firestore.Timestamp.fromDate(new Date),
        rentId: commentDetails.rentId,
        recipient: commentDetails.recipient,
        userId: currentUser.uid,
        userPhoto: state.firebase.profile.photoUrl,
        userFullname: state.firebase.profile.name + ' ' + state.firebase.profile.surname,
    }

    let rating = [];
    let calcRating = 0;

    db.doc(`/rents/${commentDetails.rentId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return console.log({ error: 'Rent not found' })
            }

            rating = [...doc.data().rating];
            rating.push(commentDetails.rating);
            calcRating = calculateRating(rating);

            return doc.ref.update({
                commentCount: doc.data().commentCount + 1,
                rating: rating,
                sortIndex: Math.round(((doc.data().offerCount * 20 / 100) + (calcRating * 80 / 100)) * 10) / 10
            })
        })
        .then(() => {
            return db.doc(`/offers/${commentDetails.offerId}`).update({ commented: true });
        })
        .then(() => {
            return db.doc(`/users/${commentDetails.recipient}`).get();
        })
        .then((doc) => {
            let userRating = Array.from(doc.data().rating);
            userRating.push(calcRating);
            return doc.ref.update({ rating: userRating });
        })
        .then(() => {
            return db.collection('comments').add({ ...newComment, createdAt: new Date().toISOString() });
        })
        .catch(err => {
            console.log(err);
        })
}

export const readNotification = (id) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    db.doc(`/notifications/${id}`).update({ read: true }).catch((err) => console.log(err))
}

export const setUserOnline = () => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const state = getState();
    const currentUser = state.firebase.auth;

    db.doc(`/onlineChats/${currentUser.uid}`).update({ online: true }).catch((err) => console.log(err))
}

export const setUserOffline = () => (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebaseIns = getFirebase();
    const db = getFirestore();
    const state = getState();
    const currentUser = state.firebase.auth;
    if (firebaseIns.auth().currentUser)
        db.doc(`/onlineChats/${currentUser.uid}`).update({ online: false }).catch((err) => console.log(err));
}

export const pay = (commission) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const state = getState();
    const currentUser = state.firebase.auth;

    db.doc(`/users/${currentUser.uid}`).get()
        .then((doc) => {
            if (!doc.exists) console.log({ error: 'User not found' });

            return db.doc(`/users/${doc.id}`).update({ balance: doc.data().balance - commission })
        })
        .catch(err => console.log(err));
}

export const returnPayment = (userId, commission) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();

    db.doc(`/users/${userId}`).get()
        .then((doc) => {
            if (!doc.exists) console.log({ error: 'User not found' });

            return db.doc(`/users/${doc.id}`).update({ balance: doc.data().balance + commission })
        })
        .catch(err => console.log(err));
}

export const sendDemandNotification = (notifDetails) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const state = getState();
    const currentUser = state.firebase.auth;

    db.collection('notifications').add({
        recipient: notifDetails.recipient,
        sender: currentUser.uid,
        senderPhoto: state.firebase.profile.photoUrl,
        demandName: notifDetails.demandName,
        title: 'Tələbinizə təklif var',
        content: 'Təklif olunan elana yönlən.',
        demandId: notifDetails.demandId,
        read: false,
        type: 'demand',
        link: notifDetails.rentId,
        createdAt: new Date().toISOString()
    })
        .catch(err => console.log(err));
}

export const getSMSUnits = () => (dispatch, getState, { getFirebase, getFirestore }) => {
    axios.get('/getBalanceUnit')
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err));
}

export const sendSMS = (_phoneNumber, _content) => (dispatch, getState, { getFirebase, getFirestore }) => {
    axios.post('/sendSMS', { phoneNumber: _phoneNumber, content: _content })
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err));
}

export const verifyAccount = (verificationDetails, verificationImages) => (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const state = getState();
    const currentUser = state.firebase.auth;

    db.doc(`/users/${currentUser.uid}`).update({ ...verificationDetails, verified: false })
        .then(() => {
            axios.post('/addFileGD', {
                ID_holder: `${verificationDetails.surname} ${verificationDetails.name} - ${verificationDetails.ID_number}`,
                images: verificationImages
            })
        })
        .catch(err => console.log(err));
}


export const downloadAgreement = (rentInfo, callback) => async (dispatch, getState, { getFirebase, getFirestore }) => {
    const db = getFirestore();
    const state = getState();
    const profile = state.firebase.profile;
    let lenderRenterData = {};

    document.body.style.cursor = 'wait';

    if (rentInfo.productInfo.productOwner === state.firebase.auth.uid) {
        const user = await db.doc(`/users/${rentInfo.operation_user.userId}`).get();
        const userData = user.data();

        lenderRenterData = {
            lenderFullName: `${profile.name} ${profile.surname}`,
            lenderFatherName: profile.fatherName,
            lenderAddress: profile.address,
            lenderID_SeriesAndID_number: `${profile.ID_series} ${profile.ID_number}`,

            renterFullName: `${userData.name} ${userData.surname}`,
            renterFatherName: userData.fatherName,
            renterAddress: userData.address,
            renterID_SeriesAndID_number: `${userData.ID_series} ${userData.ID_number}`,
        }
    }
    else {
        const user = await db.doc(`/users/${rentInfo.productInfo.productOwner}`).get();
        const userData = user.data();

        lenderRenterData = {
            lenderFullName: `${userData.name} ${userData.surname}`,
            lenderFatherName: userData.fatherName,
            lenderAddress: userData.address,
            lenderID_SeriesAndID_number: `${userData.ID_series} ${userData.ID_number}`,

            renterFullName: `${profile.name} ${profile.surname}`,
            renterFatherName: profile.fatherName,
            renterAddress: profile.address,
            renterID_SeriesAndID_number: `${profile.ID_series} ${profile.ID_number}`,
        }
    }

    const data = {
        date: dayjs().format('DD.MM.YYYY'),

        ...lenderRenterData,

        rentStartDate: dayjs(rentInfo.operation_start_date.date).format('DD.MM.YYYY'),
        rentStartTime: rentInfo.operation_start_date.time,
        rentEndDate: dayjs(rentInfo.operation_end_date.date).format('DD.MM.YYYY'),
        rentEndTime: rentInfo.operation_end_date.time,

        rentPrice: rentInfo.price
    };

    templateDocx(require('../../util/Agreement-sample.docx'), data, callback);
}


