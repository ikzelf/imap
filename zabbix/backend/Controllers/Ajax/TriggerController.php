<?php


namespace IMapify\Controllers\Ajax;

use API;
use CProfile;

/**
 * Class TriggerController
 * @package IMapify\Controllers\Ajax
 */
class TriggerController extends BaseAjaxController
{
    /**
     * @return array|int
     */
    public function actionIndex()
    {
        $showSeverity = CProfile::get('web.tr_status.filter.show_severity', TRIGGER_SEVERITY_NOT_CLASSIFIED);

        $options = $this->getBaseOptions();

        $options['expandData'] = true;
        $options['expandDescription'] = true;
        $options['selectLastEvent'] = 'extend';
        $options['monitored'] = true;
        $options['maintenance'] = false;
        $options['skipDependent'] = true;
        $options['sortfield'] = array('lastchange');
        $options['sortorder'] = 'DESC';
        $options['filter'] = array('value' => TRIGGER_VALUE_TRUE);
        $options['selectHosts'] = array('hostid', 'name');

        if ($showSeverity > TRIGGER_SEVERITY_NOT_CLASSIFIED) {
            $options['min_severity'] = $showSeverity;
        }

        return API::Trigger()->get($options);
    }
}