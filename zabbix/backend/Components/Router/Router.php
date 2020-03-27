<?php


namespace IMapify\Components\Router;

use IMapify\Components\Request\Request;
use IMapify\Components\Response\Response;
use IMapify\Components\View\BaseView;
use IMapify\Config;
use IMapify\Controllers\BaseController;
use IMapify\Exceptions\BadRequestException;
use IMapify\Exceptions\NotFoundException;
use IMapify\Exceptions\RuntimeException;
use IMapify\Models\Route;

/**
 * Class Router
 * @package IMapify\Components\Router
 */
abstract class Router
{
    /**
     * @var Route[]
     */
    protected $routes = [];

    /**
     * @var Request
     */
    protected $request;
    /**
     * @var Config
     */
    protected $config;

    /**
     * @var Route|null
     */
    protected $defaultRoute;
    /**
     * @var BaseView
     */
    private $view;

    /**
     * Router constructor.
     * @param Request $request
     * @param Config $config
     * @param BaseView $view
     */
    public function __construct(Request $request, Config $config, BaseView $view)
    {
        $this->request = $request;
        $this->config = $config;
        $this->view = $view;
    }

    /**
     * Initialize router.
     *
     * @return $this
     */
    abstract public function init();

    /**
     * @param Route $route
     * @return $this
     */
    public function addRoute(Route $route): Router
    {
        $this->routes[$route->getName()] = $route;

        return $this;
    }

    /**
     * @return Response
     * @throws BadRequestException
     * @throws NotFoundException
     * @throws RuntimeException
     */
    public function handleRoute(): Response
    {
        $routeName = $this->request->getQueryParam('r');
        if ($routeName === null) {
            if ($this->defaultRoute === null) {
                throw new BadRequestException('Bad URL. Query param `r` required.');
            }

            $routeName = '*';
        }

        $route = $this->routes[$routeName] ?? null;
        if ($route === null) {
            if ($this->defaultRoute === null) {
                throw new NotFoundException(sprintf('Router `%s` not found', $routeName));
            }
            $route = $this->defaultRoute;
        }

        $controllerName = $route->getController();
        $controller = new $controllerName($this->request, $route, $this->view);

        if (!$controller instanceof BaseController) {
            throw new RuntimeException('Controller must be subclass of BaseController');
        }

        return $controller->run();
    }
}