import eventBus from '../../../services/bus';
import ClusterIconCreator from '../../../services/map/cluster-icon-creator';
import SmileIconCreator from '../../../services/map/smile-icon-creator';
import ImageIconCreator from '../../../services/map/image-icon-creator';
import {
    MOVE_TO_HOST,
    NOTIFY_HOST_SUCCESSFULLY_LOADED,
    NOTIFY_TRIGGER_REMOVED,
    NOTIFY_TRIGGER_UPDATED
} from '../../../events';
import HostMarker from '../host-marker';

class MarkerClusterGroup extends L.MarkerClusterGroup {
    constructor({
                    spiderfyDistanceMultiplier,
                    maxMarkersSpiderfy,
                    map,

                    markerIconCreator,
                    tooltipCreator,
                    popupCreator,
                }) {

        super({
            maxClusterRadius: 30,
            spiderfyDistanceMultiplier: spiderfyDistanceMultiplier,
            iconCreateFunction: ClusterIconCreator.build,
        });

        this.markerList = {};


        this.markerIconCreator = markerIconCreator;
        this.tooltipCreator = tooltipCreator;
        this.popupCreator = popupCreator;

        this.on('clustercontextmenu', (a) => {
            if ((a.layer._childCount < maxMarkersSpiderfy) || (map.getMaxZoom() === map.getZoom())) {
                a.layer.spiderfy();
            } else {
                a.layer.zoomToBounds();
            }
        });


        eventBus.on(NOTIFY_HOST_SUCCESSFULLY_LOADED, (hostList) => this.updateMarkerList(hostList));

        eventBus.on(NOTIFY_TRIGGER_UPDATED, (trigger) => trigger.hosts.forEach(host => this.updateMarkerByHost(host)));
        eventBus.on(NOTIFY_TRIGGER_REMOVED, (trigger) => trigger.hosts.forEach(host => this.updateMarkerByHost(host)));
    }

    updateMarkerList(hostList) {
        let newHostIds = Object.keys(hostList);

        Object.keys(this.markerList)
            .filter(hostId => !newHostIds.include(hostId))
            .forEach(hostId => this.removeMarker(hostId));

        Object.values(hostList)
            .forEach(host => this.updateMarkerByHost(host));
    }

    removeMarker(hostId) {
        if (this.markerList.hasOwnProperty(hostId)) {
            let marker = this.markerList[hostId];
            if (this.hasLayer(marker)) {
                this.removeLayer(marker);
            }

            delete this.markerList[hostId];
        }
    }

    updateMarkerByHost(host) {
        if (!host.hasLocation()) {
            this.removeMarker(host.hostid);
            return;
        }

        if (!this.markerList.hasOwnProperty(host.hostid)) {
            this.markerList[host.hostid] = new HostMarker({
                iconCreator: this.markerIconCreator,
                tooltipCreator: this.tooltipCreator,
                popupCreator: this.popupCreator,
            });
        }

        let marker = this.markerList[host.hostid];
        marker.updateByHost(host);

        if (!this.hasLayer(marker)) {
            this.addLayer(marker);
        }

        marker.updateIconByParent();
    }
}

export default MarkerClusterGroup;