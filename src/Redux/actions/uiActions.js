// import { OPEN_SIGNIN, CLOSE_SIGNIN } from '../types';
import * as actionTypes from '../types';

export const handleOpenSignIn = () => (dispatch) => {
    dispatch({ type: actionTypes.OPEN_SIGNIN });
}

export const handleCloseSignIn = () => (dispatch) => {
    dispatch({ type: actionTypes.CLOSE_SIGNIN });
}

export const clearErrors = () => (dispatch) => {
    dispatch({
        type: actionTypes.CLEAR_ERRORS
    });
}

export const handleToggleChatView = (state) => (dispatch) => {
    dispatch({
        type: actionTypes.TOGGLE_CHAT_VIEW,
        payload: state
    });
}