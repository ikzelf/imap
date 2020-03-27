<?php

define('ZBX_ACK_STS_ANY', 1);

bindtextdomain('imapify', 'locale');
bind_textdomain_codeset('imapify', 'UTF-8');

spl_autoload_register(static function ($class) {
    if (preg_match('/^IMapify\\\\(.*)$/i', $class, $matches)) {
        $filePath = implode(DIRECTORY_SEPARATOR, [
            __DIR__,
            'backend',
            str_replace('\\', DIRECTORY_SEPARATOR, $matches[1]) . '.php',
        ]);

        if (file_exists($filePath)) {
            /** @noinspection PhpIncludeInspection */
            require_once $filePath;
        }
    }
});


$fields = [
    'groupid' => [T_ZBX_INT, O_OPT, P_SYS, DB_ID, null],
    'hostid' => [T_ZBX_INT, O_OPT, P_SYS, DB_ID, null],
    'thostid' => [T_ZBX_INT, O_OPT, P_SYS, DB_ID, null],
    'linkid' => [T_ZBX_INT, O_OPT, P_SYS, DB_ID, null],
    'severity_min' => [T_ZBX_INT, O_OPT, P_SYS, IN('0,1,2,3,4,5'), null],
    'fullscreen' => [T_ZBX_INT, O_OPT, P_SYS, IN('0,1'), null],
    'control_map' => [T_ZBX_INT, O_OPT, P_SYS, IN('0,1'), null],
    'with_triggers_only' => [T_ZBX_INT, O_OPT, P_SYS, IN('0,1'), null],

    'output' => [T_ZBX_STR, O_OPT, P_SYS, null, null],
    'jsscriptid' => [T_ZBX_STR, O_OPT, P_SYS, null, null],
    // ajax
    'favobj' => [T_ZBX_STR, O_OPT, P_ACT, null, null],
    'favref' => [T_ZBX_STR, O_OPT, P_ACT, null, null],
    'favid' => [T_ZBX_INT, O_OPT, P_ACT, null, null],
    'favcnt' => [T_ZBX_INT, O_OPT, null, null, null],
    'pmasterid' => [T_ZBX_STR, O_OPT, P_SYS, null, null],
    'favaction' => [T_ZBX_STR, O_OPT, P_ACT, IN("'add','remove','refresh','flop','sort'"), null],
    'favstate' => [T_ZBX_INT, O_OPT, P_ACT, NOT_EMPTY, 'isset({favaction})&&("flop"=={favaction})'],
    'favdata' => [T_ZBX_STR, O_OPT, null, null, null],
    'hardwareField' => [T_ZBX_STR, O_OPT, null, null, null],
    //стандартные
    'btnSelect' => [T_ZBX_STR, O_OPT, null, null, null],
    'filter_rst' => [T_ZBX_STR, O_OPT, P_SYS, null, null],
    'filter_set' => [T_ZBX_STR, O_OPT, P_SYS, null, null],
    'show_triggers' => [T_ZBX_INT, O_OPT, null, null, null],
    'show_events' => [T_ZBX_INT, O_OPT, P_SYS, null, null],
    'ack_status' => [T_ZBX_INT, O_OPT, P_SYS, null, null],
    'show_severity' => [T_ZBX_INT, O_OPT, P_SYS, null, null],
    'status_change_days' => [T_ZBX_INT, O_OPT, null, BETWEEN(1, DAY_IN_YEAR * 2), null],
    'status_change' => [T_ZBX_INT, O_OPT, null, null, null],
    'txt_select' => [T_ZBX_STR, O_OPT, null, null, null],
    'application' => [T_ZBX_STR, O_OPT, null, null, null],
    'inventory' => [T_ZBX_STR, O_OPT, null, null, null],

    'r' => [T_ZBX_STR, O_OPT, P_SYS, DB_ID, null],
    'query' => [T_ZBX_STR, O_OPT, P_SYS, null, null],
    'linkoptions' => [T_ARRAY, O_OPT, null, null, null],
];
check_fields($fields);