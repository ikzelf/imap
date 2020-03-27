import filter from '../models/filter';
import {deleteRequest, getRequest, postRequest} from './index';

export const fetchLinkList = () => {
    return getRequest('ajax/links', {
        hostid: filter.hostId,
        groupid: filter.groupId,
    });
};

export const createLink = (hostId, targetHosts) => {
    return postRequest('ajax/links/create', {thostId: targetHosts}, {hostid: hostId});
};

export const updateLink = (linkId, linkOptions) => {
    return postRequest('ajax/links/update', {linkoptions: linkOptions}, {linkid: linkId});
};

export const deleteLink = (linkId) => {
    return deleteRequest('ajax/links/delete', {linkid: linkId});
};
