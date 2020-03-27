<?php


namespace IMapify\Controllers;

use CProfile;
use CWebUser;
use IMapify\Application;
use IMapify\Components\PageFilterBuilder;
use IMapify\Components\Response\Response;
use IMapify\Components\Response\WebResponse;
use IMapify\Exceptions\RenderException;

/**
 * Class WebController
 * @package IMapify\Controllers
 */
class WebController extends BaseController
{
    public $layout = 'layouts/default_layout';

    /**
     * @return string
     * @throws RenderException
     */
    public function actionIndex(): string
    {
        // fetch filter from profiles
        $filter = [
            'application' => CProfile::get('web.tr_status.filter.application', ''),
            'inventory' => [],
            'showDetails' => CProfile::get('web.tr_status.filter.show_details', 0),
            'showMaintenance' => CProfile::get('web.tr_status.filter.show_maintenance', 1),
            'txtSelect' => CProfile::get('web.tr_status.filter.txt_select', ''),
            'showChange' => CProfile::get('web.tr_status.filter.status_change', 0),
            'statusChangeByDays' => CProfile::get('web.tr_status.filter.status_change_days', 14),
            'showSeverity' => CProfile::get('web.tr_status.filter.show_severity', TRIGGER_SEVERITY_NOT_CLASSIFIED),

            // TODO: ack status $config['event_ack_enable'] && 'web.tr_status.filter.ack_status'
            'ackStatus' => ZBX_ACK_STS_ANY,
            // TODO: show events 'web.tr_status.filter.show_events'
            'showEvents' => true,
            'showSuppressed' => ZBX_PROBLEM_SUPPRESSED_FALSE,
            'hostId' => $this->request->getQueryParam('hostid'),
            'groupId' => $this->request->getQueryParam('groupid'),
            'isFullscreen' => $this->request->getQueryParam('fullscreen', 0),
        ];

        if ((int)$this->request->getQueryParam('show_triggers') === TRIGGERS_OPTION_ALL) {
            $filter['showTriggers'] = TRIGGERS_OPTION_ALL;
        } else {
            $filter['showTriggers'] = CProfile::get('web.tr_status.filter.show_triggers', TRIGGERS_OPTION_RECENT_PROBLEM);
        }

        foreach (CProfile::getArray('web.tr_status.filter.inventory.field', []) as $i => $field) {
            $filter['inventory'][] = [
                'field' => $field,
                'value' => CProfile::get('web.tr_status.filter.inventory.value', null, $i)
            ];
        }

        $this->registerScripts();

        return $this->view->render($this->layout, [
            'filter' => $filter,
            'config' => select_config(),
            'pageFilter' => PageFilterBuilder::getInstance($this->request)->getFilter(),
            'activeTab' => CProfile::get('web.tr_status.filter.active', 0),
        ]);
    }

    /**
     * Register client scripts and styles
     */
    protected function registerScripts()
    {
//        $this->view->registerStyleFile('https://maps-js.apissputnik.ru/v0.3/sputnik_maps_bundle.min.css')
//            ->registerScriptFile('https://maps-js.apissputnik.ru/v0.3/sputnik_maps_bundle.min.js');

//        Migrate to NPM
//        $this->view
//            ->registerStyleFile('imapify/leaflet/leaflet.css')
//            ->registerStyleFile('imapify/leaflet/plugins/markercluster/MarkerCluster.css')
//            ->registerStyleFile('imapify/leaflet/plugins/markercluster/MarkerCluster.Default.css')
//            ->registerScriptFile('imapify/leaflet/leaflet.js')
//            ->registerScriptFile('imapify/leaflet/plugins/markercluster/leaflet.markercluster.js')
//        ;

        $this->view

//            ->registerStyleFile('imapify/leaflet/ext-plugins/jquery.fs.stepper.css')
//            ->registerScriptFile('imapify/leaflet/ext-plugins/jquery.fs.stepper.min.js')

            // TODO: search actual plugin
//            ->registerStyleFile('imapify/leaflet/plugins/zoomslider/L.Control.Zoomslider.css')
//            ->registerScriptFile('imapify/leaflet/plugins/zoomslider/L.Control.Zoomslider.js')

            // TODO: search actual plugin
//            ->registerStyleFile('imapify/leaflet/plugins/leaflet.measure/leaflet.measure.css')
//            ->registerScriptFile('imapify/leaflet/plugins/leaflet.measure/leaflet.measure.js')
//

            // TODO: search actual plugin
//            ->registerScriptFile('imapify/leaflet/ext-plugins/colorpicker/colors.js')
//            ->registerScriptFile('imapify/leaflet/ext-plugins/colorpicker/jqColorPicker.js')

            ;

        if (file_exists(Application::$app->getIMapPath() . '/imapify/userstyles.css')) {
            $this->view->registerStyleFile('imapify/userstyles.css');
        }

        $this->registerSettings()
            ->registerLocalization();

        if (file_exists(Application::$app->getIMapPath() . '/imapify/settings.js')) {
            $this->view->registerScriptFile('imapify/settings.js?t=' . mt_rand());
        }

        $this->view->registerScriptFile('imapify/dist/build.js');

        if (file_exists(Application::$app->getIMapPath() . '/imapify/additions.js')) {
            $this->view->registerScriptFile('imapify/additions.js?t=' . mt_rand());
        }

        //проверяем наличие таблиц в БД
        $check_links = true;
        if (!DBselect('SELECT 1 FROM hosts_links')) {
            $check_links = false;
            clear_messages(1);
        }

        if (!DBselect('SELECT 1 FROM hosts_links_settings')) {
            $check_links = false;
            clear_messages(1);
        }

        if (!$check_links) {
            $this->view->registerScript('_imap.settings.links_enabled = false;');
        }
    }

    /**
     * Register localization.
     *
     * @return WebController
     */
    private function registerLocalization(): WebController
    {
        $zabbixDictionary = [
            'Search',
            'Ack',
            'Yes',
            'No',
            'Host inventory',
            'Triggers',
            'Graphs',
            'Latest data',
            'Host',
            'Applications',
            'Items',
            'Discovery rules',
            'Web scenarios',
        ];
        $iMapDictionary = [
            'Change location',
            'Delete location',
            'Add a link to another host',
            'Select a new position',
            'Failed to update data',
            'Failed to get data',
            'Error',
            'Hosts',
            'This host does not have coordinates',
            'Set a hardware type',
            'Hardware type updated',
            "Host's links",
            'Show debug information',
            'Debug information',
            'Select hosts for links',
            'Name',
            'Delete link',
            'Link options',
            'Link name',
            'Link color',
            'Link width',
            'Link opacity',
            'Link dash',
            'Delete confirm',
            'Successful',
            'Zoom in',
            'Zoom out',
            'No hosts with inventory',
            'Keep',
            'Tools',
            'Sort by severity',
            'Sort by time',
            'Config',
            'Host config',
            'Host view',
            'Wind speed',
            'Wind points',
            'Wind type',
            'Wind direction',
            'Temperature',
            'Humidity',
            'Pressure',
            'Sunset',
            'Sunrise',
            'Data obtained',
            'Show weather',

            // TODO: append to dictionary
            'This host is disabled',
            'This host has inventory mode disabled',
            'This host has no coordinates',
            'Close',
            'Problems',
        ];

        $locale = [];
        foreach ($zabbixDictionary as $word) {
            $locale[$word] = _($word);
        }

        foreach ($iMapDictionary as $word) {
            $locale[$word] = Application::__i($word);
        }

        $locale['inventoryfields'] = [];
        foreach (getHostInventories() as $field) {
            $locale['inventoryfields'][$field['db_field']] = $field['title'];
        }

        $js = 'locale = Object.assign({}, ' . json_encode($locale) . ')';

        $this->view->registerScript($js);

        return $this;
    }

    /**
     * Register JS settings.
     */
    private function registerSettings(): WebController
    {
        $imapVersion = trim(file_get_contents('imapify/version'));
        $showSeverity = CProfile::get('web.tr_status.filter.show_severity', TRIGGER_SEVERITY_NOT_CLASSIFIED);
        $pageFilter = PageFilterBuilder::getInstance($this->request)->getFilter();

        $jsOptions = [
            'settings' => [
                'lang' => CWebUser::$data['lang'],

                // This settings changing in interactive mode
                'minStatus' => $showSeverity,

                // This settings changing in file settings.js
                'useSearch' => true,
                'useZoomSlider' => true,
                'linksEnabled' => true,
                'debugEnabled' => true,
                'maxMarkersSpiderfy' => 50,
                'excludingInventory' => ['hostid', 'location_lat', 'location_lon', 'url_a', 'url_b', 'url_c'],

                'startCoordinates' => [59.95, 30.29],
                'startZoom' => 4,
                'mapAnimation' => true,
                'hostUpdateInterval' => 60,
                'triggerUpdateInterval' => 30,
                'intervalLoadLinks' => 60,
                'showMarkersLabels' => false,
                'spiderfyDistanceMultiplier' => 1,
                'defaultBaseLayer' => 'OpenStreetMap',
                'weatherApiKey' => '',
                'bingApiKey' => '',
            ],
            // Фильтр для отбора хостов и групп
            'filter' => [
                'showSeverity' => 0,
                'hostId' => $pageFilter->hostid,
                'groupId' => $pageFilter->groupid,
            ],
            'version' => $imapVersion,
            'zabbixVersion' => ZABBIX_VERSION,
        ];

        $js = 'window._imap = ' . json_encode($jsOptions) . ';';
        $this->view->registerScript($js);

        return $this;
    }

    /**
     * @inheritDoc
     */
    protected function prepareResult($result): Response
    {
        return new WebResponse($result);
    }
}