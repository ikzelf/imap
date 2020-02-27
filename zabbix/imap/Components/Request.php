<?php


namespace Imap\Components;

/**
 * Class Request
 * @package Imap\Components
 */
class Request
{
    const REQUEST_FUNCTION_NAME_OLD = 'get_request';
    const REQUEST_FUNCTION_NAME_NEW = 'getRequest';

    private $requestFunction;

    private $rawBody;

    /**
     * Request constructor.
     */
    public function __construct()
    {
        if (function_exists(static::REQUEST_FUNCTION_NAME_OLD)) {
            $this->requestFunction = static::REQUEST_FUNCTION_NAME_OLD;
        } else if (function_exists(static::REQUEST_FUNCTION_NAME_NEW)) {
            $this->requestFunction = static::REQUEST_FUNCTION_NAME_NEW;
        } else {
            $this->requestFunction = [$this, 'getRequest'];
        }
    }


    /**
     * @param string $key
     * @param null $default
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        return call_user_func($this->requestFunction, $key, $default);
    }

    /**
     * @param string $key
     * @param null $default
     * @return mixed|null
     */
    public function getQueryParam(string $key, $default = null)
    {
        return $_GET[$key] ?? $default;
    }

    /**
     * @param string $key
     * @param null $default
     * @return mixed
     */
    public function getBodyParam(string $key, $default = null)
    {
        return $this->getBodyParams()[$key];
    }

    /**
     * @return array
     */
    public function getBodyParams(): array
    {
        $contentType = $this->getContentType();
        if ($contentType && strpos($contentType, 'application/json;') === 0) {
            return json_decode($this->getRawBody(), true);
        }

        return $_POST;
    }

    public function getContentType()
    {
        return $_SERVER['CONTENT_TYPE'] ?? getallheaders()['content-type'] ?? null;
    }

    /**
     * @return false|string
     */
    public function getRawBody()
    {
        if ($this->rawBody === null) {
            $this->rawBody = file_get_contents('php://input');
        }

        return $this->rawBody;
    }

    /**
     * @param string $name
     * @param null $default
     * @return bool|null
     */
    protected function getRequest(string $name, $default = null)
    {
        return isset($_REQUEST[$name]) ?? $default;

    }
}