export const buildHostListParams = () => {
    // TODO: append filter
    return {
        output: [
            // строка. (только чтение) ID узла сети.
            'hostid',
            // строка. Техническое имя узла сети.
            'host',
            // Текст. Видимое имя узла сети.
            // По умолчанию: значение свойства host.
            'name',
            // Текст. Описание узла сети.
            'description',
            // Целое число. Состояние и функция узла сети.
            // Возможные значения:
            // 0 - (по умолчанию) узел сети под наблюдением;
            // 1 - узел сети без наблюдения.
            'status',
            // Целое число. (только чтение) Состояние действующего обслуживания.
            // Возможные значения:
            // 0 - (по умолчанию) обслуживание отсутствует;
            // 1 - имеется действующее обслуживание.
            'maintenance_status',
            // Целое число. Режим заполнения данных инвентаризации узла сети.
            // Возможные значения:
            // -1 - (по умолчанию) отключено;
            // 0 - вручную;
            // 1 - автоматически.
            'inventory_mode'
        ],
        selectInventory: [
            // Position lat&lng
            'location_lat',
            'location_lon'
        ],
        selectTriggers: [
            'triggerid',
            'state',
            'status',
        ],
    };
};

/**
 * @param {number} hostId
 * @param {{}} data
 * @return {{}}
 */
export const buildHostUpdateParams = (hostId, data) => {
    return Object.assign({}, data, {
        hostid: hostId,
    });
};
