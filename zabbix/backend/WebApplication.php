<?php


namespace IMapify;

use IMapify\Components\Api\ZabbixAPI;
use IMapify\Components\Response\WebResponse;
use IMapify\Components\Router\WebRouter;
use IMapify\Components\ZabbixFilterService;
use IMapify\Exceptions\ZabbixAPIException;

/**
 * Class WebApplication
 * @package IMapify
 */
class WebApplication extends Application
{
    /**
     * @var string
     */
    private $apiAuthKey;

    /**
     * @inheritDoc
     */
    public function run()
    {
        // Generate Zabbix API auth
        $zabbixAPI = new ZabbixAPI($this->config->getIMapPath() . '/secret.php', $this->config->getIMapPath() . '/.auth_token');
        try {
            $this->apiAuthKey = $zabbixAPI->getAuthKey();
            $this->view->registerApiKey($this->apiAuthKey);

            ZabbixFilterService::prepareZabbixFilter($this->request);

            $router = new WebRouter($this->request, $this->config, $this->view);
            $router->init();
            $response = $router->handleRoute();

        } catch (ZabbixAPIException $exception) {
            $response = new WebResponse($exception);
        }

        $this->view->flush($response);

        $this->end();
    }
}