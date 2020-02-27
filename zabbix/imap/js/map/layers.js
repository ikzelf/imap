let baseMaps = {};
let overlayMaps = {};

baseMaps['OpenStreetMap'] = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
baseMaps['OpenCycleMap'] = new L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Maps &copy; <a href="http://www.thunderforest.com">Thunderforest</a>, Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
baseMaps['Stamen B&W'] = new L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
    maxZoom: 18,
    subdomains: 'abcd',
    attribution: 'Map Data: © <a href="http://maps.stamen.com/" target="_blank">Stamen.com</a>'
});
baseMaps['Kosmosnimki.ru OSM'] = new L.tileLayer('https://tilessputnik.ru/{z}/{x}/{y}.png', {
    maxZoom: 18,
    subdomains: 'abcdef',
    attribution: 'Map Data: © <a href="http://osm.kosmosnimki.ru/" target="_blank">osm.kosmosnimki.ru</a>'
});

// TODO: add sputnik http://api.sputnik.ru/maps/ (FREE OSM)

if (_imap.settings.bingApiKey) {
    baseMaps['Bing Satellite'] = new L.BingLayer(_imap.settings.bingApiKey, {
        culture: _imap.settings.lang,
        type: 'Aerial'
    });
    baseMaps['Bing Hybrid'] = new L.BingLayer(_imap.settings.bingApiKey, {
        culture: _imap.settings.lang,
        type: 'AerialWithLabels'
    });
    baseMaps['Bing'] = new L.BingLayer(_imap.settings.bingApiKey, {culture: _imap.settings.lang, type: 'Road'});
}

if (_imap.settings.yandex_apiKey) {
    // TODO: work with Yandex map
    baseMaps['Yandex'] = new L.Yandex();
    baseMaps['Yandex'].options.maxZoom = 18;
    baseMaps['Yandex Satellite'] = new L.Yandex('satellite');
    baseMaps['Yandex Hybrid'] = new L.Yandex('hybrid');
    overlayMaps["Yandex Traffic"] = new L.Yandex("null", {traffic: true, opacity: 0.8, overlay: true});
}

if (_imap.settings.google_apiKey) {
    // TODO: work with Google map
    baseMaps['Google Satellite'] = new L.Google();
    baseMaps['Google'] = new L.Google('ROAD');
    baseMaps['Google Hybrid'] = new L.Google('HYBRID');
}

exports.maps = baseMaps;
exports.overlays = overlayMaps;
