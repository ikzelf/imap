<?php


namespace Imap\Controllers\Ajax;

use API;

/**
 * Class GraphController
 * @package Imap\Controllers\Ajax
 */
class GraphController extends BaseAjaxController
{
    /**
     * @return array
     */
    public function actionIndex(): array
    {
        $options['expandName'] = true;
        return API::Graph()->get($options);
    }

}