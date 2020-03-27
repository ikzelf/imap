import MarkerPopup from '../../views/marker-popup';


class PopupCreator {
    constructor({
                    linksEnabled: linksEnabled,
                    debugEnabled: debugEnabled,
                    excludingInventory: excludingInventory,
                    inventoryFields: inventoryFields,
                    zabbixVersion: zabbixVersion
                }) {
        this.linksEnabled = linksEnabled;
        this.debugEnabled = debugEnabled;
        this.excludingInventory = excludingInventory;
        this.inventoryFields = inventoryFields;
        this.zabbixVersion = zabbixVersion;
    }

    /**
     * @returns {MarkerPopup}
     */
    create() {
        return new MarkerPopup({
            linksEnabled: this.linksEnabled,
            debugEnabled: this.debugEnabled,
            excludingInventory: this.excludingInventory,
            inventoryFields: this.inventoryFields,
            zabbixVersion: this.zabbixVersion
        });
    }

}

export default PopupCreator;