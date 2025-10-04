let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    // Jika pesan dikirim di dalam grup, hentikan eksekusi
    if (!m.isGroup) return;
    
    // Jika pesan berasal dari bot itu sendiri, hentikan eksekusi
    if (m.fromMe) return true;

    // Cek apakah ID pesan dimulai dengan '3EB0' dan memiliki panjang 22 karakter
    if (m.id.startsWith('3EB0') && m.id.length === 22) {
        let chat = global.db.data.chats[m.chat];

        // Cek apakah fitur anti bot diaktifkan di grup ini
        if (chat.antiBot) {
            await conn.reply(m.chat, "*[ BOT LAIN TERDETEKSI ]*", null);
            await conn.delay(1000);

            // Jika pengirim bukan admin dan bot juga bukan admin, keluarkan pengirim dari grup
            if (!isAdmin && isBotAdmin) {
                await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");  
            }
        }
    }
}

export default handler;