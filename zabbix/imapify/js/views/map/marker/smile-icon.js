/**
 * Smile icon.
 */
class SmileIcon extends L.DivIcon {

    /**
     * Smile icon constructor.
     * @param {boolean} isMaintenance
     * @param {number} maxSeverity
     */
    constructor({
                    isMaintenance,
                    maxSeverity,
                }) {

        let classNames = [
            'icon-status',
            `icon-status-smile-${maxSeverity}`,
            `icon-status-${maxSeverity}`,
        ];

        if (isMaintenance) {
            classNames.push('maintenance');
        }

        super({
            className: classNames.join(' '),
            html: '',
            iconAnchor: [8, 8]
        });
    }

}

export default SmileIcon;