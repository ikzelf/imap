class LastUpdateService {
    constructor(updateInterval) {
        this.intervalId = null;
        this.updateInterval = updateInterval || 1000;
    }

    run() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => this.update(), this.updateInterval);
    }

    update() {
        let currentTime = new Date().getTime() / 1000;

        document.querySelectorAll('[lastchange]')
            .forEach((element) => {
                let diff = currentTime - element.getAttribute('lastchange');
                element.innerText = this.formatTime(diff);
            });
    }

    /**
     * @deprecated want to change for date formatter
     * @param value
     * @returns {string}
     */
    formatTime(value) {
        let D = Math.floor(value / 3600 / 24);
        value = value - (D * 3600 * 24);
        if (D > 0) {
            D = D + 'd ';
        } else {
            D = '';
        }
        const H = Math.floor(value / 3600);

        let M = Math.floor(value / 60) - (Math.floor(value / 3600) * 60);
        if (M < 10) {
            M = '0' + M;
        }

        let S = Math.round(value % 60);
        let SS = '' + S;
        if (S < 10) {
            SS = '0' + SS;
        }

        return D + H + ':' + M + ':' + SS;
    }
}

export default LastUpdateService;