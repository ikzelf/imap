<?php


namespace IMapify\Components\View;

use Throwable;

/**
 * Class AjaxView
 * @package IMapify\Components
 */
class AjaxView extends BaseView
{
    /**
     * @param Throwable $result
     * @throws Throwable
     */
    protected function renderException(Throwable $result)
    {
        throw $result;
    }
}