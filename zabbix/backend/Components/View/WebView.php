<?php


namespace IMapify\Components\View;

use Throwable;

/**
 * Class WebView
 * @package Imap\Components\View
 */
class WebView extends BaseView
{
    /**
     * @inheritDoc
     */
    protected function renderException(Throwable $result)
    {
        fatal_error($result->getMessage());
    }
}