import NotificationService from './services/notification';

export const __ = (message) => {
    return locale[message] || message;
};

export const normalizeObjectProperty = (object, attributeMap) => {
    Object.keys(attributeMap).forEach(validKey => {
        let searchKey = attributeMap[validKey];

        if (!object.hasOwnProperty(validKey)) {
            object[validKey] = object[searchKey] || undefined;
        }

        if (object.hasOwnProperty(searchKey)) {
            delete object[searchKey];
        }
    });
};

export const getCookie = (name) => {
    let cookieName = `${name}=`,
        cookieLength = document.cookie.length,
        cookieBegin = 0;

    while (cookieBegin < cookieLength) {
        let valueBegin = cookieBegin + cookieName.length;
        if (document.cookie.substring(cookieBegin, valueBegin) === cookieName) {
            let valueEnd = document.cookie.indexOf(';', valueBegin);
            if (valueEnd === -1) {
                valueEnd = cookieLength;
            }
            return unescape(document.cookie.substring(valueBegin, valueEnd));
        }
        cookieBegin = document.cookie.indexOf(' ', cookieBegin) + 1;
        if (cookieBegin === 0) {
            break;
        }
    }
};

export const setCookie = (name, value, options) => {
    options = options || {};
    let expires = options.expires;
    if (typeof expires === 'number' && expires) {
        let date = new Date();
        date.setTime(date.getTime() + expires * 1000);
        expires = options.expires = date;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);
    let updatedCookie = `${name}=${value}`;
    for (let propName in options) {
        if (options.hasOwnProperty(propName)) {
            updatedCookie += `; ${propName}`;
            let propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += `=${propValue}`;
            }
        }
    }

    document.cookie = updatedCookie;
};

export const getPosition = (callback) => {
    // Запрашиваем местоположение, и в случае успеха вызываем функцию callback
    navigator.geolocation.getCurrentPosition((position) => callback(position), (e) => {
        NotificationService.error(e.message, __('Navigator'));
        console.error(e);
    });
};
