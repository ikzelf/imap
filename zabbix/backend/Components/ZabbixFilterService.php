<?php


namespace IMapify\Components;

use CProfile;
use IMapify\Components\Request\Request;

/**
 * Class ZabbixFilterService
 * @package IMapify\Components
 */
class ZabbixFilterService
{
    const FILTER_SET_PARAM = 'filter_set';
    const FILTER_RESET_PARAM = 'filter_rst';

    /**
     * Init zabbix filter
     * @param Request $request
     */
    public static function prepareZabbixFilter(Request $request)
    {
        if ($request->getQueryParam(self::FILTER_SET_PARAM) !== null) {
            self::setFilter($request);
        } else if ($request->getQueryParam(self::FILTER_RESET_PARAM)) {
            self::resetFilter();
        }
    }

    /**
     * Set zabbix filter
     * @param Request $request
     */
    private static function setFilter(Request $request)
    {
        CProfile::update('web.tr_status.filter.show_details', $request->getQueryParam('show_details', 0), PROFILE_TYPE_INT);
        CProfile::update('web.tr_status.filter.show_maintenance', $request->getQueryParam('show_maintenance', 0), PROFILE_TYPE_INT);
        CProfile::update('web.tr_status.filter.show_severity',
            $request->getQueryParam('show_severity', TRIGGER_SEVERITY_NOT_CLASSIFIED), PROFILE_TYPE_INT
        );
        CProfile::update('web.tr_status.filter.txt_select', $request->getQueryParam('txt_select', ''), PROFILE_TYPE_STR);
        CProfile::update('web.tr_status.filter.status_change', $request->getQueryParam('status_change', 0), PROFILE_TYPE_INT);
        CProfile::update('web.tr_status.filter.status_change_days', $request->getQueryParam('status_change_days', 14),
            PROFILE_TYPE_INT
        );
        CProfile::update('web.tr_status.filter.application', $request->getQueryParam('application'), PROFILE_TYPE_STR);

        // show triggers
        // when this filter is set to "All" it must not be remembered in the profiles because it may render the
        // whole page inaccessible on large installations.
        if ((int)$request->getQueryParam('show_triggers') !== TRIGGERS_OPTION_ALL) {
            CProfile::update('web.tr_status.filter.show_triggers', $request->getQueryParam('show_triggers'), PROFILE_TYPE_INT);
        }

        // TODO: show events
        // $showEvents = getRequest('show_events', EVENTS_OPTION_NOEVENT);
//    if ($config['event_ack_enable'] == 0 || $showEvents != EVENTS_OPTION_NOT_ACK) {
//        CProfile::update('web.tr_status.filter.show_events', $showEvents, PROFILE_TYPE_INT);
//    }

        // TODO: ack status
//    if ($config['event_ack_enable'] == EVENT_ACK_ENABLED) {
//        CProfile::update('web.tr_status.filter.ack_status', getRequest('ack_status', ZBX_ACK_STS_ANY), PROFILE_TYPE_INT);
//    }

        // update host inventory filter
        $inventoryFields = [];
        $inventoryValues = [];
        foreach ($request->getQueryParam('inventory', []) as $field) {
            if ($field['value'] === '') {
                continue;
            }

            $inventoryFields[] = $field['field'];
            $inventoryValues[] = $field['value'];
        }
        CProfile::updateArray('web.tr_status.filter.inventory.field', $inventoryFields, PROFILE_TYPE_STR);
        CProfile::updateArray('web.tr_status.filter.inventory.value', $inventoryValues, PROFILE_TYPE_STR);
    }


    /**
     * Reset zabbix filter
     */
    private static function resetFilter()
    {
        DBStart();
        CProfile::delete('web.tr_status.filter.show_triggers');
        CProfile::delete('web.tr_status.filter.show_details');
        CProfile::delete('web.tr_status.filter.show_maintenance');
        CProfile::delete('web.tr_status.filter.show_events');
        CProfile::delete('web.tr_status.filter.ack_status');
        CProfile::delete('web.tr_status.filter.show_severity');
        CProfile::delete('web.tr_status.filter.txt_select');
        CProfile::delete('web.tr_status.filter.status_change');
        CProfile::delete('web.tr_status.filter.status_change_days');
        CProfile::delete('web.tr_status.filter.application');
        CProfile::deleteIdx('web.tr_status.filter.inventory.field');
        CProfile::deleteIdx('web.tr_status.filter.inventory.value');
        DBend();
    }
}