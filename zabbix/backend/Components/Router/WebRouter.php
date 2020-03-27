<?php


namespace IMapify\Components\Router;

use IMapify\Controllers\BlockController;
use IMapify\Controllers\WebController;
use IMapify\Models\Route;

/**
 * Class WebRouter
 * @package IMapify\Components\Router
 */
class WebRouter extends Router
{

    /**
     * @inheritDoc
     */
    public function init()
    {
        if ($this->request->isBlock()) {
            $this->defaultRoute = new Route('*', BlockController::class, 'index');
        } else {
            $this->defaultRoute = new Route('*', WebController::class, 'index');
        }
    }
}