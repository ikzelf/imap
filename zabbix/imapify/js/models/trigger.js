/**
 * Trigger model.
 */
class Trigger {

    /**
     * ID триггера.
     * @type {number}
     */
    id;

    /**
     * Статус триггера.
     * Возможные значения:
     * 0 - (по умолчанию) статус триггера в актуальном состоянии;
     * 1 - текущее состояние триггера неизвестно.
     * @type {number}
     */
    state;

    /**
     * Активирован или деактивирован триггер.
     * Возможные значения:
     * 0 - (по умолчанию) активирован;
     * 1 - деактивирован.
     *
     * @type {number}
     */
    status;

    /**
     * Update trigger data.
     *
     * @param data
     */
    update(data) {
        if (!this.id) {
            this.id = parseInt(data['triggerid'] || 0);
        }

        this.state = parseInt(data['state'] || 0);
        this.status = parseInt(data['status'] || 0);
    }

}

export default Trigger;