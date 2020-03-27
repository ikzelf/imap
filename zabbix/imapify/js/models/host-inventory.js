/**
 * Host inventory model.
 */
class HostInventory {

    /**
     * Location lat
     * @type {?number}
     */
    lat;

    /**
     * Location lng
     * @type {?number}
     */
    lng;

    /**
     * Update host inventory model.
     * @param {{}} data
     */
    update(data) {
        this.lat = data['location_lat'] ? parseFloat(data['location_lat']) : null;
        this.lng = data['location_lon'] ? parseFloat(data['location_lon']) : null;
    }

    /**
     * Host inventory has information about location.
     * @return {boolean}
     */
    hasLocation() {
        return !!this.lat && !!this.lng;
    }
}

export default HostInventory;