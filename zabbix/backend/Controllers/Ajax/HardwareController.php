<?php


namespace IMapify\Controllers\Ajax;

use API;

/**
 * Class HardwareController
 * @package IMapify\Controllers\Ajax
 */
class HardwareController extends BaseAjaxController
{

    /**
     * @return array
     */
    public function actionIndex(): array
    {
        if (is_dir('./imapify/hardware/')) {
            $tmp = scandir('./imapify/hardware/');
            $responseData = [];
            foreach ($tmp as $nnValue) {
                if ($nnValue !== 'none.png' && mb_strtolower(substr($nnValue, -4)) === '.png') {
                    $responseData[] = $nnValue;
                }
            }
        } else {
            $responseData = false;
        }

        return [
            'result' => $responseData,
        ];
    }

    /**
     * @return array
     */
    public function actionUpdate(): array
    {
        $options = $this->getBaseOptions();
        $hostId = $options['hostids'];

        if (!$this->checkHostsIsWritable(array($hostId))) {
            return $this->accessError();
        }

        $options = [
            'hostid' => $hostId,
            'inventory' => []
        ];

        $hardware = $this->request->getBodyParam('hardware', '');
        $options['inventory']['type'] = $hardware;
        return API::Host()->update($options);
    }
}