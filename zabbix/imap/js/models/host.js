class Host {
    hostid = null;
    name = null;
    description = null;
    hardware = null;

    inventory = {
        location_lat: null,
        location_lon: null,
    };

    triggers = {};

    interfaces = [];

    scripts = [];

    /**
     * @type {String}
     */
    maintenance_status = null;

    /**
     * @type {String}
     */
    maintenance_type = null;

    status = null;
    error = null;
    inventory_mode = null;

    /**
     *
     * @type {Marker}
     * @deprecated
     */
    marker = null;

    constructor({hardwareField, minStatus}) {
        // TODO: move config
        this.hardwareField = hardwareField;
        this.minStatus = minStatus || 0;
    }

    load(data) {
        Object.assign(this, data);
        if (Array.isArray(this.inventory)) {
            this.inventory = {
                location_lat: null,
                location_lon: null,
            };
        }

        if (this.inventory.location_lat) {
            if (typeof this.inventory.location_lat === 'string') {
                this.inventory.location_lat = parseFloat((this.inventory.location_lat).replace(',', '.'));
            }
        } else {
            this.inventory.location_lat = null;
        }

        if (this.inventory.location_lon) {
            if (typeof this.inventory.location_lon === 'string') {
                this.inventory.location_lon = parseFloat((this.inventory.location_lon).replace(',', '.'));
            }
        } else {
            this.inventory.location_lon = null;
        }

        this.hardware = this.inventory[this.hardwareField]
    }

    hasLocation() {
        return this.inventory.location_lat && this.inventory.location_lon;
    }

    isInMaintenance() {
        return this.maintenance_status === '1';
    }

    isWasTriggered() {
        return this.maintenance_type !== '1'
    }

    getStatus() {
        let status = 0;

        if (this.isWasTriggered() || !this.isInMaintenance()) {
            // TODO: reduce
            Object.keys(this.triggers).forEach((triggerId) => {
                let trigger = this.triggers[triggerId];
                status = Math.max(status, (trigger.priority >= this.minStatus ? trigger.priority : 0));
            });
        }

        return status;
    }

    /**
     *
     * @param trigger {Trigger}
     */
    appendTrigger(trigger) {
        this.triggers[trigger.id] = trigger;
    }

    removeTrigger(triggerId) {
        if (this.triggers.hasOwnProperty(triggerId)) {
            delete this.triggers[triggerId];
        }
    }
}

export default Host;