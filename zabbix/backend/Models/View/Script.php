<?php


namespace IMapify\Models\View;

/**
 * Class Script
 * @package IMapify\Components\View
 */
class Script extends File
{
    /**
     * @var string
     */
    private $jsCode;

    /**
     * Script constructor.
     * @param string $jsCode
     * @param array $params
     */
    public function __construct(string $jsCode, array $params = [])
    {
        parent::__construct($params);
        $this->jsCode = $jsCode;
    }

    /**
     * Build <script> tag.
     * @return string
     */
    public function __toString()
    {
        /** @noinspection HtmlUnknownAttribute */
        return sprintf('<script %s>%s</script>', static::prepareParams($this->params), $this->jsCode);
    }

    /**
     * @param array $params
     * @return string
     */
    protected static function prepareParams(array $params): string
    {
        if (!isset($params['type'])) {
            $params['type'] = 'text/javascript';
        }

        return parent::prepareParams($params);
    }
}