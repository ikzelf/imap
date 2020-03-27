import SmileIcon from './marker/smile-icon';
import {HOST_MAINTENANCE_STATUS_ENABLED} from '../../models/host';
import HostMarkerTooltip from './host-marker-tooltip';

/**
 * Host marker
 */
class HostMarker extends L.Marker {

    #alwaysShowTooltip;

    /**
     * Host marker constructor.
     */
    constructor() {
        super();

        this.hasProblem = false;
        this.isMaintenance = false;
        this.maxSeverity = 0;
        this.#alwaysShowTooltip = false;

        // this.hostName = null;

        // this.tooltipCreator = new TooltipCreator();
        // this.popup = new PopupCreator({
        //     linksEnabled: this.settings.linksEnabled,
        //     debugEnabled: this.settings.debugEnabled,
        //     excludingInventory: this.settings.excludingInventory,
        //     inventoryFields: locale.inventoryfields,
        //     zabbixVersion: this.zabbixVersion,
        // }).create();

        // this.bindPopup(this.popup.element);

        // this.on('popupopen', () => NotificationService.warn(__('Not initialized')));
        // this.on('popupclose', () => this.popup.onCloseHostPopup());

        // TODO: this.on('move', () => eventBus.emit('update-lines-marker', null, this.hostId));
    }

    /**
     * Update marker data.
     * @param {Host} host
     * @param {{}} [oldValues]
     */
    updateData(host, oldValues) {
        // this.off('popupopen');
        // this.on('popupopen', () => this.popup.onOpenHostPopup(this, host));

        this.hasProblem = host.hasProblem;

        this.isMaintenance = host.maintenanceStatus === HOST_MAINTENANCE_STATUS_ENABLED;
        this.maxSeverity = host.maxSeverity;

        this.#refreshLocation({
            lat: host.inventory.lat,
            lng: host.inventory.lng,
        });

        if (oldValues === undefined ||
            oldValues['maintenanceStatus'] !== host.maintenanceStatus ||
            oldValues['maxSeverity'] !== host.maxSeverity) {

            // Update icon
            this.setIcon(
                new SmileIcon({
                    isMaintenance: this.isMaintenance,
                    maxSeverity: this.maxSeverity
                })
            );
        }

        if (!this._tooltip) {
            this.bindTooltip(new HostMarkerTooltip());
        }

        if (oldValues === undefined || oldValues['name'] !== host.name) {
            this._tooltip.updateContent(host.name);
        }
    }

    /**
     * Set or change marker location.
     * @param {number} lat
     * @param {number} lng
     * @return {HostMarker}
     */
    #refreshLocation({lat, lng}) {
        let currentLat, currentLng;
        if (this._preSpiderfyLatlng) {
            currentLat = this._preSpiderfyLatlng.lat;
            currentLng = this._preSpiderfyLatlng.lng;
        } else {
            currentLat = this._latlng ? this._latlng.lat : null;
            currentLng = this._latlng ? this._latlng.lng : null;
        }

        if (currentLat !== lat || currentLng !== lng) {
            this.setLatLng([lat, lng]);
        }

        return this;
    }


    /**
     * Update icon by parent.
     */
    updateIconByParent() {
        let marker = this;
        while (marker) {
            marker = marker.__parent;
            if (marker) {
                marker._updateIcon();
                if (marker.__iconObj) {
                    marker.setIcon(marker.__iconObj);
                }
            }
        }
    }
}

export default HostMarker;