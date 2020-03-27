<?php

use IMapify\Components\View\WebView;

/** @var WebView $this */
/** @var array $config */
/** @var array $page */
/** @var int $activeTab */
/** @var CPageFilter $pageFilter */
/** @var array $params */

require_once $this->config->getZabbixPath() . '/include/page_header.php';

echo $this->render('filter', $params);

echo $this->render('map');

foreach ($this->styles as $style) {
    echo $style;
}

foreach ($this->scripts as $script) {
    echo $script;
}

require_once $this->config->getZabbixPath() . '/include/page_footer.php';
