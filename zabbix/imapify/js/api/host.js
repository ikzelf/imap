import filter from '../models/filter';
import {getRequest, postRequest} from './index';

export const searchHosts = (query) => {
    return getRequest('ajax/hosts/search', {
        hostid: filter.hostId,
        groupid: filter.groupId,
        query: query,
    });
};

export const fetchFullHostInfo = (hostId) => {
    return getRequest('ajax/hosts/view', {hostid: hostId});
};

export const updateHostLocation = (hostId, lat, lng) => {
    return postRequest('ajax/hosts/update-location', {lat: lat, lng: lng}, {hostid: hostId});
};