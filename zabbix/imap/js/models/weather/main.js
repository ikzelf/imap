class WeatherMain {
    temp = null;
    temp_min = null;
    temp_max = null;
    humidity = null;
    pressure = null;

    load(data) {
        this.temp = Math.round(data.temp * 10) / 10 + '°C';
        this.temp_min = Math.round(data.temp_min * 10) / 10 + '°C';
        this.temp_max = Math.round(data.temp_max * 10) / 10 + '°C';
        this.humidity = data.humidity;
        this.pressure = data.pressure;
    }
}

export default WeatherMain;