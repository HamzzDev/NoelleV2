let handler = m => m;

global.db = global.db || { data: { chats: {} } };
let warningCount = {};

handler.before = async function (m, { isAdmin, isBotAdmin, conn }) {
    if (!m.isGroup) return true;

    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};
    let chat = global.db.data.chats[m.chat];

    // Cek apakah fitur Anti Tag Status diaktifkan
    if (!chat.antitagsw) return true;

    // Cek apakah pesan adalah tag status
    if (m.mtype === "groupStatusMentionMessage") {
        let user = m.sender;
        let username = await conn.getName(user); // Ambil nama pengguna

        // Hapus pesan jika bot adalah admin
        if (isBotAdmin) {
            await conn.sendMessage(m.chat, { delete: m.key });
        }

        if (isAdmin) {
            // Jika pengirim adalah admin, beri info tanpa warning
            await m.reply(`*[ System Detect ]*\n\n> *${username}* telah mengirim\n> Tag Status.\n> Peringatan Telah Diberikan\n\nPesan Akan Dihapus Karena Fitur *Anti Tag Status Telah Aktif.*\n(Tidak Ada Warn Untuk Admin)`, null, { mentions: [user] });
            return true;
        }

        // Jika bukan admin (hanya member), berikan warning
        warningCount[user] = (warningCount[user] || 0) + 1;

        if (warningCount[user] >= 3) {
            if (isBotAdmin) {
                await m.reply(`*[ System Detected ]*\n\n> *${username}* telah mengirim *Tag Status* sebanyak 3 kali!\n🚨 *AUTOMATIS DIKELUARKAN DARI GRUP!*`, null, { mentions: [user] });
                await conn.groupParticipantsUpdate(m.chat, [user], "remove");
            } else {
                await m.reply(`*[ System Detected ]*\n\n> *${username}* telah mencapai batas maksimal pelanggaran (3x), tetapi bot bukan admin, jadi tidak bisa mengeluarkannya.`, null, { mentions: [user] });
            }
            delete warningCount[user];
        } else {
            await m.reply(`*[ System Detected ]*\n\n> *${username}*, dilarang mengirim *Tag Status*!\n🚨 Peringatan ke-${warningCount[user]}/3.\n\n🔴 Jika mencapai 3 kali, Anda akan dikeluarkan dari grup!`, null, { mentions: [user] });
        }
    }

    return true;
};

export default handler;