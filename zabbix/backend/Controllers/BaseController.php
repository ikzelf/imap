<?php


namespace IMapify\Controllers;

use IMapify\Components\Request\Request;
use IMapify\Components\Response\Response;
use IMapify\Components\View\BaseView;
use IMapify\Models\Route;
use RuntimeException;

/**
 * Class BaseController
 * @package IMapify\Controllers
 */
abstract class BaseController
{
    /**
     * @var Request
     */
    protected $request;

    /**
     * @var Route
     */
    protected $route;

    /**
     * @var BaseView
     */
    protected $view;

    /**
     * BaseController constructor.
     * @param Request $request
     * @param Route $route
     */
    public function __construct(Request $request, Route $route, BaseView $view)
    {
        $this->request = $request;
        $this->route = $route;
        $this->view = $view;
    }

    /**
     * @return Response
     */
    public function run(): Response
    {
        $methodName = 'action' . ucfirst($this->route->getAction());
        if (!method_exists($this, $methodName)) {
            throw new RuntimeException("Action {$this->route->getController()}:{$this->route->getName()} not found");
        }

        $this->beforeAction();

        $result = $this->$methodName();

        return $this->prepareResult($result);
    }

    /**
     * @return void
     */
    protected function beforeAction()
    {
    }

    /**
     * @param mixed $result
     * @return Response
     */
    abstract protected function prepareResult($result): Response;
}