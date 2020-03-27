<?php

use IMapify\Controllers\Ajax\GraphController;
use IMapify\Controllers\Ajax\HardwareController;
use IMapify\Controllers\Ajax\HostController;
use IMapify\Controllers\Ajax\LinkController;
use IMapify\Controllers\Ajax\TriggerController;

return [
    'ajax/hosts/view' => [HostController::class, 'view'],
    'ajax/hosts/update-location' => [HostController::class, 'updateLocation'],
    'ajax/hosts/search' => [HostController::class, 'search'],
    'ajax/hosts' => [HostController::class, 'index'],
    'ajax/triggers' => [TriggerController::class, 'index'],
    'ajax/links/view' => [LinkController::class, 'view'],
    'ajax/links/update' => [LinkController::class, 'update'],
    'ajax/links/delete' => [LinkController::class, 'delete'],
    'ajax/links/create' => [LinkController::class, 'create'],
    'ajax/links' => [LinkController::class, 'index'],
    'ajax/graph' => [GraphController::class, 'index'],
    'ajax/hardware' => [HardwareController::class, 'index'],
    'ajax/hardware/update' => [HardwareController::class, 'update'],
];

