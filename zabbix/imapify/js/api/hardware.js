import {getRequest, postRequest} from './index';

export const loadHardwareList = () => {
    return getRequest('ajax/hardware');
};

export const setHardwareType = (hostId, hardware) => {
    return postRequest('ajax/hardware', {hardware: hardware}, {hostid: hostId});
};