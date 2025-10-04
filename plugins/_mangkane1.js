import fetch from 'node-fetch'

const fkontak = { 
    // Definisikan detail kontak yang Anda butuhkan di sini
    // Contoh:
    "key": {
        "fromMe": false,
        "participant": "0@s.whatsapp.net",
        "remoteJid": "0@s.whatsapp.net"
    },
    "message": {
        "contactMessage": {
            "displayName": "Example Contact",
            "vcard": "BEGIN:VCARD\nVERSION:3.0\nN:;\nFN:Example Contact\nitem1.TEL;waid=1234567890:+1234567890\nitem1.X-ABLabel:Mobile\nEND:VCARD"
        }
    }
};

const handler = async (m, { conn, command }) => {
    m.reply('Jangan lupa nyawer ke noelle ya~xixi..');
    let audio = `https://raw.githubusercontent.com/hyuura/Rest-Sound/main/HyuuraKane/${command}.mp3`;

    await conn.sendFile(m.chat, audio, 'error.mp3', null, fkontak, true, {
        type: 'audioMessage', 
        ptt: false, 
        seconds: 0,
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                mediaUrl: sig,
                mediaType: 2, 
                description: sig,
                title: "Sedang Memutar Lagu..",
                body: wm,
                thumbnail: await (await fetch('https://files.catbox.moe/k6mkuk.jpg')).buffer(),
                sourceUrl: sig,
            }
        }
    });
};

handler.help = ['mangkane1', 'mangkane2', 'mangkane3', 'mangkane4', 'mangkane5', 'mangkane6', 'mangkane7', 'mangkane8', 'mangkane9', 'mangkane10', 'mangkane11', 'mangkane12', 'mangkane13', 'mangkane14', 'mangkane15', 'mangkane16', 'mangkane17', 'mangkane18', 'mangkane19', 'mangkane20', 'mangkane21', 'mangkane22', 'mangkane23', 'mangkane24'];
handler.tags = ['sound'];
handler.command = /^(mangkane1|mangkane2|mangkane3|mangkane4|mangkane5|mangkane6|mangkane7|mangkane8|mangkane9|mangkane10|mangkane11|mangkane12|mangkane13|mangkane14|mangkane15|mangkane16|mangkane17|mangkane18|mangkane19|mangkane20|mangkane21|mangkane22|mangkane23|mangkane24)$/i;
handler.limit = true;
handler.register = true;

export default handler;

