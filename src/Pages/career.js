import React from 'react';
import '../Css/companyInfo.css';

const Career = (props) => {

    return (
        <div className='main'>
            <div className="container">
                <div className='CompanyInfoContent'>
                    <h2 className='CompanyInfoContent_header'>Karyera</h2>
                    <div className='CompanyInfoContent_inside'>
                        <img className='CompanyInfoContent_img' src={require('../Images/undraw_career.svg')} />
                        <p className='CompanyInfoContent_paragraph_Career'>
                            Hal-hazırda aktiv vakansiyamız yoxdur.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default Career;