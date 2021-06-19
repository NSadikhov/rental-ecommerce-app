import React from 'react';
// import logo from './logo.svg';
import './App.css';
// import { BrowserRouter as Router, Switch, Route, useHistory, withRouter } from 'react-router-dom';
import Router from './Router';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { azAZ } from '@material-ui/core/locale';
// import jwtDecode from 'jwt-decode';
import axios from 'axios';

// Redux
import { Provider, useSelector } from 'react-redux';
import store from './Redux/store';
// import { SET_AUTHENTICATED, LOADING_USER } from './Redux/types';
// import { logoutUser, getUserData, signinWithGoogle } from './Redux/actions/userActions';

// Firebase
import { firebase as fbConfig } from './Firebase';

import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

import { createFirestoreInstance } from "redux-firestore";
import firebase from "firebase/app";


const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  useFirestoreForStorageMeta: true,
  // attachAuthIsReady: true,

}

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};


// for having base url for http requests
axios.defaults.baseURL = 'https://europe-west3-mandarent-5cb24.cloudfunctions.net/api';

// interceptors

// axios.interceptors.request.use(req => {
//   console.log(req);
//   return req;
// }, error => {
//   console.log(error);
//   return Promise.reject(error);
// })

// axios.interceptors.response.use(res=>{
//   console.log(res);
//     return res;
// }, error => {
//   console.log(error);
//   return Promise.reject(error);
// })


// fbConfig.auth().onAuthStateChanged((user) => {
//   if (user) {
//     if (user.providerData[0].providerId === 'google.com') {
//       store.dispatch({ type: LOADING_USER });
//       user.getIdToken()
//         .then((token) => {
//           store.dispatch(signinWithGoogle(token));
//         })
//         .catch(err => console.log(err))
//     }
//   } else {
//     // No user is signed in.

//   }
// });



// const token = localStorage.FBIdToken;
// if (token) {
//   const decodedToken = jwtDecode(token);
//   if (decodedToken.exp * 1000 < Date.now()) {

//     store.dispatch(logoutUser());
//     // window.location.href = '/';
//     // window.location.replace('/');
//   }
//   else {
//     store.dispatch({ type: SET_AUTHENTICATED });
//     axios.defaults.headers.common['Authorization'] = token;
//     store.dispatch(getUserData());
//   }
// }



function App() {

  const theme = createMuiTheme({
    typography: {
      "fontFamily": `"Quicksand Regular", "Helvetica", "Arial", sans-serif`,
      // "fontSize": 14,
      // "fontWeightLight": 300,
      // "fontWeightRegular": 400,
      // "fontWeightMedium": 500
    },
    button: {
      "lineHeight": 1
    }
    // props: {
    //   MuiPaper: {
    //     disableRipple: true
    //   }
    // }
  }, azAZ);


  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <Router />
        </ReactReduxFirebaseProvider>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
