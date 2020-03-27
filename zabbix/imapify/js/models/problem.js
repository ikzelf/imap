/**
 * Problem model.
 * @see https://www.zabbix.com/documentation/current/ru/manual/api/reference/problem/object
 */
class Problem {

    /**
     * ID события о проблеме.
     * @type {number}
     */
    id;

    /**
     * ID связанного объекта.
     * @type {number}
     */
    objectId;

    /**
     * Имя решённой проблемы.
     * @type {string}
     */
    name;

    /**
     * Текущая важность проблемы.
     * Возможные значения:
     * 0 - не классифицировано;
     * 1 - информационная;
     * 2 - предупреждение;
     * 3 - средняя;
     * 4 - высокая;
     * 5 - чрезвычайная.
     * @type {number}
     */
    severity;

    /**
     * Время, когда событие о проблеме было создано.
     * @type {number}
     */
    clock;

    /**
     * Состояние подтверждения проблемы.
     *  Возможные значения:
     *  0 - не подтверждена;
     *  1 - подтверждена.
     *  @type {number}
     */
    acknowledged;

    /**
     * Подавлена ли проблема или нет.
     * Возможные значения:
     * 0 - проблема в нормальном режиме;
     * 1 - проблема подавлена.
     * @type {number}
     */
    suppressed;

    /**
     * @type {{}} data
     */
    update(data) {
        if (!this.id) {
            this.id = parseInt(data['eventid']);
            this.objectId = parseInt(data['objectid']);
        }

        this.name = data['name'];
        this.severity = parseInt(data['severity']);
        this.clock = data['clock'] * 1000;
        this.acknowledged = parseInt(data['acknowledged']);
        this.suppressed = parseInt(data['suppressed']);
    }
}

export default Problem;