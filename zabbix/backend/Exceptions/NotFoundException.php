<?php


namespace IMapify\Exceptions;


use Throwable;

/**
 * Class NotFoundException
 * @package IMapify\Exceptions
 */
class NotFoundException extends HttpException
{
    /**
     * NotFoundException constructor.
     * @param string $message
     * @param int $code
     * @param Throwable|null $previous
     */
    public function __construct($message = "", $code = 404, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

}