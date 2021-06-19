import React from 'react';
//Switch was introduced in react router v4
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Pages
import Home from './Pages/home';
import Demands from './Pages/demands';
import RentOut from './Pages/rentOut';
import Request from './Pages/request';
import Categories from './Pages/categories';
import Rental from './Pages/rental';
import User from './Pages/user';
import Profile from './Pages/profile';
import Saved from './Pages/saved';
import Notifications from './Pages/notifications';
import Basket from './Pages/basket';
import TopUp from './Pages/topUp';
import Error404 from './Pages/error404';
import AboutUs from './Pages/aboutUs'
import Contact from './Pages/contact';
import Career from './Pages/career';
import UserAgreement from './Pages/userAgreement';
import CancellationPolicy from './Pages/cancellationPolicy';
import PrivacyPolicy from './Pages/privacyPolicy';

// Components
import ScrollToTop from './Components/ScrollToTop';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AuthRoute from './Components/AuthRoute';
import MobileNavigation from './Components/MobileNavigation';

import animation from './Images/animation.gif';

import { useSelector } from 'react-redux';

function AuthIsLoaded({ children }) {
    const auth = useSelector(state => state.firebase.auth)
    if (!auth.isLoaded) return <div className='mandarent_logo_gif'><img src={animation} /></div>;
    return children;
}

function Routes() {
    return (
        <BrowserRouter>
            <AuthIsLoaded>
                <ScrollToTop />
                <Header />
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/demands' exact component={Demands} />
                    <AuthRoute path='/rent-out' exact component={RentOut} />
                    <AuthRoute path='/request' exact component={Request} />
                    <Route path='/categories' exact component={Categories} />
                    <Route path='/rentals/:product' exact component={Rental} />
                    <AuthRoute path='/user' exact component={User} />
                    <AuthRoute path='/user/basket' exact component={Basket} />
                    <AuthRoute path='/user/topUp' exact component={TopUp} />
                    <AuthRoute path='/user/saved' exact component={Saved} />
                    <AuthRoute path='/user/notifications' exact component={Notifications} />
                    <Route path='/profile/:userId' exact component={Profile} />
                    <Route path='/aboutUs' exact component={AboutUs} />
                    <Route path='/contact' exact component={Contact} />
                    <Route path='/career' exact component={Career} />
                    <Route path='/userAgreement' exact component={UserAgreement} />
                    <Route path='/cancellationPolicy' exact component={CancellationPolicy} />
                    <Route path='/privacyPolicy' exact component={PrivacyPolicy} />
                    <Route component={Error404} />
                </Switch>
                <Footer />
                <MobileNavigation />
            </AuthIsLoaded>
        </BrowserRouter>);
}

export default Routes;