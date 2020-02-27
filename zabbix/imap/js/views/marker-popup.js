import MarkerPopupActions from './marker-popup-actions';
import MarkerPopupTrigger from './marker-popup-trigger';
import HostNameElement from './marker-popup/hostname';
import HostInterfacesElement from './marker-popup/interfaces';
import HostInventoryElement from './marker-popup/host-inventory';
import HostLinksElement from './marker-popup/host-links';
import ContextMenuElement from './marker-popup/context-menu';
import {fetchFullHostInfo} from '../api/host';
import NotificationService from '../services/notification';
import {fetchGraphList} from '../api/graph';

class MarkerPopup {
    constructor({
                    linksEnabled,
                    showIcons,
                    debugEnabled,
                    excludingInventory,
                    inventoryFields,
                    zabbixVersion
                }) {
        this.linksEnabled = linksEnabled;
        this.showIcons = showIcons;
        this.debugEnabled = debugEnabled;
        this.excludingInventory = excludingInventory;
        this.inventoryFields = inventoryFields;
        this.zabbixVersion = zabbixVersion;

        this.element = L.DomUtil.create('div', '');

        this.host = null;
    }

    setHost(host) {
        this.host = host;
    }

    rebuild(marker, host) {
        this.element.innerHTML = '';

        this.hostError = L.DomUtil.create('div', 'host-error', this.element);

        this.hostName = new HostNameElement(host, this.element, {
            showIcons: this.showIcons
        });


        let hostControl = L.DomUtil.create('div', 'host-control', this.element);

        this.contextMenu = new ContextMenuElement(host, hostControl, {
            zabbixVersion: this.zabbixVersion,
        });

        let changeLocation = MarkerPopupActions.changeLocation(host);
        changeLocation.on('click', () => marker.closePopup());
        hostControl.append(changeLocation);

        let removeHostLocationButton = MarkerPopupActions.removeHostLocation(host);
        removeHostLocationButton.on('click', () => marker.closePopup());
        hostControl.append(removeHostLocationButton);

        if (this.linksEnabled) {
            let addLinkHostButton = MarkerPopupActions.addLink(host);
            addLinkHostButton.on('click', () => marker.closePopup());
            hostControl.append(addLinkHostButton);
        }

        if (this.showIcons) {
            let getHardwareButton = MarkerPopupActions.getHardware(host);
            getHardwareButton.on('click', () => marker.closePopup());
            hostControl.append(getHardwareButton);
        }

        if (this.debugEnabled) {
            let hostDebugInfoButton = MarkerPopupActions.hostDebugInfo(host);
            hostControl.append(hostDebugInfoButton);
        }

        this.hostInterfaces = new HostInterfacesElement(host, this.element);

        let hostInformation = L.DomUtil.create('div', 'host_des', this.element);
        this.hostDescription = L.DomUtil.create('div', 'hostdescription', hostInformation);

        this.hostInventory = new HostInventoryElement(host, hostInformation, {
            excludingInventory: this.excludingInventory,
            inventoryFields: this.inventoryFields,
        });

        this.hostLinks = new HostLinksElement(host, this.element);

        this.triggersInfo = L.DomUtil.create('div', 'triggers', this.element);
    }

    /**
     *
     * @param host {Host}
     */
    updateTriggersInfo(host) {
        this.triggersInfo.innerHTML = '';

        if (!host.isWasTriggered() || !host.isInMaintenance()) {
            Object.values(host.triggers).forEach(trigger => {
                this.triggersInfo.append(new MarkerPopupTrigger(trigger, {debugEnabled: this.debugEnabled}).element);
            });
        }
    }

    updateHostInfo(host) {
        this.hostError.innerText = host.error ? `Error: ${host.error}` : '';

        this.hostName.refresh(host);
        this.hostInterfaces.refresh(host);


        this.hostDescription.innerHTML = '';
        L.DomUtil.create('pre', '', this.hostDescription).innerText = host.description;

        this.hostInventory.refresh(host);

        this.hostLinks.refresh(host);
    }

    updateContextMenu(data) {
        this.contextMenu.refresh(data);
    }


    onOpenHostPopup(marker, host) {
        this.rebuild(marker, host);

        fetchFullHostInfo(host.hostid)
            .then((response) => {
                if (response.data.error) {
                    NotificationService.error(response.data.error);
                    return;
                }

                host.load(response.data);
                this.updateTriggersInfo(host);
                this.updateHostInfo(host);

                marker._popup.setContent(this.element);

                fetchGraphList(host.hostid)
                    .then(response => this.updateContextMenu(response.data));
            });

        this.contextMenu.element.innerHTML = '';

        return false;
    }


    onCloseHostPopup() {
        this.contextMenu.element.innerHTML = '';
    }
}

export default MarkerPopup;