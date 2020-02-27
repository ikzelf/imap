import SmileIcon from '../../views/map/marker/smile-icon';

class SmileIconCreator {
    static build(marker) {
        return new SmileIcon({
            isTriggered: !marker.notTrigger,
            isMaintenance: !!marker.maintenance,
            status: marker.status
        });
    }
}

export default SmileIconCreator;