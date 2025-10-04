let handler = async (m, { conn }) => {

  // Kirim file audio melalui link
  let audioLink = 'https://files.catbox.moe/xhuq46.mp3';
  await conn.sendMessage(m.chat, { audio: { url: audioLink }, mimetype: 'audio/mp4' }, { quoted: m });

  setTimeout(() => {
    let kevin = 'WalaikumSalam Kak☺️';
    conn.sendMessage(m.chat, { text: kevin }, { quoted: m });
  }, 1000);
}

handler.customPrefix = /^(assalamualaikum)$/i;
handler.command = new RegExp();
export default handler;