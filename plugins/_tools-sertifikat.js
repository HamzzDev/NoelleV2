// Direkode ulang oleh <Kevin>
// Tipe Awal Case Direcode Menjadi Plugins esm dan Plugins cjs
// © *Siputzx API*
// # *SUMBER*
// https://whatsapp.com/channel/0029Vagk8AMKrWR5wAmiq745

import axios from 'axios';

let handler = async (m, { conn, command }) => {
    const text = m.text.slice(command.length + 2).trim();
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `Gunakan perintah ini dengan format:\n\n*contoh .${command} <teks>*`,
        }, { quoted: m });
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const url = `https://api.siputzx.my.id/api/m/sertifikat-tolol?text=${encodeURIComponent(text)}`;
        const response = await axios.get(url, { responseType: "arraybuffer" });
        
        const caption = `Berikut adalah gambar sertifikat "${text}" yang Anda minta.`;

        await conn.sendMessage(m.chat, {
            image: Buffer.from(response.data),
            caption: caption,
        }, { quoted: m });
    } catch (err) {
        console.error("Error:", err);
        await conn.sendMessage(m.chat, {
            text: "Error Kak....",
        }, { quoted: m });
    }
}

handler.tags = ['tools']; 
handler.help = ['sertifikat'];
handler.command = ['sertifikat'];

handler.register = true;
handler.limit = 5;

export default handler;