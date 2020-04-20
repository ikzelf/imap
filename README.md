# !
Zabbix 4.4.6, PHP 7.3

Написано ради фана, в большинстве своем недоработано, но основные функции работают на Zabbix 4.4.5.

## TODO:
### Frontend
1. GoogleStreetView - доработка и тестирование (GoogleStreetViewService)
2. OpenWeatherMap - рефакторинг, доработка 


### Backend
1. Написать API для выборки линков \Imap\Components\Api\Link

### Возможные пути развития
1. Миграция фронта на Vue.js
2. Миграция бекенда на микрофрейм, либо адаптация под Zabbix API




# imap

## Interactive map for Zabbix

This version is patched for Zabbix versions 4.0.

## Installation

Tested on Debian 8 (Jessie):

* Clone the repository to `/usr/local/share/zabbix-interactive-map-19730/imap/` on the zabbix server. 

* Link `imap` and `imap.php`:

```
cd /usr/share/zabbix
sudo ln -s ../../local/share/zabbix-interactive-map-19730/imap/zabbix/imap .
sudo ln -s ../../local/share/zabbix-interactive-map-19730/imap/zabbix/imap.php .
```

* Add the menu entry "Monitoring -> Interactive Map" to your zabbix installation by adding this line just before "$denied_page_requested = false;" (~line 308) in `/usr/share/zabbix/include/menu.inc.php`:

```
304                                 ]
305                         ]
306                 ]
307         ];
308         require_once dirname(__FILE__).'/../imap/menu3.inc.php'; # added for Interactive Map
309
310         $denied_page_requested = false;
311         $page_exists = false;
```

For additional settings, locate file settings.js.template in the folder imap, rename it in settings.js and change settings to your liking.

To get an API key for Bing you need to get a Microsoft account and create a new key. Look it for details: http://msdn.microsoft.com/ru-ru/library/ff428642.aspx

For work hardware icons, put png-images in folder imap/hardware. Look at file imap/hardware/readme.md for details.

## BD-additions

For working host's links, we need to add two tables in the database Zabbix.

Look at file imap/tables-xxx.sql

### For MySQL:

You can open phpmyadmin, select the database Zabbix, and select this file in the Import section

The second way for fans of the command line:

`mysql -u user -p zabbixbd < /usr/share/zabbix/imap/tables-mysql.sql`

Replace zabbixbd the name of the table with the data zabbix, username for a user with the addition of tables in the database and enter the password.

### For PostgreSQL 

run under root:

`sudo -u zabbix psql -U zabbix -W -d zabbix < tables-postgresql.sql`

where

sudo -u zabbix - act as system user 'zabbix' (otherwise PosgreSQL will not authenticate user),

-U zabbix - database owner,

-d zabbix - database name.

Current status:
Works when hosts have their locations set in the inventory (latitude & longitude)
location can be changed using the map.

Undefined index: profileIdx [imap.php:592 ? CView->render() ? include() in include/views/common.filter.trigger.php:28]
Undefined index: active_tab [imap.php:592 ? CView->render() ? include() in include/views/common.filter.trigger.php:29]
Undefined index: ackStatus [imap.php:592 ? CView->render() ? include() in include/views/common.filter.trigger.php:126]
Undefined index: show_suppressed [imap.php:592 ? CView->render() ? include() in include/views/common.filter.trigger.php:130]
