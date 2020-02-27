<?php


namespace Imap\Components;

/**
 * Class AjaxResponse
 * @package Imap\Components
 */
class AjaxResponse extends Response
{
    /**
     * AjaxResponse constructor.
     * @param $result
     */
    public function __construct($result)
    {
        parent::__construct($result);

        if (!function_exists('json_encode')) {
            $responseData = '{"jsonrpc": "2.0","error": {"message": "No function `json_encode` in PHP. Look at <a target=_blank href=\'http://stackoverflow.com/questions/18239405/php-fatal-error-call-to-undefined-function-json-decode\'>link</a>"}}';
            echo $responseData;
            exit;
        }
    }


    /**
     * @return mixed
     */
    public function response()
    {
        echo json_encode($this->result, FALSE);
        exit();
    }
}