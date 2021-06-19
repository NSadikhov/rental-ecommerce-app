import React, { useState, useEffect, useCallback } from 'react'
import { blockedWords } from '../dbSchema';

export const OFFERED_RENT_INFO = 'OFFERED_RENT_INFO';
// export const SIGNUP_USER_INFO = 'SIGNUP_USER_INFO';

export const usePersistedStateLocal = (key, defaultValue) => {
    const [state, setState] = useState(
        () => JSON.parse(localStorage.getItem(key)) || defaultValue
    );
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
}

export const usePersistedStateSession = (key, defaultValue) => {
    const [state, setState] = useState(
        () => JSON.parse(sessionStorage.getItem(key)) || defaultValue
    );
    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
}

export const isEmptyObject = (obj) => {
    return JSON.stringify(obj) === '{}';
}

export const getKeyByObject = (object, objectKey, objectValue) => {
    return Object.keys(object).find(key => object[key][objectKey] && object[key][objectKey] !== objectValue);
}


export const checkInputValidity = (name) => {
    return name.trim() === '' ? true : false;
}

export const calculateRating = (ratings) => {
    let result = 0;

    Array.from(ratings).forEach(each => {
        result += each;
    })

    return ratings.length > 0 ? Math.round(result / ratings.length * 10) / 10 : result;
}

// function round(value, precision) {
//     var multiplier = Math.pow(10, precision || 0);
//     return Math.round(value * multiplier) / multiplier;
// }


export const calculateCommission = (priceAfterDiscount) => {
    let commission = 0;
    if (priceAfterDiscount < 5) {
        commission = 0.5;
    }
    else if (priceAfterDiscount < 40) {
        commission = priceAfterDiscount * 10 / 100;
    }
    else if (priceAfterDiscount < 80) {
        commission = 4;
    }
    else {
        commission = priceAfterDiscount * 5 / 100;
    }

    return commission;
}

export const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


export const checkBlockedWords = (text) => {
    // const regEx = /^\D*(\d\D*){7,}$/;

    const regEx = /(\d\D*){7,}|(((bir|iki|üc|uc|üç|dord|dörd|bes|beş|altı|alti|yeddi|sekkiz|səkkiz|doqquz)(\D|\d){0,3}){3,}|((bir|iki|üc|uc|üç|dord|dörd|bes|beş|altı|alti|yeddi|sekkiz|səkkiz|doqquz)(\D|\d)*){7,})/ig;
    let isIncluded = false;

    if (regEx.test(text)) isIncluded = true;

    if (!isIncluded)
        blockedWords.forEach(each => {
            if (text.search(new RegExp(each, 'ig')) !== -1) {
                isIncluded = true;
                return;
            }
        })

    if (isIncluded) return true; else return false;
}

export const replaceBlockedWords = (text) => {
    const regEx = /(\d\D*){7,}|(((bir|iki|üc|uc|üç|dord|dörd|bes|beş|altı|alti|yeddi|sekkiz|səkkiz|doqquz)(\D|\d){0,3}){3,}|((bir|iki|üc|uc|üç|dord|dörd|bes|beş|altı|alti|yeddi|sekkiz|səkkiz|doqquz)(\D|\d)*){7,})/ig;

    let replacedText = '';

    replacedText = text.replace(regEx, '[::MƏXFİ::]');
    blockedWords.forEach(each => {
        const eachRegEx = new RegExp(each, 'ig');
        if (replacedText.search(eachRegEx) !== -1) {
            replacedText = replacedText.replace(eachRegEx, '[::MƏXFİ::]');
        }
    })

    return replacedText;
}

export const priceFormat = (price) => {
    return price % 1 !== 0 ? price.toFixed(2) : price;
}

export const mobileAndTabletCheck = () => {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

export const backgroundImage = (event) => {
    if (event.currentTarget.naturalHeight === event.currentTarget.naturalWidth) {
        const elem = event.currentTarget;
        elem.style.objectFit = 'contain';
        let backgroundImg = document.createElement('div');
        backgroundImg.style.backgroundImage = `url(${elem.src})`;
        backgroundImg.style.backgroundPosition = 'center center';
        backgroundImg.style.backgroundRepeat = 'no-repeat';
        backgroundImg.style.backgroundSize = 'cover';
        backgroundImg.style.filter = 'blur(3px)';
        backgroundImg.style.position = 'absolute';
        backgroundImg.style.width = '100%';
        backgroundImg.style.height = '100%';
        backgroundImg.style.zIndex = 0;
        elem.parentElement.appendChild(backgroundImg)
    }
}