// import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, LIKE_RENT, UNLIKE_RENT, SEND_MESSAGE, GET_ALL_MESSAGES, OFFER_ON_RENT, EDIT_RENT } from '../types';
import * as actionTypes from '../types';

const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: [],
    messages: [],
    receivedOffers: [],
    sentOffers: [],
    belongings: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            }
        case actionTypes.SET_UNAUTHENTICATED:
            return initialState;
        case actionTypes.SET_USER:
            return {
                ...state,
                authenticated: true,
                loading: false,
                ...action.payload
            }
        case actionTypes.LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case actionTypes.EDIT_USER_DETAILS:
            return {
                ...state,
                credentials: {...state.credentials, ...action.payload}
            }
        case actionTypes.LIKE_RENT:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        // userId : state.credentials
                        rentId: action.payload.rentId
                    }
                ]
            }
        case actionTypes.UNLIKE_RENT:
            return {
                ...state,
                likes: state.likes.filter(like => like.rentId !== action.payload.rentId)
            }
        case actionTypes.CANCEL_RECEIVED_OFFER:
            let indexRec = state.receivedOffers.findIndex(offer => (offer.offerId === action.payload))
            state.receivedOffers.splice(indexRec, 1);
            return {
                ...state
            }
        case actionTypes.CANCEL_SENT_OFFER:
            let indexSen = state.sentOffers.findIndex(offer => (offer.offerId === action.payload))
            state.sentOffers.splice(indexSen, 1);
            return {
                ...state
            }
        case actionTypes.ACCEPT_RECEIVED_OFFER:
            let indexAcceptROff = state.receivedOffers.findIndex(offer => (offer.offerId === action.payload));
            state.receivedOffers[indexAcceptROff].status = 'accepted';
            state.receivedOffers = [...state.receivedOffers];
            return {
                ...state
            }
        case actionTypes.ACCEPT_SENT_OFFER:
            let indexAcceptSOff = state.sentOffers.findIndex(offer => (offer.offerId === action.payload))
            state.sentOffers[indexAcceptSOff].status = 'accepted';
            state.sentOffers = [...state.sentOffers];
            return {
                ...state
            }
        case actionTypes.SEND_MESSAGE:
            const fromId = action.payload.fromId;
            console.log(fromId)
            const toId = action.payload.toId;
            console.log(toId)
            let indexMess = state.messages.findIndex(message => (message.hasOwnProperty(fromId) && message.hasOwnProperty(toId)))
            console.log(indexMess);
            // state.messages[index].messages.push(action.payload);
            state.messages[indexMess].messages.push(action.payload);

            return {
                ...state,
                // messages: [

                //     ...state.messages,
                //         [state.messages[index]]: {
                //             [state.messages[index].messages]: {
                //                 ...action.payload,
                //                 ...[state.messages[index].messages]
                //             }
                //         }

                // ]
            }
        case actionTypes.GET_ALL_MESSAGES:
            return {
                ...state,
                messages: action.payload,
                // loading: false
            }
        case actionTypes.OFFER_ON_RENT:
            state.sentOffers.unshift(action.payload)
            return {
                ...state,
            }
        case actionTypes.EDIT_RENT:
            state.belongings.forEach((belonging, index) => {
                if (belonging.rentId === action.payload.rentId) {
                    state.belongings[index] = action.payload;
                }
            });
            return {
                ...state,
            }
        case actionTypes.DELETE_BELONGING:
            let indexDel = state.belongings.findIndex(rent => rent.rentId === action.payload.rentId);
            state.belongings.splice(indexDel, 1);
            return {
                ...state
            }
        default:
            return state;
    }
}