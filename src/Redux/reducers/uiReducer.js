// import { SET_ERRORS, CLEAR_ERRORS, LOADING_UI, OPEN_SIGNIN, CLOSE_SIGNIN } from '../types';
import * as actionTypes from '../types';

const initialState = {
    openSignIn: false,
    toggleChatView: false,
    loading: false,
    errors: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.OPEN_SIGNIN:
            return {
                ...state,
                openSignIn: true
            }
        case actionTypes.CLOSE_SIGNIN:
            return {
                ...state,
                openSignIn: false
            }
        case actionTypes.SET_ERRORS:
            return {
                ...state,
                loading: false,
                errors: action.payload
            }
        case actionTypes.CLEAR_ERRORS:
            return {
                ...state,
                loading: false,
                errors: null,
            }
        case actionTypes.LOADING_UI:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.TOGGLE_CHAT_VIEW:
            return {
                ...state,
                toggleChatView: action.payload
            }
        default:
            return state;
    }
}
