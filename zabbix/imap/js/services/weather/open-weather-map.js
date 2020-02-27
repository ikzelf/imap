import eventBus from '../bus';
import {OPEN_WEATHER_VIEW} from '../../events';
import {fetchWeather} from '../../api/open-weather-map';
import WeatherWind from '../../models/weather/wind';
import WeatherMain from '../../models/weather/main';
import {__} from '../../helpers';

class OpenWeatherMapService {
    constructor(map, {
        weatherApiKey,
        lang,
    }) {
        this.lang = lang;
        this.weatherApiKey = weatherApiKey;
        this.map = map;
        this.requestId = 0;
        this.popup = null;
        this.content = null;

        eventBus.on(OPEN_WEATHER_VIEW, (latLng) => this.open(latLng));
    }

    create(latLng) {
        if (!this.popup) {
            this.popup = L.popup();

            this.content = L.DomUtil.create('div');
            this.content.setAttribute('id', 'weatherdiv');

            // TODO: move size to css
            this.content.innerHTML = '<!--suppress CheckImageSize --><img width="50px" src="/imap/images/image-loading.gif" alt="" />';

            this.move(latLng);
            this.popup.addTo(this.map);
        }
    }

    move(latLng) {
        this.popup.setLatLng([latLng.lat, latLng.lng])
    }

    open(latLng) {
        this.requestId++;

        if (!this.popup) {
            this.create(latLng);
        } else {
            this.move(latLng);
        }

        fetchWeather(this.lang, this.weatherApiKey, latLng)
            .then(response => {
                this.setResult(response.data);
            }).catch(_ => {
            $("weatherdiv").html('Error request');

        });
    }


    // TODO: move all styles to css
    setResult(data) {
        console.log('fetchWeather setResult', data);
        if (!data.base) {
            return;
        }

        let weather = data['weather'][0];

        // TODO? if (app.imap.weatherrequestid > reqid) return false;

        let wind = new WeatherWind(this.lang);
        wind.load(data['wind']);

        let main = new WeatherMain();
        main.load(data['main']);

        let weatherContainer = L.DomUtil.create('div');
        weatherContainer.style.width = '280px';


        let bContainerTable = L.DomUtil.create('div', '', weatherContainer);
        bContainerTable.style.display = 'table';

        let bcontainer = L.DomUtil.create('div', '', bContainerTable);
        bcontainer.style.display = 'table-row';

        bcontainer.innerHTML = `<div style="display:table-cell; vertical-align: middle; padding:5px;"><div style="display:block; width:50px; height:50px; background-image:url(https://openweathermap.org/img/w/${weather.icon}.png);">${main.temp}</div></div>`;

        let oContainerTableCell = L.DomUtil.create('div', '', bcontainer);
        oContainerTableCell.style.display = 'table-cell';
        oContainerTableCell.style.verticalAlign = 'middle';

        let ocontainer = L.DomUtil.create('div', '', oContainerTableCell);
        ocontainer.style.display = 'block';
        ocontainer.style.width = '50px';
        ocontainer.style.height = '50px';
        ocontainer.style.backgroundImage = 'url("imap/images/wind_arrow_x1.png")';
        ocontainer.style.backgroundPosition = '0px 50px';

        let container = L.DomUtil.create('div', '', ocontainer);
        container.innerHTML = `${wind.deg}°<br>${wind.direction}`;
        container.style.display = 'inline-block';
        container.style.width = '50px';
        container.style.height = '50px';
        container.style.backgroundImage = 'url("imap/images/wind_arrow_x1.png")';
        container.style.backgroundPosition = `0px ${wind.image}px`;
        container.style.verticalAlign = 'middle';
        container.style.textAlign = 'center';
        container.style.fontWeight = 'bold';
        container.style.lineHeight = '25px';
        container.style.fontSize = '14px';


        bcontainer.innerHTML += `<div style="display:table-cell; vertical-align: middle; padding:5px;">${weather.description}<br>${__('Wind type')} ${wind.type}<br>${__('Humidity')} ${main.humidity}%</div><br>`;


        weatherContainer.innerHTML += `${__('Temperature')}: ${main.temp_min} - ${main.temp_max} <br>`;

        weatherContainer.innerHTML += `${__('Wind speed')}: ${wind.speed}, ${__('Wind points')}: ${wind.stormPoints} (${wind.type})<br>`;
        weatherContainer.innerHTML += `${__('Wind direction')}: ${wind.deg}° (${wind.direction})<br>`;
        weatherContainer.innerHTML += `${__('Humidity')}: ${main.humidity}% <br>`;
        weatherContainer.innerHTML += `${__('Pressure')}: ${OpenWeatherMapService.convertData(main.pressure, 'mmhg')}(${OpenWeatherMapService.convertData(main.pressure, 'hpa')}) <br>`;

        let sunrise = data['sys']['sunrise'];
        let sunset = data['sys']['sunset'];
        weatherContainer.innerHTML += `${__('Sunrise')}: ${OpenWeatherMapService.convertData(sunrise, 'timeonly')} ${__('Sunset')}: ${OpenWeatherMapService.convertData(sunset, 'timeonly')} <br>`;
        weatherContainer.innerHTML += `${__('Data obtained')}: ${OpenWeatherMapService.convertData(data['dt'], 'date')} <br>`;

        weatherContainer.innerHTML += '<div style="text-align:right; margin-top:5px; font-size:0.9em;">Powered by <a href="http://openweathermap.org/terms" title="Free Weather API" target="_blank">OpenWeatherMap</a></div>';

        return weatherContainer;
    }


    // TODO: replace with time library
    static convertData(val, ed, ms, nools) {
        const padLeft = (val) => {
            if (val > 9) {
                return val;
            }
            return '0' + val;
        };

        if (ed === 'time') {
            if (isNaN(val)) return '---';
            let H = Math.floor(val / 3600);
            let M = Math.floor(val / 60) - (Math.floor(val / 3600) * 60);
            if (M < 10) M = '0' + M;
            let S = Math.round(1000 * (val % 60)) / 1000;
            let SS = '' + S;
            if (nools) SS = '' + S.toFixed(3);
            if (S < 10) SS = '0' + SS;

            return H + ':' + M + ':' + SS;
        }
        if (ed === 'hpa') {
            if (isNaN(+val)) return '---';
            return +val + 'hPa';
        }
        if (ed === 'mmhg') {
            if (isNaN(+val)) return '---';
            return (+val * 100 / 133.3).toFixed(2) + 'mmHg';
        }
        if (ed === 'date') {
            if (isNaN(val)) return '---';
            // let bb = val - Math.round(val);
            let aa = new Date(+val * 1000);
            return (padLeft(1900 + aa.getYear()) + '-' + padLeft(1 + aa.getMonth()) + '-' + padLeft(aa.getDate()) + ' ' + padLeft(aa.getHours()) + ':' + padLeft(aa.getMinutes()) + ':' + padLeft(aa.getSeconds()));
        }
        if (ed === 'timeonly') {
            if (isNaN(val)) return '---';
            // let bb = val - Math.round(val);
            let aa = new Date(+val * 1000);
            return (padLeft(aa.getHours()) + ':' + padLeft(aa.getMinutes()) + ':' + padLeft(aa.getSeconds()));
        }
        if (ed === '') {
            return val;
        }
    }
}

export default OpenWeatherMapService;