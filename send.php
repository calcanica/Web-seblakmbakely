<?php
$token = "8371393909:AAG_qBheZhU3tO-lIVuKz1WOItgFbMiKp8I"; // JANGAN pakai token lama (sudah terekspos)
$chat_id = "123456789";

// Cek apakah data ada
if (!isset($_POST['nama']) || !isset($_POST['menu']) || !isset($_POST['alamat'])) {
    echo "Data pesanan tidak lengkap!";
    exit;
}

$nama = htmlspecialchars($_POST['nama']);
$menu = htmlspecialchars($_POST['menu']);
$alamat = htmlspecialchars($_POST['alamat']);

$message = "Pesanan Baru:\nNama: $nama\nMenu: $menu\nAlamat: $alamat";

$url = "https://api.telegram.org/bot$token/sendMessage";

$data = [
    'chat_id' => $chat_id,
    'text' => $message
];

$options = [
    'http' => [
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data),
    ]
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

// cek kalau gagal
if ($result === FALSE) {
    echo "Gagal kirim pesan!";
} else {
    echo "Pesanan berhasil dikirim!";
}
?>