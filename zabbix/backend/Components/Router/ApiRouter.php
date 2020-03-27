<?php


namespace IMapify\Components\Router;

use IMapify\Models\Route;

/**
 * Class ApiRouter
 * @package IMapify\Components
 */
class ApiRouter extends Router
{
    /**
     * Initialize router.
     * @return $this
     */
    public function init()
    {
        $routeList = include $this->config->getIMapPath() . '/config/api-route.php';
        foreach ($routeList as $route => $handler) {
            list($controller, $action) = $handler;
            $this->addRoute(new Route($route, $controller, $action));
        }

//        ->addRoute(new Router('ajax/hosts/view', HostController::class, 'view'))
//        ->addRoute(new Router('ajax/hosts/update-location', HostController::class, 'updateLocation'))
//        ->addRoute(new Router('ajax/hosts/search', HostController::class, 'search'))
//        ->addRoute(new Router('ajax/hosts', HostController::class, 'index'))
//        ->addRoute(new Router('ajax/triggers', TriggerController::class, 'index'))
//        ->addRoute(new Router('ajax/links/view', LinkController::class, 'view'))
//        ->addRoute(new Router('ajax/links/update', LinkController::class, 'update'))
//        ->addRoute(new Router('ajax/links/delete', LinkController::class, 'delete'))
//        ->addRoute(new Router('ajax/links/create', LinkController::class, 'create'))
//        ->addRoute(new Router('ajax/links', LinkController::class, 'index'))
//        ->addRoute(new Router('ajax/graph', GraphController::class, 'index'))
//        ->addRoute(new Router('ajax/hardware', HardwareController::class, 'index'))
//        ->addRoute(new Router('ajax/hardware/update', HardwareController::class, 'update'));

        return $this;
    }


}