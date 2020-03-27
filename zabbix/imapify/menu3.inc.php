<?php
bindtextdomain('imapify', 'locale');
bind_textdomain_codeset('imapify', 'UTF-8');
textdomain('imapify');
$zbx_menu['view']['pages'][] = [
    'url' => 'imapify.php',
    'label' => _('Interactive map')
];

textdomain('frontend');

if (function_exists('get_request')) {
    $_REQUEST['ispopup'] = get_request('ispopup', 0);
}

if (function_exists('getRequest')) {
    $_REQUEST['ispopup'] = getRequest('ispopup', 0);
}

if ($_REQUEST['ispopup'] === '1') {
    define('ZBX_PAGE_NO_MENU', true);
    define('ZBX_PAGE_NO_HEADER', true);
    //define('ZBX_PAGE_NO_THEME', true);
}
