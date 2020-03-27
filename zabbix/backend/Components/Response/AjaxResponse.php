<?php


namespace IMapify\Components\Response;

/**
 * Class AjaxResponse
 * @package IMapify\Components
 */
class AjaxResponse extends Response
{
    /**
     * @return string
     */
    public function doResponse(): string
    {
        return json_encode($this->result);
    }
}