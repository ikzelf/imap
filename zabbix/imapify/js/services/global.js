import DebugInfoService from './global/debug-info';
import ChangeHostLocationService from './global/change-host-location';
import RemoveHostLocationService from './global/remove-host-location';
import CreateHostLinkService from './global/create-host-link';
import UpdateHardwareService from './global/update-hardware';
import MenuPopup2Service from './global/menu-popup-2';
import RemoveLinkService from './global/remove-link';

class GlobalServices {
    static init({
                    map,
                    lang,
                }) {
        new DebugInfoService();
        new ChangeHostLocationService(map);
        new RemoveHostLocationService();
        new CreateHostLinkService();
        new UpdateHardwareService();
        new MenuPopup2Service();
        new RemoveLinkService();
    }
}

export default GlobalServices;