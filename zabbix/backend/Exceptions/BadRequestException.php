<?php


namespace IMapify\Exceptions;


use Throwable;

/**
 * Class BadRequestException
 * @package IMapify\Exceptions
 */
class BadRequestException extends HttpException
{
    /**
     * BadRequestException constructor.
     * @param string $message
     * @param int $code
     * @param Throwable|null $previous
     */
    public function __construct($message = "", $code = 400, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}