import React from 'react';

const Error404 = (props) => {

    return (
        <div className='main'>
            <div className="container">
                <div className='error404Section'>
                    <div>
                        <img src={require('../Images/error404.svg')} />
                    </div>
                    <span>
                        Belə bir səhifə mövcud deyildir.
                        </span>
                </div>
            </div>
        </div>
    )

}


export default Error404;