export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isGroup) {
  if (m.isBaileys && m.fromMe) return true
  let chat = global.db.data.chats[m.chat]
  let isAudio = m.mtype
  let hapus = m.key.participant
  let bang = m.key.id
  if (chat.antiAudio && isAudio) {
    if(isAudio === "audioMessage"){
        if (isAdmin || !isBotAdmin){		  
        } else {
 m.reply(`*Terdeteksi File Mp3*\nSory audio/mp3 yang kamu kirim akan di hapus, karna admin mengaktifkan antiAudio`)
    return this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: hapus }})
        }return true
    }
  }
  return true
  }
}