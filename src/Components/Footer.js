import React from 'react';
import '../Css/footer.css';
import { Link } from 'react-router-dom';
// import Link from '@material-ui/core/Link';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import useMediaQuery from '@material-ui/core/useMediaQuery';

const Footer = (props) => {

    const matches_750 = useMediaQuery('(min-width:750px)');

    const { UI: { toggleChatView } } = props;

    return (

        <div className="footer" style={{ display: (toggleChatView && !matches_750) ? 'none' : 'block' }}>
            <div className="container">
                <div className="footer_inside">
                    <div className="footer_inside_content">

                        <div className='app_info'>
                            <div className="about">
                                <h3>
                                    MANDARENT
                        </h3>

                                <Link to='/aboutUs'>
                                    <img src={require('../Images/forward2.png')} alt="" />
                                Haqqımızda
                        </Link>
                                <Link to='/contact'>
                                    <img src={require('../Images/forward2.png')} alt="" />
                                    Əlaqə
                        </Link>
                                <Link to='/career'>
                                    <img src={require('../Images/forward2.png')} alt="" />
                                        Karyera
                        </Link>

                            </div>
                            <div className="rules">
                                <h3>
                                    QAYDALAR
                        </h3>

                                <Link to='/userAgreement'>
                                    <img src={require('../Images/forward2.png')} alt="" />
                                            İstifadəçi razılaşması
                        </Link>
                                <Link to='/cancellationPolicy'>
                                    <img src={require('../Images/forward2.png')} alt="" />
                                                Ləğvetmə siyasəti
                        </Link>
                                <Link to='/privacyPolicy'>
                                    <img src={require('../Images/forward2.png')} alt="" />
                                    Məxfilik siyasəti
                        </Link>
                            </div>
                        </div>
                        <div className="logo_app_info">
                            <div>
                                <img className='logo_app_info_img' src={require('../Images/logo.svg')} alt="logo" />
                                <span>
                                    infomandarent@gmail.com
                            </span>
                                <div className="icons_social_media">
                                    <Link to='/'>
                                        <img src={require('../Images/facebook.png')} alt="" />
                                    </Link>
                                    <Link to='/'>
                                        <img src={require('../Images/twitter.png')} alt="" />
                                    </Link>
                                    <Link to='/'>
                                        <img src={require('../Images/linkedin.png')} alt="" />
                                    </Link>
                                    <Link to='/'>
                                        <img src={require('../Images/instagram2.png')} alt="" />
                                    </Link>
                                </div>
                                {/* <div className="icons_apps">
                                    <img src={require('../Images/icon-google-play.svg')} alt="" />
                                    <img src={require('../Images/icon-app-store.svg')} alt="" />
                                </div> */}

                            </div>
                        </div>


                    </div>
                    <div className="rights">
                        © {new Date().getFullYear()} Mandarent, Inc. All rights reserved
                        </div>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    UI: state.UI,
    auth: state.firebase.auth,
});

Footer.propTypes = {
    UI: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Footer);