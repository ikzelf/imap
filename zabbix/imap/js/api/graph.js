import {getRequest} from './index';

export const fetchGraphList = (hostId) => {
    return getRequest('ajax/graph', {hostid: hostId});
};