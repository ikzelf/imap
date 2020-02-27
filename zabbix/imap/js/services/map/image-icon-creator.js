import ImageIcon from '../../views/map/marker/image-icon';

class ImageIconCreator {
    static build(marker) {
        return new ImageIcon({
            isTriggered: !marker.notTrigger,
            isMaintenance: !!marker.maintenance,
            status: marker.status,
            hardware: marker.hardware,
        })
    }
}

export default ImageIconCreator;