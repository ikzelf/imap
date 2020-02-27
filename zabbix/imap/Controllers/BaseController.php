<?php


namespace Imap\Controllers;

use Imap\Components\Request;
use Imap\Components\Response;
use Imap\Components\Route;
use RuntimeException;

/**
 * Class BaseController
 * @package Imap\Controllers
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

    public function __construct(Request $request, Route $route)
    {
        $this->request = $request;
        $this->route = $route;
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