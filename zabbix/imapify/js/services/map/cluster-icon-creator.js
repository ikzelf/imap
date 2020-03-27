import ClusterMarkerIcon from '../../views/map/marker/cluster-icon';

/**
 *
 * @param {L.MarkerCluster} cluster
 * @return {ClusterMarkerIcon}
 */
export const clusterIconCreator = (cluster) => {

    /** @type {[HostMarker]} */
    let childMarkers = cluster.getAllChildMarkers();
    let childHostInfo = {};
    childHostInfo.ok = 0;
    childHostInfo.problem = 0;
    childHostInfo.maintenance = 0;

    let maxPriority = 0;
    let count = 0;

    /**
     * @param {HostMarker} childMarker
     */
    childMarkers.forEach(childMarker => {

        maxPriority = Math.max(childMarker.maxSeverity, maxPriority);
        count++;

        if (childMarker.isMaintenance) {
            childHostInfo.maintenance++;
        } else if (childMarker.hasProblem) {
            childHostInfo.problem++;
        } else {
            childHostInfo.ok++;
        }
    });

    return new ClusterMarkerIcon({
        priority: maxPriority,
        counters: childHostInfo,
    });
};
