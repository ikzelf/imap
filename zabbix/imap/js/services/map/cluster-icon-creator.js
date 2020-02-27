import ClusterMarkerIcon from '../../views/map/marker/cluster-icon';

class ClusterIconCreator {
    static build(cluster) {
        let childMarkers = cluster.getAllChildMarkers();
        let childHostInfo = {};
        childHostInfo.ok = 0;
        childHostInfo.problem = 0;
        childHostInfo.maintenance = 0;

        let maxStatus = 0;
        let count = 0;

        childMarkers.forEach(childMarker => {
            maxStatus = Math.max(childMarker.status, maxStatus);
            count++;

            if (childMarker.deleted) {
                count--;
            } else if (childMarker.notTrigger && childMarker.maintenance) {
                childHostInfo.maintenance++;
            } else if (childMarker.status > 0) {
                childHostInfo.problem++;
            } else {
                childHostInfo.ok++;
            }
        });

        return new ClusterMarkerIcon({
            maxStatus: maxStatus,
            counters: childHostInfo,
        });
    }
}

export default ClusterIconCreator;