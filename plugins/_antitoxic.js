const isToxic = /(anjing|kontol|memek|bangsat|babi|goblok|goblog|kntl|pepek|ppk|ngentod|ngentd|ngntd|kentod|kntd|bgst|anjg|anj|fuck|hitam|ireng|jawir|gay|asw|asu|ktl)/i;

// Daftar pesan Islami (ayat Al-Quran dan hadits) beserta teks Arab dan artinya
const islamicMessages = [
    {
        text: `
*⚠️ Terdeteksi Kata Toxic! ⚠️*

*Peringatan:*
Allah SWT berfirman:

*﴿وَقُل لِّعِبَادِي يَقُولُوا الَّتِي هِيَ أَحْسَنُ﴾*
*"Dan ucapkanlah kepada hamba-hamba-Ku agar mereka mengucapkan perkataan yang lebih baik (benar)."* (QS. Al-Isra: 53)

*Hikmah:*
Pilihlah kata-kata yang baik, karena lisanmu adalah cerminan hatimu.
`,
        action: "Pesanmu akan dihapus karena mengandung kata-kata yang tidak pantas. Mohon perbaiki tutur katamu."
    },
    {
        text: `
*⚠️ Terdeteksi Kata Toxic! ⚠️*

*Peringatan:*
Rasulullah SAW bersabda:

*«مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ»*
*"Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah dia berkata baik atau diam."* (HR. Bukhari & Muslim)

*Hikmah:*
Diam itu emas, berkata baik itu perak. Jaga lisanmu, karena ia bisa menyelamatkan atau menghancurkanmu.
`,
        action: "Pesanmu akan dihapus karena mengandung kata-kata yang tidak pantas. Mohon perbaiki tutur katamu."
    },
    {
        text: `
*⚠️ Terdeteksi Kata Toxic! ⚠️*

*Peringatan:*
Allah SWT berfirman:

*﴿يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا﴾*
*"Wahai orang-orang yang beriman, bertakwalah kepada Allah dan ucapkanlah perkataan yang benar."* (QS. Al-Ahzab: 70)

*Hikmah:*
Berkata benar dan baik adalah tanda ketakwaan. Mari jaga lisan kita dari kata-kata yang sia-sia.
`,
        action: "Pesanmu akan dihapus karena mengandung kata-kata yang tidak pantas. Mohon perbaiki tutur katamu."
    },
    {
        text: `
*⚠️ Terdeteksi Kata Toxic! ⚠️*

*Peringatan:*
Rasulullah SAW bersabda:

*«إِنَّ الْعَبْدَ لَيَتَكَلَّمُ بِالْكَلِمَةِ مِنْ سَخَطِ اللَّهِ، لاَ يُلْقِي لَهَا بَالاً، يَهْوِي بِهَا فِي جَهَنَّمَ»*
*"Sesungguhnya seorang hamba mengucapkan satu kalimat yang membuat Allah murka, tanpa dia sadari, yang menyebabkan dia terjatuh ke dalam neraka."* (HR. Bukhari)

*Hikmah:*
Berhati-hatilah dengan setiap kata yang keluar dari mulutmu, karena ia bisa menjadi penyebab keselamatan atau kebinasaan.
`,
        action: "Pesanmu akan dihapus karena mengandung kata-kata yang tidak pantas. Mohon perbaiki tutur katamu."
    }
];

export async function before(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe)
        return !0
    if (!m.isGroup) return !1
    let chat = global.db.data.chats[m.chat]
    let bot = global.db.data.settings[this.user.jid] || {}
    const isAntiToxic = isToxic.exec(m.text)
    let hapus = m.key.participant
    let bang = m.key.id

    // Cek apakah pengirim adalah owner dengan nomor 6289508242211
    const ownerNumber = '6289508242211@s.whatsapp.net'; // Format nomor WhatsApp
    if (m.sender === ownerNumber) {
        return !0; // Bot tidak melakukan apa-apa jika yang mengirim adalah owner
    }

    if (chat.antiToxic && isAntiToxic) {
        // Pilih pesan secara acak dari daftar islamicMessages
        const randomMessage = islamicMessages[Math.floor(Math.random() * islamicMessages.length)];

        // Kirim pesan peringatan
        await m.reply(randomMessage.text);

        // Hapus pesan toxic jika bot adalah admin dan restrict aktif
        if (isBotAdmin && bot.restrict) {
            return this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: hapus }});
        } else if (!bot.restrict) {
            return m.reply('Lain kali jangan berkata kasar ya, mari kita jaga tutur kata.');
        }
    }
    return !0;
}