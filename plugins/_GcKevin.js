import fetch from 'node-fetch'

let handler = async (m, { conn, command }) => {
let kevin = `*Agar Terhindar Dari*\n*Amukan Admin Pesan*\n*Dikirim di Privat Chats*`
conn.sendMessage(m.chat, {
      text: HamzzDev,
      contextInfo: {
      externalAdReply: {
      title: namebot,
      body: nameown,
      thumbnailUrl: 'https://files.catbox.moe/qqmk42.jpg',
      mediaType: 1,
      renderLargerThumbnail: true
      }}})
      conn.reply(m.sender, `BURONAN WARGA\n\n${sgc}`, m)
}
handler.command = /^(gcbot)$/i
handler.tags = ['info']
handler.help = ['gcbot']
handler.limit = false

export default handler