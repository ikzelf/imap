<?php


namespace Imap\Controllers\Ajax;


use API;
use Imap\Components\AjaxResponse;
use Imap\Components\PageFilterBuilder;
use Imap\Components\Response;
use Imap\Controllers\BaseController;

/**
 * Class BaseAjaxController
 * @package Imap\Controllers\Ajax
 */
abstract class BaseAjaxController extends BaseController
{
    /**
     * @return array
     */
    protected function getBaseOptions(): array
    {
        $options = [
            'output' => API_OUTPUT_EXTEND,
            'expandDescription' => true,
            'preservekeys' => true,
            'monitored' => true
        ];

        $pageFilter = PageFilterBuilder::getInstance($this->request)->getFilter();
        if ($pageFilter->hostsSelected) {
            if ($pageFilter->hostid > 0) {
                $options['hostids'] = $pageFilter->hostid;
            } elseif ($pageFilter->groupid > 0) {
                $options['groupids'] = $pageFilter->groupid;
            }
        } else {
            $options['hostids'] = [];
        }


        return $options;
    }


    /**
     * @param mixed $result
     * @return Response
     */
    protected function prepareResult($result): Response
    {
        return new AjaxResponse($result);
    }


    /**
     * @param $hostsIds
     * @return bool
     */
    protected function checkHostsIsWritable($hostsIds): bool
    {
        $hosts = API::Host()->get(['editable' => true, 'hostids' => $hostsIds]);
        return count($hosts) === count($hostsIds);
    }

    /**
     * @return array
     */
    protected function accessError(): array
    {
        return [
            'jsonrpc' => '2.0',
            'error' => ['message' => 'Access error. Check rights.'],
        ];
    }
}