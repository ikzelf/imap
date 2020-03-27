<?php
/** @var array $config */
/** @var array $page */
/** @var int $activeTab */
/** @var CPageFilter $pageFilter */

// TODO: enable filter
return;

/**
 * Filter
 */

use IMapify\Application;

// Display
//$displayNodes = (is_show_all_nodes() && $pageFilter->groupid == 0 && $pageFilter->hostid == 0);
// $showEvents = $_REQUEST['show_events'];
// $ackStatus = $_REQUEST['ack_status'];
// 	$triggerWidget = new CWidget();
//
// 	$rightForm = new CForm('get');
// 	$rightForm->addItem(array(_('Group').SPACE, $pageFilter->getGroupsCB(true)));
// 	$rightForm->addItem(array(SPACE._('Host').SPACE, $pageFilter->getHostsCB(true)));
// 	$severityComboBox = new CComboBox('severity_min', $showSeverity,'javascript: submit();');
// 	$severityComboBox->addItems($pageFilter->severitiesMin);
// 	$rightForm->addItem(array(SPACE._('Minimum trigger severity').SPACE, $severityComboBox));
//
// 	textdomain("imapify");
// 	$rightForm->addItem(array(SPACE.SPACE._('Control map').SPACE, new CCheckBox('control_map', $control_map, '_imap.settings.do_map_control = jQuery(\'#control_map\')[0].checked; if (_imap.settings.do_map_control) {mapBbox(_imap.bbox)};', 1)));
// 	$rightForm->addItem(array(SPACE.SPACE._('With triggers only').SPACE, new CCheckBox('with_triggers_only', $with_triggers_only, 'javascript: submit();', 1)));
// 	textdomain("frontend");
//
// 	$rightForm->addVar('fullscreen', $_REQUEST['fullscreen']);
//
// 	$triggerWidget->addHeader(SPACE,$rightForm);
// 	$triggerWidget->addPageHeader(_('Interactive map'), get_icon('fullscreen', array('fullscreen' => $_REQUEST['fullscreen'])));
//
// 	$triggerWidget->show();


/*
* Display
*/
$triggerWidget = (new CWidget())
    ->setTitle(Application::__i('Interactive map'))
    ->setWebLayoutMode($page['web_layout_mode']);

$rightForm = (new CForm('get'))->addVar('fullscreen', $filter['isFullscreen']);

$controls = new CList();
// TODO: enable this
//    $controls->addItem(array(SPACE . SPACE . _('With triggers only') . SPACE, new CCheckBox('with_triggers_only', $with_triggers_only, 'javascript: submit();', 1)));
//    $controls->addItem(array(SPACE . SPACE . _('Control map') . SPACE, new CCheckBox('control_map', $control_map, '_imap.settings.do_map_control = jQuery(\'#control_map\')[0].checked; if (_imap.settings.do_map_control) {mapBbox(_imap.bbox)};', 1)));
$controls->addItem([Application::__i('Group') . '&nbsp;', $pageFilter->getGroupsCB()]);
$controls->addItem([Application::__i('Host') . '&nbsp;', $pageFilter->getHostsCB()]);
$controls->addItem(get_icon('fullscreen', ['fullscreen' => $filter['isFullscreen']]));

$rightForm->addItem($controls);

$triggerWidget->setControls($rightForm);

// filter
$filterFormView = new CView('common.filter.trigger', [
    'overview' => false,
    'filter' => [
        'filterid' => 'web.tr_status.filter.state',
        'showTriggers' => $filter['showTriggers'],
        'ackStatus' => $filter['ackStatus'],
        'showEvents' => $filter['showEvents'],
        'showSeverity' => $filter['showSeverity'],
        'statusChange' => $filter['showChange'],
        'statusChangeDays' => $filter['statusChangeByDays'],
        'showDetails' => $filter['showDetails'],
        'txtSelect' => $filter['txtSelect'],
        'application' => $filter['application'],
        'inventory' => $filter['inventory'],
        'showMaintenance' => $filter['showMaintenance'],
        'hostId' => $filter['hostId'],
        'groupId' => $filter['groupId'],
        'fullScreen' => $filter['isFullscreen'],
        'show_suppressed' => $filter['showSuppressed'],
    ],
    'config' => $config,
    'profileIdx' => 'web.tr_status.filter',
    'active_tab' => $activeTab,
]);

// TODO: replace render by MVC
/** @noinspection PhpDeprecationInspection */
$filterForm = $filterFormView->render();
$triggerWidget->addItem($filterForm);
// filter end

$triggerWidget->show();

