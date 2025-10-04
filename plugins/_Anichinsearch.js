import cheerio from 'cheerio'; // Mengimpor library cheerio untuk parsing HTML
import axios from 'axios'; // Mengimpor library axios untuk melakukan HTTP requests

// Fungsi untuk melakukan pencarian donghua
const Search = async (query, callback) => {
  const searchUrl = "https://anichin.date/?s=" + encodeURIComponent(query); // Membuat URL pencarian

  try {
    // Mengambil data HTML dari URL pencarian
    const { data: html } = await axios.get(searchUrl);

    // Memuat HTML ke dalam cheerio
    const $ = cheerio.load(html);

    // Menunggu 3 detik (simulasi delay)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const results = [];

    // Mengekstrak hasil pencarian dari HTML
    $(".listupd article").each((index, element) => {
      const title = $(element).find(".tt h2").text().trim(); // Judul donghua
      const type = $(element).find(".typez").text().trim(); // Tipe donghua
      const status = $(element).find(".bt .epx").text().trim(); // Status donghua
      const link = $(element).find("a").attr("href"); // Link donghua
      const image = $(element).find("img").attr("src"); // Gambar thumbnail

      // Menambahkan hasil ke array
      results.push({
        title,
        type,
        status,
        link,
        image,
      });
    });

    // Jika hasil ditemukan
    if (results.length > 0) {
      let message = `Search results for "${query}":\n\n`;
      results.forEach((result, index) => {
        message += `${index + 1}. ${result.title} (${result.type})\nStatus: ${result.status}\nLink: ${result.link}\nImage: ${result.image}\n\n`;
      });
      message += "\nPowered by Noelle-MD";

      // Mengirim hasil ke callback
      callback(message);
    } else {
      // Jika tidak ada hasil
      console.error("No results found for query:", query);
      callback(`Hasil Dari "${query}" Tidak Ditemukan....`);
    }

    return results; // Mengembalikan array berisi hasil pencarian
  } catch (error) {
    // Menangani error
    console.error("Error scraping search results:", error.message);
    callback(`Error scraping search results for "${query}". Please try again later.`);
    throw new Error("Error scraping search results: " + error.message);
  }
};

// Handler untuk memproses permintaan pencarian
const handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, "Masukkan Judul Donghuanya..", m); // Jika query tidak diberikan
  }

  // Memberi tahu pengguna bahwa proses sedang berlangsung
  conn.reply(m.chat, "Tunggu Sebentar Lagi Nyari...", m);

  // Memanggil fungsi pencarian
  await Search(text, (result) => {
    conn.reply(m.chat, result, m); // Mengirim hasil pencarian ke pengguna
  });
};

// Menambahkan metadata untuk handler
handler.help = ["anichinsearch"];
handler.tags = ["search"];
handler.command = /^(anichinsearch)$/i; // Perintah yang dapat digunakan
handler.register = true; // Menandakan bahwa handler ini dapat didaftarkan
handler.limit = true; // Menandakan bahwa handler ini memiliki batasan

// Mengekspor handler
export default handler;