/**
 * Host model
 */
import HostInventory from './host-inventory';
import Observable from './observer';
import NotificationService from '../services/notification';
import Trigger from './trigger';
import Problem from './problem';

// noinspection JSUnusedGlobalSymbols
export const HOST_STATUS_ENABLED = 0;
export const HOST_STATUS_DISABLED = 1;
// noinspection JSUnusedGlobalSymbols
export const HOST_MAINTENANCE_STATUS_DISABLED = 0;
export const HOST_MAINTENANCE_STATUS_ENABLED = 1;
export const HOST_INVENTORY_MODE_DISABLED = -1;
// noinspection JSUnusedGlobalSymbols
export const HOST_INVENTORY_MODE_MANUAL = 1;
// noinspection JSUnusedGlobalSymbols
export const HOST_INVENTORY_MODE_AUTO = 2;

/**
 * Host model.
 */
class Host extends Observable {
    /**
     * ID узла сети.
     * @type {number}
     */
    id;

    /**
     * Техническое имя узла сети.
     * @type {string}
     */
    host;

    /**
     * Видимое имя узла сети.
     * По умолчанию: значение свойства host
     * @type {string}
     */
    name;

    /**
     * Описание узла сети.
     * @type {string}
     */
    description;

    /**
     * Состояние и функция узла сети.
     * Возможные значения:
     * 0 - (по умолчанию) узел сети под наблюдением;
     * 1 - узел сети без наблюдения.
     * @type {number}
     */
    status;

    /**
     * (только чтение) Состояние действующего обслуживания.
     * Возможные значения:
     * 0 - (по умолчанию) обслуживание отсутствует;
     * 1 - имеется действующее обслуживание.
     * @type {number}
     */
    maintenanceStatus;

    /**
     * (только чтение) Режим заполнения данных инвентаризации узла сети.
     * Возможные значения:
     * -1 - отключено;
     * 0 - (по умолчанию) вручную;
     * 1 - автоматически.
     * @type {number}
     */
    inventoryMode;

    /**
     * Инвентарные данные узла
     * @type {HostInventory}
     */
    inventory;

    /**
     * Host triggers
     * @type {Object.<number, Trigger>}
     */
    triggers;

    /**
     * Host problems.
     *
     * @type {Object.<number, Problem>}
     */
    problems;

    /**
     * Host has problems.
     * @type {boolean}
     */
    hasProblem;

    /**
     * Max severity.
     * @type {number}
     */
    maxSeverity;

    /**
     * Host constructor.
     * @param {HostService} service
     */
    constructor(service) {
        super();

        this.triggers = {};
        this.problems = {};
        this.service = service;
        this.maxSeverity = 0;
    }

    /**
     * Compare two object
     * @param {Object} object1
     * @param {Object} object2
     * @return {boolean} - TRUE if equals.
     */
    static #compare(object1, object2) {
        const keys = Object.keys(object1);

        return Host.#compareValue(keys, Object.keys(object2)) && keys.every(key => {
            return Host.#compareValue(object1[key], object2[key]);
        });
    }

    /**
     * Compare two values.
     *
     * @param value1
     * @param value2
     * @return {boolean} - TRUE if equals.
     */
    static #compareValue(value1, value2) {
        if (Array.isArray(value1)) {
            if (Array.isArray(value2)) {
                if (value1.length === value2.length) {
                    value2.sort();

                    return value1.sort().every(key => {
                        return value2[key] === value1[key]
                    });
                }
            }
            return false;
        }

        if (typeof value1 === 'object' && value1 !== null) {
            if (typeof value2 === 'object' && value2 !== null) {
                return Host.#compare(value1, value2);
            }
            return false;
        }

        return value1 === value2;
    }

    /**
     * Remove old relation like trigger & problem.
     *
     * @param {Object<number, {}>} relationObject
     * @param {Array<{}>} nextRelationData
     * @param {string} keyName
     */
    static #cleanRelation(relationObject, nextRelationData, keyName) {
        // Remove old problems
        const nextIdList = nextRelationData.map(item => item[keyName]);
        Object.keys(relationObject).filter(id => !nextIdList.includes(id))
            .forEach(id => delete relationObject[id]);
    }

    /**
     * Fill relation object with new data.
     * @param {Object<number, Trigger|Problem>} relationObject
     * @param {Array<{}>} nextRelationData
     * @param {string} keyName
     * @param {Function} className
     */
    static #updateRelation(relationObject, nextRelationData, keyName, className) {
        nextRelationData.forEach(item => {
            const id = item[keyName];
            if (!relationObject.hasOwnProperty(id)) {

                relationObject[id] = new className();
            }
            relationObject[id].update(item);
        });
    }

    /**
     * Severity reduce function.
     * @param {number} maxValue
     * @param {Problem} nextProblem
     * @return {number}
     */
    static #severityReducer(maxValue, nextProblem) {
        return Math.max(maxValue, nextProblem.severity);
    }

    /**
     * Build Object with old values.
     * @return {{}}
     */
    #makeOldValues() {
        return Object.assign({}, this, {inventory: Object.assign({}, this.inventory)});
    }

    /**
     * Update host data.
     * @param {{}} data
     */
    update(data) {
        let oldValues;
        if (this.id) {
            oldValues = this.#makeOldValues();
        }

        if (!this.id) {
            this.id = parseInt(data['hostid']);
            this.inventory = new HostInventory();
        }

        Object.keys(data).forEach(key => {
            switch (key) {
                case 'triggers':
                    // Remove old triggers
                    Host.#cleanRelation(this.triggers, data[key], 'triggerid');
                    // Update trigger data
                    Host.#updateRelation(this.triggers, data[key], 'triggerid', Trigger);
                    break;
                case 'problems':
                    // Remove old problems
                    Host.#cleanRelation(this.problems, data[key], 'eventid');
                    // Update problem data
                    Host.#updateRelation(this.problems, data[key], 'eventid', Problem);

                    this.#recalculateMaxSeverity();
                    this.hasProblem = data[key].length > 0;
                    break;
                case 'inventory_mode':
                    // If change inventory mode to disable, clean inventory data
                    const inventoryMode = parseInt(data['inventory_mode']);
                    if (inventoryMode === HOST_INVENTORY_MODE_DISABLED && this.inventoryMode !== inventoryMode) {
                        this.inventory = new HostInventory();
                    }

                    this.inventoryMode = inventoryMode;
                    break;
                case 'inventory':
                    if (this.inventoryMode !== HOST_INVENTORY_MODE_DISABLED) {
                        this.inventory.update(data['inventory'] || {});
                    }
                    break;
                case 'maintenance_status':
                    this.maintenanceStatus = parseInt(data[key]);
                    break;

                case 'status':
                    this[key] = parseInt(data[key]);
                    break;

                case 'host':
                case 'name':
                case 'description':
                default:
                    this[key] = data[key];
                    break;
            }
        });

        if (oldValues !== undefined && !Host.#compare(this, oldValues)) {
            this.#updateNotify(oldValues);
        }
    }

    /**
     * Recalculate max severity.
     */
    #recalculateMaxSeverity() {
        this.maxSeverity = Object.values(this.problems)
            .reduce(Host.#severityReducer, 0);
    }

    /**
     * Update host positions.
     *
     * @param {?number} lat
     * @param {?number} lng
     */
    updatePosition({lat, lng}) {
        const newData = {
            inventory: {
                location_lat: lat,
                location_lon: lng,
            }
        };

        this.service.updateHost(this, newData)
            .then(() => {
                NotificationService.success('Host location successfully changed');
                this.update(newData);
            });
    }

    /**
     * Sent notify about host updated.
     * @param {{}} oldValues
     */
    #updateNotify(oldValues) {
        this.emit('updated', {
            oldValues: oldValues,
            host: this,
        });
    }

}

export default Host;