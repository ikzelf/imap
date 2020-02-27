<?php


namespace Imap\Components;

use Exception;
use Imap\Controllers\BaseController;
use RuntimeException;

/**
 * Class Router
 * @package Imap\Components
 */
class Router
{
    /**
     * @var Route[]
     */
    private $routes = [];

    /**
     * @var Request
     */
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @param Route $route
     * @return Router
     */
    public function addRoute(Route $route): Router
    {
        $this->routes[$route->getName()] = $route;

        return $this;
    }

    /**
     * @return bool
     * @throws Exception
     */
    public function handleRoute(): bool
    {
        $routeName = $this->request->getQueryParam('r');
        if ($routeName === null) {
            return false;
        }

        $route = $this->routes[$routeName] ?? null;
        if ($route === null) {
            // TODO: найти подходящее исключение
            invalid_url('Route not found');
        }


        $controllerName = $route->getController();
        $controller = new $controllerName($this->request, $route);

        if (!$controller instanceof BaseController) {
            throw new RuntimeException('Controller must be subclass of BaseController');
        }

        $response = $controller->run();

        $response->response();

        return true;
    }


}