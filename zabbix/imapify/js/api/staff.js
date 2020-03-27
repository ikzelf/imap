import imapify from '../imapify';
import axios from 'axios';
import Staff from '../models/staff';

export const fetchStaffPositions = () => {
    return new Promise(((resolve, reject) => {
        let config = undefined;
        if (imapify.settings.staffApi.authHeaders) {
            config = {headers: imapify.settings.staffApi.authHeaders};
        }
        axios.get(imapify.settings.staffApi.url, config)
            .then(response => {
                const staffList = response.data.map(staffData => new Staff().load(staffData));

                resolve(staffList);
            }).catch(response => reject(response));
    }))
};