// import { SET_RENTS, LIKE_RENT, UNLIKE_RENT, LOADING_DATA, DELETE_RENT, POST_RENT, GET_RENT, OFFER_ON_RENT, DEMAND, SET_DEMANDS, SET_LIKEDRENTS } from '../types';
import * as actionTypes from '../types';

const initialState = {
    rents: [],
    lastRentData: {},
    filteredRents: [],
    lastFilteredRentData: {},
    rent: {},
    demands: [],
    likedRentsList: [],
    profile: [],
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case actionTypes.SET_RENTS:
            return {
                ...state,
                rents: action.payload,
                loading: false
            }
        case actionTypes.LAST_RENT_DATA:
            return {
                ...state,
                lastRentData: action.payload
            }
        case actionTypes.SET_MORE_RENTS:
            return {
                ...state,
                rents: state.rents.concat(action.payload)
            }
        case actionTypes.LAST_FILTERED_RENT_DATA:
            return {
                ...state,
                lastFilteredRentData: action.payload
            }
        case actionTypes.SET_MORE_FILTERED_RENTS:
            return {
                ...state,
                filteredRents: state.filteredRents.concat(action.payload)
            }
        case actionTypes.SET_FILTERED_RENTS:
            return {
                ...state,
                filteredRents: action.payload,
                loading: false
            }
        case actionTypes.SET_PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false
            }
        case actionTypes.SET_DEMANDS:
            return {
                ...state,
                demands: action.payload,
                loading: false
            }
        case actionTypes.SET_LIKEDRENTS:
            return {
                ...state,
                likedRentsList: action.payload,
                // loading: false
            }
        case actionTypes.LIKE_RENT:
        case actionTypes.UNLIKE_RENT:
            let index = state.rents.findIndex((rent) => rent.rentId === action.payload.rentId);
            state.rents[index] = action.payload;
            return {
                ...state,
            }
        case actionTypes.DELETE_RENT:
            let indexDel = state.rents.findIndex(rent => rent.rentId === action.payload.rentId);
            state.rents.splice(indexDel, 1);
            return {
                ...state
            }
        case actionTypes.POST_RENT:
            return {
                ...state,
                rents: [
                    action.payload,
                    ...state.rents
                ]
            }
        case actionTypes.DEMAND:
            return {
                ...state,
                demands: [
                    action.payload,
                    ...state.demands
                ]
            }
        case actionTypes.GET_RENT:
            return {
                ...state,
                rent: action.payload,
                loading: false
            }
        case actionTypes.REMOVE_RENT:
            return {
                ...state,
                rent: {}
            }
        case actionTypes.REMOVE_PROFILE:
            return {
                ...state,
                profile: []
            }
        default:
            return state;

    }
}