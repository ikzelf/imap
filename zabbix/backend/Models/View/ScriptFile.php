<?php


namespace IMapify\Models\View;

/**
 * Class ScriptFile
 * @package IMapify\Components\View
 */
class ScriptFile extends URLFile
{
    /**
     * Build <script> tag.
     * @return string
     */
    public function __toString()
    {
        /** @noinspection HtmlUnknownTarget */
        /** @noinspection HtmlUnknownAttribute */
        return sprintf('<script src="%s" %s></script>', $this->url, static::prepareParams($this->params));
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