import cheerio from 'cheerio'; // Mengimpor library cheerio untuk parsing HTML
import axios from 'axios'; // Mengimpor library axios untuk melakukan HTTP requests

// Fungsi untuk membuat delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fungsi untuk mengambil detail donghua dari URL
const DetailDonghua = async (url) => {
  try {
    console.log("Mencari detail donghua...");

    // Mengambil data HTML dari URL
    const { data: html } = await axios.get(url);

    // Memuat HTML ke dalam cheerio
    const $ = cheerio.load(html);

    // Mengambil detail donghua dari HTML
    const title = $(".entry-title").text().trim(); // Judul donghua
    const thumbnail = $(".thumb img").attr("src"); // Thumbnail donghua
    const rating = $(".rating strong").text().replace("Rating ", '').trim(); // Rating donghua
    const followers = $(".bmc").text().replace("Followed ", '').replace(" people", '').trim(); // Jumlah followers
    const synopsis = $(".synp .entry-content").text().trim(); // Sinopsis donghua
    const alternativeTitles = $(".alter").text().trim(); // Judul alternatif
    const status = $(".info-content .spe span:contains('Status')").text().replace("Status:", '').trim(); // Status donghua
    const network = $(".info-content .spe span:contains('Network') a").text().trim(); // Network
    const studio = $(".info-content .spe span:contains('Studio') a").text().trim(); // Studio
    const released = $(".info-content .spe span:contains('Released')").text().replace("Released:", '').trim(); // Tanggal rilis
    const duration = $(".info-content .spe span:contains('Duration')").text().replace("Duration:", '').trim(); // Durasi
    const season = $(".info-content .spe span:contains('Season') a").text().trim(); // Musim
    const country = $(".info-content .spe span:contains('Country') a").text().trim(); // Negara
    const type = $(".info-content .spe span:contains('Type')").text().replace("Type:", '').trim(); // Tipe
    const episodes = $(".info-content .spe span:contains('Episodes')").text().replace("Episodes:", '').trim(); // Jumlah episode
    const genres = $(".genxed a").map((index, element) => $(element).text().trim()).get(); // Genre

    // Mengembalikan objek berisi detail donghua
    return {
      title,
      thumbnail,
      rating,
      followers,
      synopsis,
      alternativeTitles,
      status,
      network,
      studio,
      released,
      duration,
      season,
      country,
      type,
      episodes,
      genres,
    };
  } catch (error) {
    console.error("Error fetching detail:", error.message);
    throw new Error("URL Salah Harap Periksa Kembali..");
  }
};

// Handler untuk memproses permintaan
const handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, "URL Donghuanya Mana??", m); // Jika URL tidak diberikan
  }

  conn.reply(m.chat, "Sedang Mencari Donghuanya...", m); // Memberi tahu pengguna bahwa proses sedang berlangsung
  await delay(3000); // Menunggu 3 detik

  try {
    const donghuaDetail = await DetailDonghua(text); // Mengambil detail donghua

    // Mengirim thumbnail donghua
    await conn.sendFile(
      m.chat,
      donghuaDetail.thumbnail,
      "thumbnail.jpg",
      `Thumbnail dari donghua "${donghuaDetail.title}"`,
      m
    );

    await delay(2000); // Menunggu 2 detik

    // Membuat pesan detail donghua
    const detailMessage = `
*Detail Donghua:*
- *Judul*: ${donghuaDetail.title}
- *Rating*: ${donghuaDetail.rating}
- *Followers*: ${donghuaDetail.followers}
- *Status*: ${donghuaDetail.status}
- *Network*: ${donghuaDetail.network}
- *Studio*: ${donghuaDetail.studio}
- *Rilis*: ${donghuaDetail.released}
- *Durasi*: ${donghuaDetail.duration}
- *Season*: ${donghuaDetail.season}
- *Negara*: ${donghuaDetail.country}
- *Tipe*: ${donghuaDetail.type}
- *Episode*: ${donghuaDetail.episodes}
- *Genre*: ${donghuaDetail.genres.join(", ")}

*Sinopsis:*
${donghuaDetail.synopsis}

*Alternative Titles:* ${donghuaDetail.alternativeTitles}

Powered by Noelle-MD
    `;

    // Mengirim pesan detail donghua
    conn.reply(m.chat, detailMessage, m);
  } catch (error) {
    conn.reply(m.chat, "Error: " + error.message, m); // Menangani error
  }
};

// Menambahkan metadata untuk handler
handler.help = ["anichindetail"];
handler.command = ["anichindetail"];
handler.tags = ["tools"];
handler.register = true;
handler.limit = true;

// Mengekspor handler
export default handler;