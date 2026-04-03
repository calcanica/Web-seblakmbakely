// ==========================================
// 1. LOGIKA NAVIGASI SIDEBAR (MOBILE)
// ==========================================
let btnSidebar = document.getElementById('btn-hamburger');
let btnClose = document.getElementById('btn-close');
let nav = document.getElementById('nav');

btnSidebar.addEventListener('click', () => nav.classList.add('open'));
btnClose.addEventListener('click', () => nav.classList.remove('open'));
nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
});

// ==========================================
// 2. LOGIKA KALKULASI HARGA & TELEGRAM BOT
// ==========================================
const token = '8371393909:AAG_qBheZhU3tO-lIVuKz1WOItgFbMiKp8I';
const group_id = '-5268195408';
const formOrder = document.getElementById("formOrder");
let totalBelanja = 0;

// Memanggil elemen input
const elPilihanSeblak = document.getElementById("pilihan-seblak");
const elPilihanMinuman = document.getElementById("pilihan-minuman");
const elCheckboxesTopping = document.querySelectorAll(".cb-topping");

// Fungsi Hitung Total Real-time
function hitungTotal() {
    let hargaSeblak = parseInt(elPilihanSeblak.value) || 0;
    let hargaMinuman = parseInt(elPilihanMinuman.value) || 0;
    
    let hargaTopping = 0;
    let checkboxes = document.querySelectorAll(".cb-topping:checked");
    checkboxes.forEach((cb) => {
        hargaTopping += parseInt(cb.value);
    });

    totalBelanja = hargaSeblak + hargaTopping + hargaMinuman;
    
    document.getElementById("totalHargaDisplay").innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalBelanja);
}

// Menambahkan Event Listener agar otomatis berhitung saat ada pilihan diubah
elPilihanSeblak.addEventListener('change', hitungTotal);
elPilihanMinuman.addEventListener('change', hitungTotal);
elCheckboxesTopping.forEach(cb => cb.addEventListener('change', hitungTotal));


// Logika Submit Pesanan
formOrder.addEventListener("submit", function(e) {
    e.preventDefault();

    if (totalBelanja === 0 || elPilihanSeblak.value === "0") {
        alert("Silakan pilih minimal 1 menu Seblak utama terlebih dahulu!");
        return;
    }

    let nama = document.getElementById("nama").value;
    let notelp = document.getElementById("notelp").value;
    let alamat = document.getElementById("alamat").value;

    let namaSeblak = elPilihanSeblak.options[elPilihanSeblak.selectedIndex].getAttribute('data-nama');
    let namaMinuman = elPilihanMinuman.options[elPilihanMinuman.selectedIndex].getAttribute('data-nama');

    let listTopping = [];
    document.querySelectorAll(".cb-topping:checked").forEach((cb) => {
        listTopping.push(cb.getAttribute('data-nama'));
    });
    let stringTopping = listTopping.length > 0 ? listTopping.join(", ") : "Tidak ada";

    let pesanRekening = `Total Pesanan Anda: Rp ${totalBelanja.toLocaleString('id-ID')}\n\n`;
    pesanRekening += `Silakan lakukan transfer ke:\n`;
    pesanRekening += `🏦 BANK BCA: 1234567890\n`;
    pesanRekening += `👤 a.n ELY\n\n`;
    pesanRekening += `Klik 'OK' untuk melanjutkan pesanan.`;

    if(window.confirm(pesanRekening)) {
        let btnSubmit = document.getElementById('btnSubmit');
        let originalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Memproses...";
        btnSubmit.disabled = true;

        let textTelegram = `🛎 *PESANAN & CHECKOUT BARU* 🛎\n\n`;
        textTelegram += `👤 *Pemesan:* ${nama}\n`;
        textTelegram += `📞 *No. WA:* ${notelp}\n`;
        textTelegram += `🏠 *Alamat:* ${alamat}\n\n`;
        textTelegram += `🛒 *Rincian Pesanan:*\n`;
        textTelegram += `- Seblak: ${namaSeblak}\n`;
        textTelegram += `- Topping: ${stringTopping}\n`;
        textTelegram += `- Minuman: ${namaMinuman}\n\n`;
        textTelegram += `💰 *Total Dibayar:* Rp ${totalBelanja.toLocaleString('id-ID')}\n`;
        textTelegram += `⚠️ *Status:* Menunggu Pembeli Kirim Bukti Transfer.`;

        sendMessage(textTelegram, btnSubmit, originalText);
    }
});

// Logika Kirim Pesan via API Telegram
function sendMessage(text, btnElement, originalText) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: group_id,
            text: text,
            parse_mode: "Markdown"
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Gagal mengirim pesan");
        return res.json();
    })
    .then(data => {
        alert("Yeay! Pesanan berhasil dikirim. Jangan lupa kirim bukti transfer ke WhatsApp admin ya kak.");
        formOrder.reset(); 
        hitungTotal();
    })
    .catch(error => {
        console.error(error);
        alert("Waduh, gagal memproses pesanan. Pastikan koneksi internet stabil ya.");
    })
    .finally(() => {
        btnElement.innerHTML = originalText;
        btnElement.disabled = false;
    });
}