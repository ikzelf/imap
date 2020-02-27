import axios from 'axios';

// TODO: move lang & weatherApiKey to settings
export const fetchWeather = (lang, weatherApiKey, latLng) => {
    return axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            units: 'metric',
            lang: lang.substring(0, 2),
            APPID: weatherApiKey,
            lat: latLng.lat,
            lon: latLng.lng,
        }
    });
};