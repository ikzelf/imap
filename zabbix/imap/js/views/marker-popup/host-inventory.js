import {__} from "../../helpers";

class HostInventoryElement {
    constructor(host, parent, {excludingInventory, inventoryFields}) {
        this.element = L.DomUtil.create('div', 'host_inventory', parent);
        this.excludingInventory = excludingInventory;
        this.inventoryFields = inventoryFields;

        this.refresh(host);
    }

    refresh(host) {
        this.element.innerHTML = '';

        if (host.inventory && Object.keys(host.inventory).length > 0) {
            Object.keys(host.inventory).forEach(inventoryKey => {
                if (host.inventory[inventoryKey] !== null && (`#${this.excludingInventory.join('#,#')}#`).search(`#${inventoryKey}#`) === -1) {
                    let line = L.DomUtil.create('div', 'host_inventory_line', this.element);

                    L.DomUtil.create('div', 'host_inventory_line_l', line).innerText = this.inventoryFields[inventoryKey];
                    L.DomUtil.create('div', 'host_inventory_line_r', line).innerText = host.inventory[inventoryKey] || __('No data');
                }
            })
        }
    }
}

export default HostInventoryElement;