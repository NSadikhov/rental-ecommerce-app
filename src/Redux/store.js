import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { reduxFirestore, getFirestore, firestoreReducer } from 'redux-firestore';
import { ReactReduxFirebaseProvider, getFirebase, firebaseReducer } from 'react-redux-firebase';

import firebase from "firebase/app";
import { firebase as fbConfig } from '../Firebase';

import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import uiReducer from './reducers/uiReducer';

import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {};

// const middleware = [thunk.withExtraArgument({ getFirebase, getFirestore })];


const middleware = thunk.withExtraArgument({ getFirebase, getFirestore });

const reducers = combineReducers({
    user: userReducer,
    data: dataReducer,
    UI: uiReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
});

// read github page

// const composeEnchancers = window.__REDUX_DEVTOOLS_EXTENSION__ || compose;

// const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(
        applyMiddleware(middleware),
        reduxFirestore(firebase, fbConfig),
    )
);


// when deploy remove window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// const store = createStore(
//     reducers,
//     initialState,
//     compose(
//         applyMiddleware(middleware),
//         reduxFirestore(firebase, fbConfig),
//         // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//     )
// );



export default store;