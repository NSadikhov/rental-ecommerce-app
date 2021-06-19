import React from 'react';
import '../Css/companyInfo.css';

const Contact = (props) => {

    return (
        <div className='main'>
            <div className="container">
                <div className='CompanyInfoContent'>
                    <h2 className='CompanyInfoContent_header'>Əlaqə</h2>
                    <div className='CompanyInfoContent_inside'>
                        <img className='CompanyInfoContent_img' src={require('../Images/undraw_contact.svg')} />
                        <p className='CompanyInfoContent_paragraph_Contact'>
                            <span>
                                Email: infomandarent@gmail.com
                            </span>
                            <span>
                                Instagram: @mandarent
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default Contact;