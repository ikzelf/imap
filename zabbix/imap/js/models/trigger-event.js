import {normalizeObjectProperty} from '../helpers';

class TriggerEvent {
    id = null;
    source = null;
    object = null;
    objectId = null;
    clock = null;
    value = null;
    acknowledged = null;
    ns = null;
    name = null;
    severity = null;

    load(data) {
        normalizeObjectProperty(data, TriggerEvent.normalizeMap());

        Object.assign(this, data);

        return this;
    }

    static normalizeMap() {
        return {
            'id': 'eventid',
            'objectId': 'objectid',
        };
    }
}

export default TriggerEvent;