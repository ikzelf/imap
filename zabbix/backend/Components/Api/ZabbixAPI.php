<?php

namespace IMapify\Components\Api;

use API;
use CJsonRpc;
use IMapify\Exceptions\ZabbixAPIException;

/**
 * Class ZabbixAPI
 * @package IMapify\Components\Api
 */
class ZabbixAPI
{
    /**
     * @var string
     */
    private $secretFilePath;
    /**
     * @var string
     */
    private $keyStorePath;

    /**
     * ZabbixAPI constructor.
     * @param string $secretFilePath
     * @param string $keyStorePath
     */
    public function __construct(string $secretFilePath, string $keyStorePath)
    {
        $this->secretFilePath = $secretFilePath;
        $this->keyStorePath = $keyStorePath;
    }

    /**
     * Get API auth key for Zabbix.
     * @return string
     * @throws ZabbixAPIException
     */
    public function getAuthKey(): string
    {
        $authKey = $this->readKeyFromStore();
        if ($authKey !== null) {
            if ($this->checkAuthentication($authKey) === false) {
                $authKey = null;
            }
        }

        if ($authKey === null) {
            $secretData = $this->getZabbixAuthData();

            $authKey = $this->login($secretData);

            try {
                $this->writeKeyToStore($authKey);
            } catch (ZabbixAPIException $exception) {
                $this->logout($authKey);

                throw $exception;
            }
        }

        return $authKey;
    }

    /**
     * Get zabbix auth data.
     *
     * @return array
     * @throws ZabbixAPIException
     */
    protected function getZabbixAuthData(): array
    {
        if (!file_exists($this->secretFilePath)) {
            throw new ZabbixAPIException('Secret file not found (`secret.php`). For more information see `secret.php.example`');
        }

        if (!is_readable($this->secretFilePath)) {
            throw new ZabbixAPIException('Secret file isn\'t readable. Please check file chmod.');
        }

        /** @noinspection PhpIncludeInspection */
        $secretData = include $this->secretFilePath;
        return [
            'user' => $secretData['zabbix.login'] ?? null,
            'password' => $secretData['zabbix.password'] ?? null,
        ];
    }

    /**
     * Check and refresh auth key.
     *
     * @param string $authKey
     * @return bool
     */
    protected function checkAuthentication(string $authKey)
    {
        try {
            $this->request('user.checkAuthentication', ['sessionid' => $authKey]);
        } catch (ZabbixAPIException $ignore) {
            return false;
        }

        return true;
    }

    /**
     * @param array $requestData
     * @return string
     * @throws ZabbixAPIException
     */
    protected function login(array $requestData): string
    {
        return $this->request('user.login', $requestData);
    }

    /**
     * Invalidate auth key.
     *
     * @param string $authKey
     */
    protected function logout(string $authKey)
    {
        try {
            $this->request('user.logout', [], $authKey);
        } catch (ZabbixAPIException $ignore) {
        }
    }

    /**
     * Emulate request to Zabbix API.
     *
     * @param string $method
     * @param array $params
     * @param string|null $authKey
     * @return mixed
     * @throws ZabbixAPIException
     */
    protected function request(string $method, array $params, string $authKey = null)
    {
        $requestData = [
            'jsonrpc' => '2.0',
            'method' => $method,
            'params' => $params,
            'id' => uniqid(),
            'auth' => $authKey,
        ];

        $apiClient = API::getWrapper()->getClient();
        $jsonRpc = new CJsonRpc($apiClient, json_encode($requestData));
        $result = json_decode($jsonRpc->execute(), true);

        if (isset($result['error'])) {
            throw new ZabbixAPIException($result['error']['data'] ?? $result['error']['message']);
        }

        return $result['result'];
    }

    /**
     * Read auth key from keystore path.
     *
     * @return string|null
     * @throws ZabbixAPIException
     */
    private function readKeyFromStore()
    {
        $storedKey = null;
        if (file_exists($this->keyStorePath)) {
            if (!is_readable($this->keyStorePath)) {
                throw new ZabbixAPIException(sprintf('Keystore file isn\'t readable. Please fix chmod for file `%s`', $this->keyStorePath));
            }

            $storedKey = trim(file_get_contents($this->keyStorePath)) ?: null;
        }

        return $storedKey;
    }

    /**
     * Write auth key to keystore file.
     *
     * @param string $authKey
     * @throws ZabbixAPIException
     */
    private function writeKeyToStore(string $authKey)
    {
        if (!is_writable($this->keyStorePath)) {
            throw new ZabbixAPIException(sprintf('Keystore file isn\'t writable. Please fix chmod for file `%s`', $this->keyStorePath));
        }

        file_put_contents($this->keyStorePath, $authKey);
    }
}