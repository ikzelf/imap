import {normalizeObjectProperty} from '../helpers';

class Trigger {
    id = null;
    expression = null;
    description = null;
    url = null;
    status = null;
    value = null;
    priority = null;
    lastchange = null;
    comments = null;
    error = null;
    templateId = null;
    type = null;
    state = null;
    flags = null;
    recovery_mode = null;
    recovery_expression = null;
    correlation_mode = null;
    correlation_tag = null;
    manual_close = null;
    opData = null;

    /**
     *
     * @type {Host[]}
     */
    hosts = [];

    /**
     *
     * @type {TriggerEvent}
     */
    lastEvent = null;

    load(data) {
        normalizeObjectProperty(data, Trigger.normalizeMap());

        Object.assign(this, data);
        if (!Array.isArray(this.hosts)) {
            this.hosts = [];
        }

        this.priority *= 1;
        this.value *= 1;
    }

    hasHost() {
        return this.hosts.length > 0;
    }

    static normalizeMap() {
        return {
            'id': 'triggerid',
            'templateId': 'templateid',
            'opData': 'opdata',
        }
    }
}

export default Trigger;