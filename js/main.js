// ==========================================
// 1. LOGIKA NAVIGASI SIDEBAR (MOBILE)
// ==========================================
const btnSidebar = document.getElementById('btn-hamburger');
const btnClose = document.getElementById('btn-close');
const nav = document.getElementById('nav');

if (btnSidebar) {
    btnSidebar.addEventListener('click', () => nav.classList.add('open'));
}
if (btnClose) {
    btnClose.addEventListener('click', () => nav.classList.remove('open'));
}

nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
});

// ==========================================
// 2. LOGIKA TOGGLE DINE-IN / TAKE AWAY & LEVEL PEDAS
// ==========================================
const radioOrderType = document.querySelectorAll('input[name="order_type"]');
const groupMeja = document.getElementById('group-meja');
const groupAlamat = document.getElementById('group-alamat');
const sliderPedas = document.getElementById('level-pedas');
const labelPedasVal = document.getElementById('label-pedas-val');

// Toggle tampilan Nomor Meja vs Alamat
radioOrderType.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'Dine In') {
            groupMeja.style.display = 'block';
            groupAlamat.style.display = 'none';
        } else {
            groupMeja.style.display = 'none';
            groupAlamat.style.display = 'block';
        }
    });
});

// Update Label Level Pedas
const pedasDesc = [
    "🔥 Level 0 (Original)",
    "🔥 Level 1 (Pedas Santai)",
    "🔥🔥 Level 2 (Lumayan)",
    "🔥🔥🔥 Level 3 (Mantap!)",
    "🔥🔥🔥🔥 Level 4 (Keringatan)",
    "🔥🔥🔥🔥🔥 Level 5 (Dewa Pedas!)"
];

if (sliderPedas) {
    sliderPedas.addEventListener('input', () => {
        labelPedasVal.innerText = pedasDesc[sliderPedas.value];
    });
}

// ==========================================
// 3. LOGIKA KALKULASI HARGA & WHATSAPP / TELEGRAM
// ==========================================
const token = '8371393909:AAG_qBheZhU3tO-lIVuKz1WOItgFbMiKp8I';
const group_id = '-5268195408';
const formOrder = document.getElementById("formOrder");
let totalBelanja = 0;

function hitungTotal() {
    const elSeblak = document.getElementById("pilihan-seblak");
    const elMinuman = document.getElementById("pilihan-minuman");
    const checkboxes = document.querySelectorAll(".cb-topping:checked");

    let hargaSeblak = elSeblak ? parseInt(elSeblak.value) || 0 : 0;
    let hargaMinuman = elMinuman ? parseInt(elMinuman.value) || 0 : 0;
    
    let hargaTopping = 0;
    checkboxes.forEach((cb) => {
        hargaTopping += parseInt(cb.value);
    });

    totalBelanja = hargaSeblak + hargaTopping + hargaMinuman;
    
    const displayTotal = document.getElementById("totalHargaDisplay");
    if (displayTotal) {
        displayTotal.innerText = new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(totalBelanja);
    }
}

// Event Listeners untuk Kalkulasi Otomatis
document.addEventListener('change', (e) => {
    if (e.target.id === 'pilihan-seblak' || 
        e.target.id === 'pilihan-minuman' || 
        e.target.classList.contains('cb-topping')) {
        hitungTotal();
    }
});

// Logika Submit Form
if(formOrder) {
    formOrder.addEventListener("submit", function(e) {
        e.preventDefault();

        const elSeblak = document.getElementById("pilihan-seblak");
        if (totalBelanja === 0 || elSeblak.value === "0") {
            alert("Silakan pilih minimal 1 menu Seblak utama terlebih dahulu!");
            return;
        }

        // Ambil Data Pelanggan
        let nama = document.getElementById("nama").value;
        let notelp = document.getElementById("notelp").value;
        let tipePesanan = document.querySelector('input[name="order_type"]:checked').value;
        let infoLayanan = "";

        if (tipePesanan === 'Dine In') {
            infoLayanan = `Nomor Meja: ${document.getElementById("no_meja").value}`;
        } else {
            infoLayanan = `Alamat: ${document.getElementById("alamat").value}`;
        }

        // Ambil Rincian Pesanan
        let namaSeblak = elSeblak.options[elSeblak.selectedIndex].getAttribute('data-nama');
        let lvlPedas = sliderPedas.value;
        
        let listTopping = [];
        document.querySelectorAll(".cb-topping:checked").forEach((cb) => {
            listTopping.push(cb.getAttribute('data-nama'));
        });
        let stringTopping = listTopping.length > 0 ? listTopping.join(", ") : "Tidak ada";

        let elMinuman = document.getElementById("pilihan-minuman");
        let namaMinuman = elMinuman ? elMinuman.options[elMinuman.selectedIndex].getAttribute('data-nama') : "Tidak ada";

        // Konfirmasi Pembayaran
        let pesanKonfirmasi = `Total Pesanan Anda: Rp ${totalBelanja.toLocaleString('id-ID')}\n\n`;
        pesanKonfirmasi += `Silakan lakukan transfer ke:\n`;
        pesanKonfirmasi += `🏦 BANK BCA: 1234567890\n👤 a.n ELY\n\n`;
        pesanKonfirmasi += `Klik 'OK' untuk mengirim pesanan ke WhatsApp/Telegram.`;

        if(window.confirm(pesanKonfirmasi)) {
            let btnSubmit = document.getElementById('btnSubmit');
            let originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Memproses...";
            btnSubmit.disabled = true;

            // Format Pesan Telegram
            let textTelegram = `*PESANAN BARU (${tipePesanan.toUpperCase()})*\n\n`;
            textTelegram += `*Pemesan:* ${nama}\n`;
            textTelegram += `*No. WA:* ${notelp}\n`;
            textTelegram += `*${infoLayanan}*\n\n`;
            textTelegram += `*Rincian Pesanan:*\n`;
            textTelegram += `- Seblak: ${namaSeblak}\n`;
            textTelegram += `- Level Pedas: ${lvlPedas}\n`;
            textTelegram += `- Topping: ${stringTopping}\n`;
            textTelegram += `- Minuman: ${namaMinuman}\n\n`;
            textTelegram += `*Total Dibayar:* Rp ${totalBelanja.toLocaleString('id-ID')}\n`;
            textTelegram += `*Status:* Menunggu Bukti Transfer.`;

            sendMessage(textTelegram, btnSubmit, originalText);
        }
    });
}

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
        // Reset tampilan manual
        groupMeja.style.display = 'block';
        groupAlamat.style.display = 'none';
        labelPedasVal.innerText = pedasDesc[0];
        hitungTotal();
    })
    .catch(error => {
        console.error(error);
        alert("Gagal memproses pesanan. Silakan coba lagi.");
    })
    .finally(() => {
        btnElement.innerHTML = originalText;
        btnElement.disabled = false;
    });
}

// ==========================================
// 4. LOGIKA ANIMASI SCROLL (Fade In)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    hitungTotal(); // Jalankan kalkulasi awal saat page load

    const observerOptions = {
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});