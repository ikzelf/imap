<?php


namespace IMapify;

/**
 * Class Config - Application config
 *
 * @package IMapify
 */
class Config
{
    /**
     * Zabbix absolute path.
     *
     * @var string
     */
    private $zabbixPath;

    /**
     * iMap absolute path.
     *
     * @var string
     */
    private $iMapPath;

    /**
     * @return string
     */
    public function getZabbixPath(): string
    {
        return $this->zabbixPath;
    }

    /**
     * @param string $zabbixPath
     * @return Config
     */
    public function setZabbixPath(string $zabbixPath): Config
    {
        $this->zabbixPath = $zabbixPath;
        return $this;
    }

    /**
     * @return string
     */
    public function getIMapPath(): string
    {
        return $this->iMapPath;
    }

    /**
     * @param string $iMapPath
     * @return Config
     */
    public function setIMapifyPath(string $iMapPath): Config
    {
        $this->iMapPath = $iMapPath;
        return $this;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return sprintf('zabbix path: %s, iMap path: %s', $this->getZabbixPath(), $this->getIMapPath());
    }
}