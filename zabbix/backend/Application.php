<?php

namespace IMapify;


use IMapify\Components\Request\Request;
use IMapify\Components\View\BaseView;

/**
 * Class Application
 * @package IMapify
 */
abstract class Application
{
    const I_MAP_TEXT_DOMAIN = 'imapify';
    const FRONTEND_TEXT_DOMAIN = 'frontend';

    /**
     * @var Application
     */
    public static $app;
    /**
     * @var Request
     */
    public $request;
    /**
     * @var BaseView
     */
    protected $view;
    /**
     * @var Config
     */
    protected $config;

    /**
     * Application constructor.
     * @param Request $request
     * @param Config $config
     */
    public function __construct(Request $request, Config $config)
    {
        $this->config = $config;
        $this->request = $request;
        $this->view = BaseView::create($request, $config);

        //TODO: проверяем наличие функции json_encode
        if (!function_exists('json_encode')) {
            error("No function 'json_encode' in PHP. Look this http://stackoverflow.com/questions/18239405/php-fatal-error-call-to-undefined-function-json-decode");
        }
    }

    /**
     * Internalization (iMap domain)
     * @param string $message
     * @return string
     */
    public static function __i(string $message): string
    {
        return self::__($message, self::I_MAP_TEXT_DOMAIN);
    }

    /**
     * Internalization.
     *
     * @param string $message
     * @param string $domain
     * @return string
     */
    public static function __(string $message, string $domain = self::FRONTEND_TEXT_DOMAIN)
    {
        if ($domain !== self::FRONTEND_TEXT_DOMAIN) {
            textdomain($domain);
        }

        $result = _($message);

        if ($domain !== self::FRONTEND_TEXT_DOMAIN) {
            textdomain(self::FRONTEND_TEXT_DOMAIN);
        }

        return $result;
    }

    /**
     * Initialize application
     * @param Config $config
     * @return Application
     */
    public static function init(Config $config)
    {
        if (static::$app === null) {
            $request = new Request();
            if ($request->isAjax()) {
                $application = new AjaxApplication($request, $config);
            } else {
                $application = new WebApplication($request, $config);
            }

            static::$app = $application;

            BaseView::generateZabbixPageData();
        }
        return static::$app;
    }

    /**
     * Run application.
     */
    abstract public function run();

    /**
     * Exit from application.
     */
    public function end()
    {
        exit;
    }

    /**
     * @return string
     */
    public function getIMapPath()
    {
        return $this->config->getIMapPath();
    }
}