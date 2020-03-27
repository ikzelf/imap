import axios from 'axios';

const prepareParams = (route, params) => {
    return Object.assign({}, params, {
        r: route,
        output: 'ajax',
    });
};

export const getRequest = (route, params) => {
    return axios.get('imapify.php', {params: prepareParams(route, params)});
};

export const postRequest = (route, data, params) => {
    return axios.post('imapify.php', data, {params: prepareParams(route, params)});
};

export const deleteRequest = (route, params) => {
    return axios.delete('imapify.php', {params: prepareParams(route, params)});
};