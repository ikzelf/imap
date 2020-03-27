<?php


namespace IMapify\Components\View;

use CView;
use IMapify\Application;
use IMapify\Components\Request\Request;
use IMapify\Components\Response\Response;
use IMapify\Config;
use IMapify\Exceptions\RenderException;
use IMapify\Models\View\Script;
use IMapify\Models\View\ScriptFile;
use IMapify\Models\View\StyleFile;
use Throwable;

/**
 * Class View
 * @package IMapify\Components
 */
abstract class BaseView
{
    /**
     * @var Config
     */
    protected $config;

    /**
     * @var array
     */
    protected $styles = [];

    /**
     * @var array
     */
    protected $scripts = [];

    /**
     * View constructor.
     * @param Config $config
     */
    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    /**
     * Generate page attribute.
     */
    public static function generateZabbixPageData()
    {
        global $page;
        $page['title'] = Application::__i('Interactive map');
        $page['file'] = 'imapify.php';
        $page['hist_arg'] = ['groupid', 'hostid', 'show_severity', 'control_map', 'with_triggers_only'];
        $page['web_layout_mode'] = CView::getLayoutMode();
    }

    /**
     * Create view instance by request output.
     *
     * @param Request $request
     * @param Config $config
     * @return BaseView
     */
    public static function create(Request $request, Config $config)
    {
        $output = $request->getQueryParam('output');
        switch ($output) {
            case 'ajax':
                return new AjaxView($config);
            case 'block':
            default:
                return new WebView($config);
        }
    }

    /**
     * @param Response $response
     * @throws Throwable
     */
    public function flush(Response $response)
    {
        if ($response->result instanceof Throwable) {
            $this->renderException($response->result);
        } else {
            echo $response->doResponse();
        }
    }

    /**
     * @param Throwable $result
     * @return void
     */
    abstract protected function renderException(Throwable $result);

    /**
     * @param string $string
     * @param array $params
     * @return string
     * @throws RenderException
     */
    public function render(string $string, array $params = []): string
    {
        /** @noinspection PhpUnusedLocalVariableInspection */
        global $page;

        $filePath = realpath($this->config->getIMapPath() . '/backend/views/' . $string . '.php');
        if (!$filePath) {
            throw new RenderException(sprintf('File %s not found', $string));
        }

        ob_start();
        extract($params);

        /** @noinspection PhpIncludeInspection */
        include $filePath;

        return ob_get_clean();
    }

    /**
     * Register css file.
     *
     * @param string $url
     * @return BaseView
     */
    public function registerStyleFile(string $url): BaseView
    {
        $this->styles[] = new StyleFile($url);

        return $this;
    }

    /**
     * Register JS file.
     *
     * @param string $string
     * @param array $params
     * @return BaseView
     */
    public function registerScriptFile(string $string, array $params = []): BaseView
    {
        $this->scripts[] = new ScriptFile($string, $params);

        return $this;
    }

    /**
     * @param string $apiAuthKey
     */
    public function registerApiKey(string $apiAuthKey)
    {
        $this->registerScript('window._imapify_token=' . json_encode($apiAuthKey));
    }

    /**
     * Register plain JS code.
     *
     * @param string $js
     * @return BaseView
     */
    public function registerScript(string $js): BaseView
    {
        $this->scripts[] = new Script($js);

        return $this;
    }

}