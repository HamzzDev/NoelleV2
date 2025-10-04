import axios from 'axios'; // Mengimpor library axios untuk melakukan HTTP requests
import cheerio from 'cheerio'; // Mengimpor library cheerio untuk parsing HTML

// Handler untuk memproses permintaan pencarian episode
const handler = async (m, { text }) => {
  if (!text) {
    return m.reply("Link Donghuanya Mana?..."); // Jika URL tidak diberikan
  }

  m.reply("Memulai Pencarian..."); // Memberi tahu pengguna bahwa proses sedang berlangsung
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Menunggu 3 detik

  try {
    // Mengambil daftar episode dari URL yang diberikan
    const episodes = await Episode(text);

    // Jika tidak ada episode yang ditemukan
    if (!episodes.length) {
      return m.reply("Episode Tidak Ditemukan...");
    }

    // Membuat pesan yang berisi daftar episode
    let message = "Episodes:\n\n";
    episodes.forEach((episode, index) => {
      message += `${index + 1}. ${episode.title}\nRelease Date: ${episode.releaseDate}\nLink: ${episode.link}\n\n`;
    });
    message += "\nPowered by Noelle-MD";

    // Mengirim pesan ke pengguna
    m.reply(message);
  } catch (error) {
    console.error("Error fetching episodes:", error.message); // Menangani error
    m.reply("An error occurred while fetching the episodes.");
  }
};

// Menambahkan metadata untuk handler
handler.help = ["anichineps"];
handler.command = ["anichineps"];
handler.tags = ["search"];
handler.register = true;
handler.limit = true;

// Mengekspor handler
export default handler;

// Fungsi untuk mengambil daftar episode dari URL
const Episode = async (url) => {
  try {
    // Mengambil data HTML dari URL
    const { data: html } = await axios.get(url);

    // Memuat HTML ke dalam cheerio
    const $ = cheerio.load(html);

    const episodes = [];

    // Mengekstrak daftar episode dari HTML
    $(".eplister ul li").each((index, element) => {
      const episodeNumber = $(element).find(".epl-num").text().trim(); // Nomor episode
      const title = $(element).find(".epl-title").text().trim(); // Judul episode
      const subStatus = $(element).find(".epl-sub .status").text().trim(); // Status subtitle
      const releaseDate = $(element).find(".epl-date").text().trim(); // Tanggal rilis
      const link = $(element).find("a").attr("href"); // Link episode

      // Menambahkan episode ke array
      episodes.push({
        episodeNumber,
        title,
        subStatus,
        releaseDate,
        link,
      });
    });

    return episodes; // Mengembalikan array berisi daftar episode
  } catch (error) {
    console.error("Error fetching episodes:", error.message); // Menangani error
    return []; // Mengembalikan array kosong jika terjadi error
  }
};