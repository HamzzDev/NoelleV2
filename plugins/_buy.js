import fetch from 'node-fetch'

const handler = async (m, { conn, command, usedPrefix }) => {
    let str = `${conn.getName(m.sender)}
Want Support Bot?

*[ PAYMENT METHOD ]*

- Dana *085717493023*

Setelah melakukan donasi kirim bukti pembayaran ke owner
`

    // Membuat request payment message
    await conn.relayMessage(m.chat, {
        requestPaymentMessage: {
            currencyCodeIso4217: 'HamzzDev',
            amount1000: '9999999',
            requestFrom: '0@s.whatsapp.net',
            noteMessage: {
                extendedTextMessage: {
                    text: str,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        externalAdReply: {
                            showAdAttribution: true,
                            mediaUrl: 'https://wa.me/6289508242211',  // URL gambar atau media jika diperlukan
                            mediaType: 1,  // Tipe media (1 untuk gambar, 2 untuk video)
                            title: 'Support Bot',
                            body: 'Dukung kami dengan donasi untuk layanan lebih baik.'
                        }
                    }
                }
            }
        }
    }, {})

}

handler.customPrefix = /^(.buy|. buy|. Buy|Buy)$/i
handler.command = new RegExp()  // Perbaiki 'command' menjadi 'handler.command'

export default handler