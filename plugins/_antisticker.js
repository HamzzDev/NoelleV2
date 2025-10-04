export async function before(m, { isAdmin, isBotAdmin, conn }) {
  // Memastikan bahwa pesan berasal dari grup
  if (m.isGroup) {
    // Menghindari pemrosesan pesan yang dikirim oleh bot sendiri
    if (m.isBaileys && m.fromMe) return true;

    // Mengambil data chat dan data pengguna dari database
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.key.participant];
    
    // Memeriksa tipe pesan apakah itu stiker (stickerMessage)
    let isSticker = m.mtype === 'stickerMessage'; // Cek apakah pesan tersebut adalah stickerMessage
    let hapus = m.key.participant;  // ID pengirim pesan
    let bang = m.key.id;            // ID pesan yang akan dihapus

    // Jika fitur antiSticker diaktifkan dan pesan berupa stiker
    if (chat.antiSticker && isSticker) {
      // Jika pengirim adalah admin, beri peringatan saja tanpa menghapus
      if (isAdmin) {
        await m.reply("Kamu Admin, Admin Bebas Yakan... 😊");
      } else {
        // Jika pengirim bukan admin, hapus stiker dan beri peringatan
        await m.reply(`*Terdeteksi Sticker*\nSticker yang kamu kirim akan dihapus karena admin mengaktifkan fitur antiSticker. Kamu akan diberi warn 📣`);
        
        // Menghapus pesan stiker
        await conn.delay(1000); // Menunggu sebentar sebelum menghapus
        await this.sendMessage(m.chat, { 
          delete: { 
            remoteJid: m.chat, 
            fromMe: false, 
            id: bang, 
            participant: hapus 
          } 
        });

        // Menambahkan atau memperbarui peringatan pengguna
        if (!user.warn) user.warn = 0; // Inisialisasi jika belum ada peringatan
        user.warn += 1;  // Tambah 1 peringatan

        // Mengirim pesan peringatan
        await m.reply(`Warn 📣 ke-${user.warn} untuk kamu, jika mencapai 5 Warn kamu akan dikeluarkan..`);

        // Jika peringatan mencapai 5, keluarkan pengguna
        if (user.warn >= 5) {
          // Jika bot admin, kick pengguna
          if (isBotAdmin) {
            await this.groupParticipantsUpdate(m.chat, [hapus], 'remove');
            await m.reply(`Pengguna @${hapus.split('@')[0]} telah di-kick karena mencapai 5 Warn 📣`);

            // Reset peringatan setelah kick
            user.warn = 0;
            await m.reply("Warn 📣 kamu telah di-reset karena telah dikeluarkan dari grup.");
          } else {
            await m.reply('Bot tidak memiliki izin admin untuk mengeluarkan pengguna!');
          }
        }
      }

      return true; // Menghentikan pemrosesan lebih lanjut
    }
  }

  return true;  // Lanjutkan ke proses berikutnya
}