import filter from '../models/filter';
import {getRequest} from './index';

export const fetchTriggerList = () => {
    return getRequest('ajax/triggers', {
        show_severity: filter.showSeverity,
        hostid: filter.hostId,
        groupid: filter.groupId,
    });
};