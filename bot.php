<?php
$token = "8204980515:AAFRjbM9fscYiL0l32nlDw0sYO5BbKhGerA";
$apiUrl = "https://api.telegram.org/bot$token/";

$offset = 0;

while (true) {
    $updates = getUpdates($offset);
    if ($updates) {
        foreach ($updates as $update) {
            $offset = $update['update_id'] + 1;
            if (isset($update['message'])) {
                $message = $update['message'];
                $chatId = $message['chat']['id'];
                $text = $message['text'];

                // Respon sederhana
                $response = "Halo! Anda mengatakan: $text";

                sendMessage($chatId, $response);
            }
        }
    }
    sleep(1); // Tunggu 1 detik sebelum cek lagi
}

function getUpdates($offset) {
    global $apiUrl;
    $url = $apiUrl . "getUpdates?offset=$offset";
    $response = file_get_contents($url);
    $data = json_decode($response, true);
    return $data['ok'] ? $data['result'] : false;
}

function sendMessage($chatId, $text) {
    global $apiUrl;
    $url = $apiUrl . "sendMessage?chat_id=$chatId&text=" . urlencode($text);
    file_get_contents($url);
}
?>