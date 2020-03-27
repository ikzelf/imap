<?php


namespace IMapify\Models\View;

/**
 * Class StyleFile
 * @package IMapify\Components\View
 */
class StyleFile extends URLFile
{
    /**
     * Build <script> tag.
     * @return string
     */
    public function __toString()
    {
        /** @noinspection HtmlUnknownAttribute */
        return sprintf('<link href="%s" %s />', $this->url, static::prepareParams($this->params));
    }

    /**
     * @param array $params
     * @return string
     */
    protected static function prepareParams(array $params): string
    {
        if (!isset($params['rel'])) {
            $params['rel'] = 'stylesheet';
        }

        return parent::prepareParams($params);
    }
}