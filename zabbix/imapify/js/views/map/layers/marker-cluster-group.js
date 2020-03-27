import eventBus from '../../../services/bus';
import {clusterIconCreator} from '../../../services/map/cluster-icon-creator';
import {NEW_HOST_DETECTED} from '../../../events';
import HostMarker from '../host-marker';
import 'leaflet';
import 'leaflet.markercluster';

/**
 * Marker cluster group.
 */
class MarkerClusterGroup extends L.MarkerClusterGroup {
    /**
     * @type {Object.<number, HostMarker>}
     */
    #markerList;

    /**
     * Cluster group constructor.
     * @param {number} spiderfyDistanceMultiplier
     */
    constructor({spiderfyDistanceMultiplier}) {
        super({
            maxClusterRadius: 30,
            spiderfyDistanceMultiplier: spiderfyDistanceMultiplier,
            iconCreateFunction: clusterIconCreator,
        });

        this.#markerList = {};

        eventBus.on(NEW_HOST_DETECTED, (host) => this.#onNewHostDetected(host));
    }

    /**
     * Subscribe to host events and create marker.
     * @param host
     */
    #onNewHostDetected(host) {
        if (!this.hasOwnProperty(host.id)) {
            host.on('updated', ({oldValues}) => this.#updateMarker(host, oldValues));
            host.on('deleted', () => this.#removeMarker(host));
        }

        this.#updateMarker(host);
    }

    /**
     * Update marker by host.
     * @param {Host} host
     * @param {{}} [oldValues]
     */
    #updateMarker(host, oldValues) {
        if (!host.inventory.hasLocation()) {
            if (this.#markerList.hasOwnProperty(host.id)) {
                this.#removeMarker(host);
            }
            return;
        }

        // Create marker if not exist
        if (!this.#markerList.hasOwnProperty(host.id)) {
            this.#markerList[host.id] = new HostMarker();
        }

        const marker = this.#markerList[host.id];
        marker.updateData(host, oldValues);

        if (!this.hasLayer(marker)) {
            this.addLayer(marker);
        }

        marker.updateIconByParent();
    }

    /**
     * Remove host marker from layer and forget it.
     * @param {Host} host
     */
    #removeMarker(host) {
        if (this.#markerList.hasOwnProperty(host.id)) {
            if (this.hasLayer(this.#markerList[host.id])) {
                this.removeLayer(this.#markerList[host.id]);
            }

            delete this.#markerList[host.id];
        }
    }
}

export default MarkerClusterGroup;