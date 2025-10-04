import axios from 'axios'; // Mengimpor library axios untuk melakukan HTTP requests

// Fungsi untuk membuat delay (jeda waktu)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Handler untuk memproses permintaan pencarian AI Muslim
const handler = async (m, { text }) => {
  // Jika tidak ada teks yang diberikan
  if (!text) {
    await m.react('⚠️'); // Memberi reaksi emoji ⚠️
    return m.reply('Masukkan atau Reply Pesan yang Ingin Dicari!'); // Mengirim pesan error
  }

  try {
    await m.react('🔍'); // Memberi reaksi emoji 🔍
    await sleep(1000); // Menunggu 1 detik
    await m.reply('*Sedang Mengambil Data...*'); // Memberi tahu pengguna bahwa proses sedang berlangsung

    // Mengambil data dari API Muslim AI
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/muslimai?query=${encodeURIComponent(text)}`);
    const result = response?.data?.data || '❌ *Tidak ada hasil yang ditemukan.*'; // Mengambil hasil atau pesan default jika tidak ada hasil

    await sleep(1500); // Menunggu 1.5 detik
    await m.react('✅'); // Memberi reaksi emoji ✅
    await m.reply(result); // Mengirim hasil ke pengguna
  } catch (error) {
    await m.react('❌'); // Memberi reaksi emoji ❌
    console.error('Error Muslim-AI: ' + error.message); // Menampilkan error di console
    return m.reply('❌ *Terjadi masalah pada server. Silakan coba lagi nanti.*'); // Mengirim pesan error ke pengguna
  }
};

// Menambahkan metadata untuk handler
handler.help = ['muslimai', 'alquraninfo', 'cariquran']; // Daftar perintah yang didukung
handler.tags = ['ai', 'islamic']; // Tag untuk kategori
handler.command = /^(muslimai|alquraninfo|cariquran)$/i; // Regex untuk mencocokkan perintah
handler.limit = true; // Menandakan bahwa handler ini memiliki batasan
handler.register = true; // Menandakan bahwa handler ini dapat didaftarkan

// Mengekspor handler
export default handler;