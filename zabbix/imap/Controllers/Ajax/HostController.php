<?php

namespace Imap\Controllers\Ajax;

use API;

/**
 * Class HostController
 * @package Imap\Controllers
 */
class HostController extends BaseAjaxController
{

    /**
     * Get host list
     * @return array|bool
     */
    public function actionIndex()
    {
        $options = $this->getBaseOptions();

        $options['monitored_hosts'] = true;
        $options['withInventory'] = true;
        $options['output'] = ['hostid', 'name', 'description'];
        $options['selectInventory'] = ['location_lat', 'location_lon', 'url_a', 'url_b', 'url_c'];

        $hardwareField = $this->request->get('hardwareField', 'type');
        if ($hardwareField) {
            $options['selectInventory'][] = $hardwareField;
        }

        $options['selectMaintenances'] = 'extend';

        return API::Host()->get($options);
    }

    /**
     * @return array|bool
     */
    public function actionSearch()
    {
        $query = $this->request->get('query', '');

        $options = $this->getBaseOptions();
        $options['searchByAny'] = true;
        $options['output'] = 'hostid';
        $options['search'] = [
            'host' => $query,
            'name' => $query,
            'dns' => $query,
            'ip' => $query,
        ];

        return API::Host()->get($options);
    }

    /**
     * @return array|bool
     */
    public function actionView()
    {
        $options = $this->getBaseOptions();
        $options['selectInterfaces'] = 'extend';
        $options['selectInventory'] = 'extend';
        $options['selectMaintenances'] = 'extend';
        if (empty($options['hostids'])) {
            $options['hostids'] = false;
        }

        $hosts = API::Host()->get($options);
        if (empty($hosts)) {
            return [
                'jsonrpc' => '2.0',
                'error' => ['message' => 'Host not found error.'],
            ];
        }
        $host = array_shift($hosts);

        $scripts = API::Script()->getScriptsByHosts([$host['hostid']]);
        $host['scripts'] = $scripts[$host['hostid']];

        return $host;
    }

    /**
     * @return array
     */
    public function actionUpdateLocation()
    {
        $hostId = (int)$this->getBaseOptions()['hostids'];

        if (!$this->checkHostsIsWritable($hostId)) {
            return $this->accessError();
        }

        $lat = $this->request->getBodyParam('lat');
        $lng = $this->request->getBodyParam('lng');

        if ($lat === null || $lat === 'none' || $lng === null || $lng === 'none') {
            $lat = null;
            $lng = null;
        } else {
            $lat = (float)$lat;
            $lng = (float)$lng;
        }

        $options = [
            'hostid' => $hostId,
            'inventory' => [
                'location_lat' => $lat,
                'location_lon' => $lng
            ]
        ];


        API::Host()->update($options);

        $options = $this->getBaseOptions();
        $options['selectInventory'] = ['location_lat', 'location_lon'];

        $host = API::Host()->get($options)[$options['hostids']];

        return ['result' => $host];
    }
}