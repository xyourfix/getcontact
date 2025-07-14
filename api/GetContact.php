<?php
require_once 'utils/crypt.php';
require_once 'utils/request.php';
require_once 'utils/validate.php';

class GetContact {
    private $token;
    private $finalKey;
    
    public function __construct($token, $finalKey) {
        $this->token = $token;
        $this->finalKey = $finalKey;
    }
    
    private function getAwasBintitan() {
        return '793167597c4a25263656206b5469243e5f416c69385d2f7843716d4d4d5031242a29493846774a2c2a725f59554d2034683f40372b40233c3e2b772d6533565768747470733a2f2f7062737372762d63656e7472616c6576656e74732e636f6d2f76322e382f6e756d6265722d64657461696c';
    }
    
    public function checkNumber($number) {
        if (!$this->token) {
            throw new Exception('Token is required!');
        }
        
        if (!$this->finalKey) {
            throw new Exception('Final key is required!');
        }
        
        $number = validateNumber($number);
        
        $payload = [
            'countryCode' => 'us',
            'phoneNumber' => $number,
            'source' => 'profile',
            'token' => $this->token
        ];
        
        $timestamp = (string)(time() * 1000);
        $awasBintitan = $this->getAwasBintitan();
        $key = substr($awasBintitan, 0, 128);
        $url = substr($awasBintitan, 128);
        
        $signature = createSignature($timestamp, json_encode($payload), $key);
        
        $headers = [
            'X-Os: android 9',
            'X-Mobile-Service: GMS',
            'X-App-Version: 5.6.2',
            'X-Client-Device-Id: 063579f5e0654a4e',
            'X-Lang: en_US',
            'X-Token: ' . $this->token,
            'X-Req-Timestamp: ' . $timestamp,
            'X-Encrypted: 1',
            'X-Network-Country: us',
            'X-Country-Code: us',
            'X-Req-Signature: ' . $signature,
            'Content-Type: application/json'
        ];
        
        $encryptedData = encrypt(json_encode($payload), $this->finalKey);
        $requestData = json_encode(['data' => $encryptedData]);
        
        try {
            $response = makeRequest($url, $requestData, $headers);
            
            if (!$response || !isset($response['data'])) {
                throw new Exception('Invalid response from GetContact API');
            }
            
            $decryptedResponse = decrypt($response['data'], $this->finalKey);
            $jsonResponse = json_decode($decryptedResponse, true);
            
            if (!$jsonResponse) {
                throw new Exception('Failed to parse response from GetContact API');
            }
            
            $tags = [];
            if (isset($jsonResponse['result']['tags']) && is_array($jsonResponse['result']['tags'])) {
                foreach ($jsonResponse['result']['tags'] as $tag) {
                    if (isset($tag['tag'])) {
                        $tags[] = $tag['tag'];
                    }
                }
            }
            
            return [
                'number' => $number,
                'tags' => $tags
            ];
            
        } catch (Exception $e) {
            throw new Exception($e->getMessage() ?: 'Something went wrong');
        }
    }
}
?>