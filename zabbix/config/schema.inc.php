<?php
return [
    'hosts_links' => [
        'key' => 'host1,host2',
        'fields' => [
            'id' => [
                'null' => false,
                'type' => DB::FIELD_TYPE_INT,
                'length' => 10,
            ],
            'name' => [
                'null' => true,
                'type' => DB::FIELD_TYPE_CHAR,
                'length' => 255,
                'default' => '',
            ],
            'host1' => [
                'null' => false,
                'type' => DB::FIELD_TYPE_INT,
                'length' => 10,
            ],
            'host2' => [
                'null' => false,
                'type' => DB::FIELD_TYPE_INT,
                'length' => 10,
            ],
        ],
    ],
    'hosts_links_settings' => [
        'key' => 'host1,host2',
        'fields' => [
            'ids' => [
                'null' => false,
                'type' => DB::FIELD_TYPE_INT,
                'length' => 10,
            ],
            'color' => [
                'null' => true,
                'type' => DB::FIELD_TYPE_CHAR,
                'length' => 30,
            ],
            'weight' => [
                'null' => true,
                'type' => DB::FIELD_TYPE_INT,
                'length' => 10,
            ],
            'opacity' => [
                'null' => true,
                'type' => DB::FIELD_TYPE_INT,
                'length' => 10,
            ],
            'dash' => [
                'null' => true,
                'type' => DB::FIELD_TYPE_CHAR,
                'length' => 100,
            ],
        ],
    ],
];
