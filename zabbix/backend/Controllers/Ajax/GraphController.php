<?php


namespace IMapify\Controllers\Ajax;

use API;

/**
 * Class GraphController
 * @package IMapify\Controllers\Ajax
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