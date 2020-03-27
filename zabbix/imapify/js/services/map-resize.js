class MapResizeService {
    constructor({checkInterval, map}) {
        this.checkInterval = checkInterval || 1000;
        this.intervalId = null;
        this.map = map;
    }

    run() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => this.map.checkSize(), this.checkInterval);

        /* TODO:
    $(window).resize(function () {
        if (document.readyState === 'complete') setInterval(function () {
            app.imapify.map.checkSize();

        }, 1000);
    });
         */
    }
}

export default MapResizeService;