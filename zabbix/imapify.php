<?php

use IMapify\Application;
use IMapify\Config;

$iMapifyPath = __DIR__;
$zabbixPath = realpath('./');

// Relative by symlink
require_once $zabbixPath . '/include/config.inc.php';
require_once $iMapifyPath . '/bootstrap.php';

$config = (new Config())
    ->setZabbixPath($zabbixPath)
    ->setIMapifyPath($iMapifyPath);

Application::init($config)->run();
