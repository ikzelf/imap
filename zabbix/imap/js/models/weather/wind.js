const NKW = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

class WeatherWind {
    deg = null;
    direction = null;
    image = null;
    speed = null;
    stormPoints = null;
    type = null;

    constructor(lang) {
        this.lang = lang;
    }


    load(data) {
        if (data.deg > 180) {
            data.deg = data.deg - 360;
        }

        this.direction = NKW[WeatherWind.sect(data.deg, 16)];
        this.deg = Math.round(data.deg);
        this.image = -50 * WeatherWind.sect(data.deg, 12);
        this.stormPoints = WeatherWind.calculateStormPoints(data.speed);
        this.speed = Math.round(data.speed * 100) / 100 + 'm/s';
        this.type = this.typeOfWind();
    }

    typeOfWind() {
        let typew = {};
        typew['ru'] = ['отсутствует', 'тихий', 'лёгкий', 'слабый', 'умеренный', 'свежий', 'сильный', 'крепкий', 'очень крепкий', 'штормовой', 'сильный штормовой', 'жестокий штормовой', 'ураганный'];
        typew['en'] = ['none', 'light air', 'light breeze', 'gentle breeze', 'moderate breeze', 'fresh breeze', 'strong breeze', 'whole breeze', 'fresh gale', 'strong gale', 'whole gale', 'storm', 'нurricane'];
        let lang = this.lang.substring(0, 2);
        if (!typew[lang]) {
            lang = 'en';
        }

        return typew[lang][this.stormPoints];
    }

    static sect(gr, sc) {
        let heading = gr;
        let sgr = 360 / sc;

        heading = heading + (sgr / 2);
        heading = heading % 360;
        if (heading < 0) {
            heading = 360 + heading;
        }
        heading = Math.floor(heading / sgr);
        return heading;
    }

    static calculateStormPoints(speed) {
        let stormPoints;
        if (speed >= 32.6) {
            stormPoints = 12;
        } else if (speed >= 28.4) {
            stormPoints = 11;
        } else if (speed >= 24.4) {
            stormPoints = 10;
        } else if (speed >= 20.7) {
            stormPoints = 9;
        } else if (speed >= 17.1) {
            stormPoints = 8;
        } else if (speed >= 13.8) {
            stormPoints = 7;
        } else if (speed >= 10.7) {
            stormPoints = 6;
        } else if (speed >= 7.9) {
            stormPoints = 5;
        } else if (speed >= 5.4) {
            stormPoints = 4;
        } else if (speed >= 3.3) {
            stormPoints = 3;
        } else if (speed >= 1.5) {
            stormPoints = 2;
        } else if (speed >= 0.2) {
            stormPoints = 1;
        } else {
            stormPoints = 0;
        }

        return stormPoints;
    }
}

export default WeatherWind;