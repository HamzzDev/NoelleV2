import axios from 'axios'; // Mengimpor library axios untuk melakukan HTTP requests
import cheerio from 'cheerio'; // Mengimpor library cheerio untuk parsing HTML

// Kelas Kusonime untuk menangani pencarian, detail, dan download anime
class Kusonime {
  // Metode untuk mencari anime berdasarkan judul
  async search(query) {
    try {
      // Mengambil data HTML dari URL pencarian
      const { data: html } = await axios.get(`https://kusonime.com/?s=${query}`, {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      // Memuat HTML ke dalam cheerio
      const $ = cheerio.load(html);

      // Mengekstrak hasil pencarian dari HTML
      const results = $('div[class="content"]')
        .map(function () {
          return {
            title: $(this).find('h2 > a').attr('title'), // Judul anime
            release: $(this).find('p:contains("Released")').text().trim(), // Tanggal rilis
            genre: $(this)
              .find('p:contains("Genre") > a')
              .map((index, element) => $(element).text())
              .get(), // Genre anime
            url: $(this).find('h2 > a').attr('href'), // URL anime
          };
        })
        .toArray();

      return results; // Mengembalikan array berisi hasil pencarian
    } catch (error) {
      console.error('Error searching Kusonime:', error);
      return []; // Mengembalikan array kosong jika terjadi error
    }
  }

  // Metode untuk mendapatkan anime terbaru
  async latest() {
    try {
      // Mengambil data HTML dari halaman utama Kusonime
      const { data: html } = await axios.get('https://kusonime.com/', {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      // Memuat HTML ke dalam cheerio
      const $ = cheerio.load(html);

      // Mengekstrak anime terbaru dari HTML
      const results = $('div[class="content"]')
        .map(function () {
          return {
            title: $(this).find('h2 > a').attr('title'), // Judul anime
            release: $(this).find('p:contains("Released")').text().trim(), // Tanggal rilis
            genre: $(this)
              .find('p:contains("Genre") > a')
              .map((index, element) => $(element).text())
              .get(), // Genre anime
            url: $(this).find('h2 > a').attr('href'), // URL anime
          };
        })
        .toArray();

      return results.slice(0, 30); // Mengembalikan 30 anime terbaru
    } catch (error) {
      console.error('Error fetching Kusonime latest:', error);
      return []; // Mengembalikan array kosong jika terjadi error
    }
  }

  // Metode untuk mendapatkan detail anime
  async detail(url) {
    try {
      // Mengambil data HTML dari URL detail anime
      const { data: html } = await axios.get(url, {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      // Memuat HTML ke dalam cheerio
      const $ = cheerio.load(html);

      // Mengekstrak detail anime dari HTML
      const info = $('div[class="venser"]').find('div[class="info"]');
      return {
        judul: $('div[class="post-thumb"] > h1[class="jdlz"]').text(), // Judul anime
        rilis: info.find('p:nth-child(10)').text().split(': ')[1]?.trim(), // Tanggal rilis
        genre: info.find('p:nth-child(2)').text(), // Genre anime
        desk: $('div[class="lexot"] > p').first().text(), // Deskripsi anime
        download: this.extractDownloadLinks($), // Link download
      };
    } catch (error) {
      console.error('Error fetching Kusonime detail:', error);
      return null; // Mengembalikan null jika terjadi error
    }
  }

  // Metode untuk mengekstrak link download dari HTML
  extractDownloadLinks($) {
    const downloadLinks = {};

    // Mengekstrak link download untuk setiap resolusi
    $('.smokeurlrh').each((index, element) => {
      const resolution = $(element).find('strong').text().trim(); // Resolusi (misal: 360P, 480P)
      const links = {};

      // Mengekstrak link untuk setiap host
      $(element)
        .find('a[href]')
        .each((i, el) => {
          const host = $(el).text().trim(); // Nama host (misal: Google Sharer)
          const url = $(el).attr('href'); // URL download
          links[host] = url;
        });

      downloadLinks[resolution] = links; // Menyimpan link download untuk resolusi tertentu
    });

    return downloadLinks; // Mengembalikan objek berisi link download
  }
}

// Handler untuk memproses perintah pengguna
const handler = async (m, { conn, text, command }) => {
  const kusonime = new Kusonime(); // Membuat instance dari kelas Kusonime

  // Perintah: .kusonime <judul anime>
  if (command === 'kusonime') {
    if (!text) {
      return conn.reply(m.chat, 'Judul Anime? Contoh: .kusonime Natsume Yuujinchou', m); // Jika judul tidak diberikan
    }

    const results = await kusonime.search(text); // Mencari anime berdasarkan judul

    if (results.length === 0) {
      return conn.reply(m.chat, 'Tidak ditemukan hasil untuk pencarian ini.', m); // Jika tidak ada hasil
    }

    // Membuat pesan berisi hasil pencarian
    const message = results
      .map((result, index) => `*${index + 1}. ${result.title}*\nRilis: ${result.release}\nGenre: ${result.genre.join(', ')}\nURL: ${result.url}\n`)
      .join('\n');

    await conn.reply(m.chat, message, m); // Mengirim pesan ke pengguna
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Menunggu 3 detik
    return conn.sendMessage(m.chat, { text: '\nPowered by Noelle-MD' }, { quoted: m }); // Mengirim pesan footer
  }

  // Perintah: .kusonimelatest
  if (command === 'kusonimelatest') {
    const latestAnime = await kusonime.latest(); // Mendapatkan anime terbaru

    if (latestAnime.length === 0) {
      return conn.reply(m.chat, 'Gagal mendapatkan anime terbaru.', m); // Jika tidak ada hasil
    }

    // Membuat pesan berisi anime terbaru
    const message = latestAnime
      .map((anime, index) => `*${index + 1}. ${anime.title}*\nRilis: ${anime.release}\nGenre: ${anime.genre.join(', ')}\nURL: ${anime.url}\n`)
      .join('\n');

    await conn.reply(m.chat, message, m); // Mengirim pesan ke pengguna
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Menunggu 3 detik
    return conn.sendMessage(m.chat, { text: '\nPowered by Noelle-MD' }, { quoted: m }); // Mengirim pesan footer
  }

  // Perintah: .kusonimedl <url anime>
  if (command === 'kusonimedl') {
    if (!text.includes('kusonime')) {
      return conn.reply(m.chat, 'Format salah. Contoh: .kusonimedl https://kusonime.com/xxxx', m); // Jika URL tidak valid
    }

    const detail = await kusonime.detail(text); // Mendapatkan detail anime

    if (!detail) {
      return conn.reply(m.chat, 'Gagal mendapatkan detail anime.', m); // Jika tidak ada detail
    }

    // Membuat pesan berisi detail dan link download
    const message =
      '  『 ᴅʟ - ᴀɴɪᴍᴇ - ᴋᴜsᴏɴɪᴍᴇ 』\n\n' +
      `${detail.judul}\n` +
      `${detail.rilis}\n` +
      `${detail.genre}\n` +
      `${detail.desk}\n\n\n` +
      '╭╼ ʀᴇsᴜʟᴛ-ᴅᴏᴡɴʟᴏᴀᴅ ╼⋗\n' +
      `│ ⛶ ʀᴇsᴜʟᴛ : ${detail.download['360P']?.['Google Sharer'] || 'Tidak tersedia'}\n` +
      '╰┄╼⋗';

    await conn.reply(m.chat, message, m); // Mengirim pesan ke pengguna
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Menunggu 1 detik
    return conn.sendMessage(m.chat, { text: '\nPowered by Noelle-MD' }, { quoted: m }); // Mengirim pesan footer
  }

  // Perintah: .kusonimedetail <url anime>
  if (command === 'kusonimedetail') {
    if (!text) {
      return conn.reply(m.chat, 'Masukkan URL anime yang valid! Contoh: .kusonimedetail https://kusonime.com/xxxx', m); // Jika URL tidak diberikan
    }

    const detail = await kusonime.detail(text); // Mendapatkan detail anime

    if (!detail) {
      return conn.reply(m.chat, 'Gagal mendapatkan detail anime.', m); // Jika tidak ada detail
    }

    // Membuat pesan berisi detail anime
    const message = `*Judul:* ${detail.judul}\n*Rilis:* ${detail.rilis}\n*Genre:* ${detail.genre}\n*Deskripsi:* ${detail.desk}`;

    await conn.reply(m.chat, message, m); // Mengirim pesan ke pengguna
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Menunggu 1 detik
    return conn.sendMessage(m.chat, { text: '\nPowered by ShizukaMD' }, { quoted: m }); // Mengirim pesan footer
  }
};

// Menambahkan metadata untuk handler
handler.help = ['kusonime', 'kusonimedl', 'kusonimelatest', 'kusonimedetail'];
handler.tags = ['anime'];
handler.command = /^(kusonime|kusonimedl|kusonimelatest|kusonimedetail)$/i;
handler.register = true;
handler.limit = false;

// Mengekspor handler
export default handler;