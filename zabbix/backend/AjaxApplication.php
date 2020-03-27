<?php


namespace IMapify;

use IMapify\Components\Response\AjaxResponse;
use IMapify\Components\Router\ApiRouter;
use Throwable;

/**
 * Class AjaxApplication
 * @package IMapify
 */
class AjaxApplication extends Application
{

    /**
     * @inheritDoc
     */
    public function run()
    {
        $router = new ApiRouter($this->request, $this->config, $this->view);
        $router->init();

        try {
            $response = $router->handleRoute();
        } catch (Throwable $result) {
            $response = new AjaxResponse($result);
        }

        $this->view->flush($response);

        $this->end();
    }
}