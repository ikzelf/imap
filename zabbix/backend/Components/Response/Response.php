<?php


namespace IMapify\Components\Response;

use Exception;

/**
 * Class Response
 * @package IMapify\Components
 */
abstract class Response
{
    /**
     * @var mixed
     */
    public $result;

    /**
     * Response constructor.
     * @param $result
     */
    public function __construct($result)
    {
        $this->result = $result;
    }

    /**
     * @return string
     * @throws Exception
     */
    public function doResponse(): string
    {
        if (is_string($this->result)) {
            return $this->result;
        }
        throw new Exception('Invalid response');
    }
}