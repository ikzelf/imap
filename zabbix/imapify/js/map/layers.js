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
//         L.control.attribution({prefix:''}).addAttribution('<a href="http://maps.sputnik.ru/">Спутник</a> | &copy; Ростелеком | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>').addTo(map);
exports.maps = baseMaps;
exports.overlays = overlayMaps;
