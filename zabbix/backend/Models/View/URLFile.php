<?php


namespace IMapify\Models\View;

/**
 * Class URLFile
 * @package IMapify\Components\View
 */
class URLFile extends File
{
    /**
     * @var string
     */
    protected $url;

    /**
     * ScriptFile constructor.
     * @param string $url
     * @param array $params
     */
    public function __construct(string $url, array $params = [])
    {
        parent::__construct($params);

        $this->url = $url;
    }

}