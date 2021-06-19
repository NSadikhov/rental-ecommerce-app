import React from 'react';
import '../Css/companyInfo.css';

const AboutUs = (props) => {

    return (
        <div className='main'>
            <div className="container">
                <div className='CompanyInfoContent'>
                    <h2 className='CompanyInfoContent_header'>Haqqımızda</h2>
                    <div className='CompanyInfoContent_inside'>
                        <img className='CompanyInfoContent_img' src={require('../Images/undraw_team.svg')} />
                        <p className='CompanyInfoContent_paragraph_AboutUs'>
                            Mandarent Azərbaycan gəncləri tərəfindən yaradılan əşyaların onlayn kirayə platformasıdır. Əsas missiyamız insanlar arasında qarşılıqlı paylaşımı və güvəni artırmaqla pozitiv cəmiyyət yaratmaqdır. Kirayələməklə insanlar həm də öz büdcələrini əhəmiyyətli dərəcədə qənaət edəcəklər.
                    </p>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default AboutUs;