import NotificationService from '../../services/notification';
import {__} from '../../helpers';

class HostMarker extends L.Marker {

    /**
     *
     * @param iconCreator
     * @param tooltipCreator
     * @param popupCreator {PopupCreator}
     */
    constructor({iconCreator, tooltipCreator, popupCreator}) {
        super();

        this.isMaintenance = false;
        this.isTriggered = false;
        this.hostName = null;
        this.hardware = null;

        this.iconCreator = iconCreator;
        this.tooltipCreator = tooltipCreator;
        this.popup = popupCreator.create();
        this.bindPopup(this.popup.element);

        this.on('popupopen', () => NotificationService.warn(__('Not initialized')));
        this.on('popupclose', () => this.popup.onCloseHostPopup());

        // TODO: this.on('move', () => eventBus.emit('update-lines-marker', null, this.hostId));
    }

    updateByHost(host) {
        this.off('popupopen');
        this.on('popupopen', () => this.popup.onOpenHostPopup(this, host));

        this.updateHostInfo(host)
            .updatePositionByHost(host)
            .updateView();
    }

    updateHostInfo(host) {
        this.status = host.getStatus();
        this.isMaintenance = host.isInMaintenance();
        this.isTriggered = host.isWasTriggered();
        this.hostName = host.name;
        this.hardware = host.hardware;

        return this;
    }

    updatePositionByHost(host) {
        let nextLat = host.inventory.location_lat;
        let nextLng = host.inventory.location_lon;

        let currentLat, currentLng;
        if (this._preSpiderfyLatlng) {
            currentLat = this._preSpiderfyLatlng.lat;
            currentLng = this._preSpiderfyLatlng.lng;
        } else {
            currentLat = this._latlng ? this._latlng.lat : null;
            currentLng = this._latlng ? this._latlng.lng : null;
        }

        if (currentLat !== nextLat || currentLng !== nextLng) {
            this.setLatLng([nextLat, nextLng]);
        }

        return this;
    }

    updateView() {
        if (!this._tooltip) {
            this.bindTooltip(this.tooltipCreator.buildEmptyTooltip());
        }
        this._tooltip.updateContent(this);


        this.setIcon(this.iconCreator(this));
    }

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