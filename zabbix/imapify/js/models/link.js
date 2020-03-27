class Link {
    id = null;
    name = '';

    ids = null;
    color = null;
    weight = null;
    opacity = null;
    dash = null;

    /**
     * @type {Host}
     */
    host1 = null;

    /**
     * @type {Host}
     */
    host2 = null;

    /**
     *
     * @type {Polyline}
     */
    polyline = null;

    constructor() {

    }

    load(data) {
        Object.assign(this, data);

        this.dash = this.dash || '';
        this.color = this.color || '#0034ff';
        this.opacity = this.opacity || 50;
        this.opacity /= 100;
        this.weight = this.weight || 5;

        if (!this.name || this.name === '0') {
            this.name = '';
        }
    }

}


export default Link;