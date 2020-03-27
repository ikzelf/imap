<?php


namespace IMapify\Components;


use CPageFilter;
use IMapify\Components\Request\Request;

/**
 * Class PageFilterBuilder
 * @package IMapify\Components
 */
class PageFilterBuilder
{
    /**
     * @var PageFilterBuilder
     */
    private static $instance;

    /**
     * @var Request
     */
    private $request;
    /**
     * @var CPageFilter
     */
    private $filter;

    /**
     * PageFilterBuilder constructor.
     * @param Request $request
     */
    private function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @param Request $request
     * @return PageFilterBuilder
     */
    public static function getInstance(Request $request): PageFilterBuilder
    {
        if (static::$instance === null) {
            static::$instance = new PageFilterBuilder($request);
        }

        return static::$instance;
    }

    /**
     * @return CPageFilter
     */
    public function getFilter(): CPageFilter
    {
        if ($this->filter === null) {
            $options = [
                'config' => [
                    'select_latest' => false,
                ],
                'groups' => [
                    'monitored_hosts' => true
                ],
                'hosts' => [
                    'monitored_hosts' => true,
                    'withInventory' => true
                ],
                'hostid' => $this->request->get('hostid', 0),
                'groupid' => $this->request->get('groupid', 0),
            ];

            $this->filter = new CPageFilter($options);
        }

        return $this->filter;
    }

}