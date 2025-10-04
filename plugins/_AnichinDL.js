import cheerio from 'cheerio'; // Mengimpor library cheerio untuk parsing HTML
import axios from 'axios'; // Mengimpor library axios untuk melakukan HTTP requests

// Handler untuk memproses permintaan download
const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) {
    return m.reply("Contoh: .Anichindl <URL-NYA>"); // Jika URL tidak diberikan
  }

  try {
    m.reply("Sedang Proses Sabar..."); // Memberi tahu pengguna bahwa proses sedang berlangsung
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Menunggu 3 detik

    // Mengambil tautan download dari URL yang diberikan
    const downloadLinks = await anichinDownload(text);

    // Jika tidak ada tautan yang ditemukan
    if (!downloadLinks.length) {
      return m.reply("Tidak ada tautan yang ditemukan");
    }

    // Membuat pesan yang berisi tautan download
    let message = "*Anichin Download Links*\n\nDitemukan " + downloadLinks.length + " tautan:\n";
    downloadLinks.forEach((link, index) => {
      message += "\n*[" + (index + 1) + "] Resolusi: " + link.resolution + "*\n";
      link.links.forEach((hostLink) => {
        message += "- " + hostLink.host + ": " + hostLink.url + "\n";
      });
    });
    message += "\nPowered by Noelle-MD";

    // Mengirim pesan ke pengguna
    conn.reply(m.chat, message, m);
  } catch (error) {
    console.error("Error download links:", error.message); // Menangani error
    m.reply("[ *Error* ] " + error.message);
  }
};

// Menambahkan metadata untuk handler
handler.help = ["anichindl"];
handler.command = ["anichindl"];
handler.tags = ["downloader"];
handler.register = true;
handler.limit = true;

// Mengekspor handler
export default handler;

// Fungsi untuk mengambil tautan download dari URL
async function anichinDownload(url) {
  try {
    // Mengambil data HTML dari URL
    const { data: html } = await axios.get(url);

    // Memuat HTML ke dalam cheerio
    const $ = cheerio.load(html);

    const downloadLinks = [];

    // Mengekstrak tautan download dari HTML
    $(".mctnx .soraddlx").each((index, element) => {
      const resolution = $(element).find(".soraurlx strong").first().text().trim(); // Resolusi
      const links = [];

      // Mengekstrak tautan untuk setiap host
      $(element).find(".soraurlx a").each((i, el) => {
        const host = $(el).text().trim(); // Nama host
        const url = $(el).attr("href"); // URL download
        links.push({ host, url });
      });

      // Menambahkan resolusi dan tautan ke array
      downloadLinks.push({ resolution, links });
    });

    return downloadLinks; // Mengembalikan array berisi tautan download
  } catch (error) {
    throw new Error("Linknya Salah Coba Lagi..."); // Menangani error
  }
}