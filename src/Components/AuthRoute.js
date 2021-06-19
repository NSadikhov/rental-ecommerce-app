import React from 'react';

// import Home from '../Pages/home';

import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

// import { isEmpty } from 'react-redux-firebase';

const AuthRoute = (props) => {
    // if (isEmpty(useSelector(state => state.firebase.auth)))
    if(!props.auth.isEmpty)
        return (
            <Route {...props} />
        )
    else {
        return (
            <div className='main'>
                <div className="container">
                    <div className='authRequiredSection'>
                        <div>
                            <img src={require('../Images/undraw_secure_login.svg')} />
                        </div>
                        <span>
                            Bu səhifəyə giriş əldə etmək üçün hesabınıza daxil olmalısınız.
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

const MapStatetoProps = (state) => ({
    // authenticated: state.user.authenticated,
    auth: state.firebase.auth,
})

AuthRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

export default connect(MapStatetoProps)(AuthRoute);

// export default compose(
//     firestoreConnect([{ collection: 'notifications', orderBy: ['createdAt', 'desc'] }]),
//     connect(mapStateToProps, mapActionsToProps)
// )(withRouter(AuthRoute));