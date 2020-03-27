<?php


namespace IMapify\Models\View;

/**
 * Class File
 * @package IMapify\Components\View
 */
abstract class File
{
    /**
     * @var array
     */
    protected $params = [];

    /**
     * File constructor.
     * @param array $params
     */
    public function __construct(array $params = [])
    {
        $this->params = $params;
    }

    /**
     * @param array $params
     * @return string
     */
    protected static function prepareParams(array $params): string
    {
        $result = [];
        foreach ($params as $key => $param) {
            if (is_numeric($key)) {
                $result[] = $param;
            } else {
                $result[] = "$key=\"$param\"";
            }
        }
        return implode(' ', $result);
    }

}