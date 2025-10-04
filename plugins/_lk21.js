import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, "Tolong masukkan judul film yang ingin dicari.", m);
  }

  // Kirim pesan "Sedang Proses"
  await conn.reply(m.chat, "⏳ *Sedang Proses mencari film di LK21...*", m);

  try {
    // Fetch data dari situs web
    const response = await axios.get(`https://nontonfilmgratis.club/?s=${encodeURIComponent(text)}`);
    const $ = cheerio.load(response.data);
    let results = [];

    // Parsing data dari halaman web
    $('article.item, .post-item').each((i, element) => {
      const title = $(element).find('.entry-title a').text().trim();
      const link = $(element).find('.entry-title a').attr('href');
      const imageRaw = $(element).find('.content-thumbnail img').attr('src') || $(element).find('img').attr('src');
      const image = imageRaw?.replace(/-\d+x\d+\./, '.'); // Ubah thumbnail ke kualitas HD
      const rating = $(element).find('.gmr-rating-item, .rating').text().trim() || "Tidak tersedia";
      const duration = $(element).find('.gmr-duration-item, .duration').text().trim() || "Tidak tersedia";
      const quality = $(element).find('.gmr-quality-item a, .quality').text().trim() || "Tidak tersedia";
      const categories = [];

      $(element).find('.gmr-movie-on a[rel="category tag"], .categories a').each((j, cat) => {
        categories.push($(cat).text().trim());
      });

      const country = $(element).find('.gmr-movie-on span[itemprop="contentLocation"] a, .country').text().trim() || "Tidak diketahui";
      const director = $(element).find('[itemprop="director"] [itemprop="name"], .director').text().trim() || "Tidak diketahui";
      const trailer = $(element).find('.gmr-popup-button a, .trailer').attr('href') || "Tidak tersedia";

      results.push({ title, link, image, rating, duration, quality, categories, country, director, trailer });
    });

    // Cek apakah ada hasil
    if (results.length === 0) {
      return conn.reply(m.chat, "❌ Tidak ada film yang ditemukan. Mungkin ada perubahan pada situs atau data tidak tersedia.", m);
    }

    // Pilih hasil pertama
    const result = results[0];
    const caption = `
*🎬 Title:* ${result.title}
*🔗 Link:* ${result.link}
*⭐ Rating:* ${result.rating}
*⏱ Durasi:* ${result.duration}
*🎥 Quality:* ${result.quality}
*📂 Kategori:* ${result.categories.join(", ")}
*🌏 Negara:* ${result.country}
*🎬 Director:* ${result.director}
*🎞 Trailer:* ${result.trailer}
    `.trim();

    // Kirim hasil dengan gambar
    await conn.sendMessage(
      m.chat,
      {
        image: { url: result.image },
        caption
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error fetching movie data:", error.message);

    // Tampilkan pesan error yang lebih deskriptif
    conn.reply(m.chat, "❌ Terjadi kesalahan saat mengambil data film. Pastikan situs target aktif atau coba judul film lain.", m);
  }
};

handler.help = ['bioskop'];
handler.tags = ['search'];
handler.command = /^(lk21)$/i;
handler.register = true;
handler.limit = false;

export default handler;