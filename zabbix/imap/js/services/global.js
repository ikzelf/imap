import DebugInfoService from './global/debug-info';
import ChangeHostLocationService from './global/change-host-location';
import RemoveHostLocationService from './global/remove-host-location';
import CreateHostLinkService from './global/create-host-link';
import UpdateHardwareService from './global/update-hardware';
import MenuPopup2Service from './global/menu-popup-2';
import RemoveLinkService from './global/remove-link';
import GoogleStreetViewService from './google/street-view';
import OpenWeatherMapService from './weather/open-weather-map';

class GlobalServices {
    static init({
                    map,
                    weatherApiKey,
                    lang,
                }) {
        new DebugInfoService();
        new ChangeHostLocationService(map);
        new RemoveHostLocationService();
        new CreateHostLinkService();
        new UpdateHardwareService();
        new MenuPopup2Service();
        new RemoveLinkService();
        new GoogleStreetViewService(map);
        new OpenWeatherMapService(map, {
            weatherApiKey: weatherApiKey,
            lang: lang
        });
    }
}

export default GlobalServices;