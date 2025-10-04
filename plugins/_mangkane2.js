import fetch from 'node-fetch'

// Definisikan fkontak dan wm di sini
// Jika fkontak adalah detail kontak, Anda bisa mengisinya sesuai kebutuhan
const fkontak = { 
    "key": {
        "fromMe": false,
        "participant": "0@s.whatsapp.net",
        "remoteJid": "0@s.whatsapp.net"
    },
    "message": {
        "contactMessage": {
            "displayName": "Example Contact",
            "vcard": "BEGIN:VCARD\nVERSION:3.0\nN:;\nFN:Example Contact\nitem1.TEL;waid=6289508242211:+6289508242211\nitem1.X-ABLabel:Mobile\nEND:VCARD"
        }
    }
};

// Jika wm adalah watermark atau teks yang akan ditampilkan, definisikan juga
const wm = 'INSTAGRAM @Muhammad_Alawy28';

const handler = async (m, { conn, command }) => {
    m.reply('Jangan lupa nyawer ke noelle ya~xixi..');
    let audio = `https://raw.githubusercontent.com/aisyah-rest/mangkane/main/Mangkanenya/${command}.mp3`;
    
    try {
        const thumbnail = await (await fetch('https://files.catbox.moe/k6mkuk.jpg')).buffer();
        await conn.sendFile(m.chat, audio, 'error.mp3', null, fkontak, true, {
            type: 'audioMessage',
            ptt: false,
            seconds: 0,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    mediaUrl: sig,
                    mediaType: 2,
                    description: 'Follow ya kak owner noelle',
                    title: "Sedang Memutar Lagu..",              
                    body: wm,
                    thumbnail: thumbnail,
                    sourceUrl: sig,
                }
            }
        });
    } catch (error) {
        console.error('Error in handler:', error);
        m.reply('Terjadi kesalahan saat mengirim file.');
    }
};

handler.help = ['mangkane25', 'mangkane26', 'mangkane27', 'mangkane28', 'mangkane29', 'mangkane30', 'mangkane31', 'mangkane32', 'mangkane33', 'mangkane34', 'mangkane35', 'mangkane36', 'mangkane37', 'mangkane38', 'mangkane39', 'mangkane40', 'mangkane41', 'mangkane42', 'mangkane43', 'mangkane44', 'mangkane45', 'mangkane46', 'mangkane47', 'mangkane48', 'mangkane49', 'mangkane50', 'mangkane51', 'mangkane52', 'mangkane53', 'mangkane54'];
handler.tags = ['sound'];
handler.command = /^(mangkane25|mangkane26|mangkane27|mangkane28|mangkane29|mangkane30|mangkane31|mangkane32|mangkane33|mangkane34|mangkane35|mangkane36|mangkane37|mangkane38|mangkane39|mangkane40|mangkane41|mangkane42|mangkane43|mangkane44|mangkane45|mangkane46|mangkane47|mangkane48|mangkane49|mangkane50|mangkane51|mangkane52|mangkane53|mangkane54)$/i;
handler.limit = true;
handler.register = true;

export default handler;
