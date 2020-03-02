import eventBus from '../../../services/bus';
import {NOTIFY_LINK_REMOVED, NOTIFY_LINK_UPDATED, OPEN_LINK_OPTIONS_DIALOG} from '../../../events';
import {ZOOM_METERS} from '../../../settings';

class LinkLayerGroup extends L.LayerGroup {
    constructor(markerLayer) {
        super();

        this.markerLayer = markerLayer;

        eventBus.on(NOTIFY_LINK_UPDATED, (link) => this.onLinkUpdated(link));
        eventBus.on(NOTIFY_LINK_REMOVED, (link) => this.removeLink(link));
    }

    removeLink(link) {
        if (link.polyline && this.hasLayer(link.polyline)) {
            this.removeLayer(link.polyline);
        }
    }

    /**
     *
     * @param link {Link}
     */
    onLinkUpdated(link) {
        if (!this._map || !this._map.hasLayer(this)) {
            return;
        }

        this.removeLink(link);

        let polyline = L.polyline([], {
            color: link.color,
            name: '',
            dashArray: link.dash,
            opacity: link.opacity,
            weight: link.weight,
            smoothFactor: 8
        });

        link.polyline = polyline;

        let tooltipContainer = L.DomUtil.create('div');
        if (link.name) {
            L.DomUtil.create('b', '', tooltipContainer).innerText = link.name;
        }

        L.DomUtil.create('div', '', tooltipContainer).innerText = `${link.host1.name} <--> ${link.host2.name}`;

        polyline.bindTooltip(tooltipContainer);
        polyline.options.name = link.name;

        polyline.on('click', () => eventBus.emit(OPEN_LINK_OPTIONS_DIALOG, null, link.id));

        this.renderLink(link);
    }

    /* обновляем линию связи */
    /**
     * @param link {Link}
     */
    renderLink(link) {
        if (link.host1.hasLocation() && link.host2.hasLocation()) {
            // TODO: check visible parent
            // (markerLayer.getVisibleParent(this.host1.marker) || markerLayer.getVisibleParent(this.host2.marker))
            // markerLayer.getVisibleParent(this.host1.marker) !== markerLayer.getVisibleParent(this.host2.marker)

            link.polyline.setLatLngs([
                [link.host1.inventory.location_lat, link.host1.inventory.location_lon],
                [link.host2.inventory.location_lat, link.host2.inventory.location_lon],
            ]);

            let latLngList = link.polyline.getLatLngs();
            if (latLngList[0].distanceTo(latLngList[1]) > ZOOM_METERS[this._map.getZoom()]) {
                if (!this.hasLayer(link.polyline)) {
                    this.addLayer(link.polyline);
                }

                return;
            }
        }

        if (this.hasLayer(link.polyline)) {
            this.removeLayer(link.polyline);
        }
    }


}

export default LinkLayerGroup;