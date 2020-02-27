<?php


namespace Imap\Components;

/**
 * Class Response
 * @package Imap\Components
 */
abstract class Response
{
    protected $result;

    /**
     * Response constructor.
     * @param $result
     */
    public function __construct($result)
    {
        $this->result = $result;
    }

    /**
     * @return mixed
     */
    abstract public function response();
}