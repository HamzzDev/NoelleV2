export async function before(m, { dbBot, conn }) {
    if (m.key.remoteJid != 'status@broadcast') return;

    conn.story = conn.story ? conn.story : [];

    const { mtype, text, sender } = m;
    const name = m.sender.split('@')[0];
    const chat = dbBot[conn.user.jid] || {};

    if (!chat.viewStory) return;

    // Fungsi untuk mendapatkan emoji acak
    async function emoji() {
        let emo = [
            "😀", "😂", "😍", "🥺", "😎", "😢", "😡", "😱", "👍", "👎",
            "👏", "💪", "🙏", "🎉", "🎂", "🌟", "🌈", "🔥", "🍎", "🍕",
            "🍔", "🍟", "🍣", "🍜", "🎸", "🎧", "🎤", "🎬", "🏆", "⚽",
            "🏀", "🏈", "🏊", "🚴", "🚗", "✈️", "🚀", "🚂", "🏠", "🌍"
        ];

        let randomIndex = Math.floor(Math.random() * emo.length);
        return emo[randomIndex];
    }

    // Proses jika pesan adalah gambar atau video
    if (mtype === 'imageMessage' || mtype === 'videoMessage') {
        const caption = text ? text : '';
        try {
            await conn.readMessages([m.key]);
            let buffer = await m.download();
            await conn.sendFile(nomerown + info.jid, buffer, '', caption, m, false, {
                mentions: [m.sender]
            });
            // Kirim reaksi emoji acak
            await conn.sendMessage(m.key.remoteJid, { react: { text: await emoji(), key: m.key } }, { statusJidList: [m.key.participant, m.sender] });
            
            // Simpan pesan dalam conn.story
            conn.story.push({
                type: mtype,
                quoted: m,
                sender: m.sender,
                caption: caption,
                buffer: buffer
            });
        } catch (e) {
            console.log(e);
            await conn.reply(nomerown + info.jid, caption, m, {
                mentions: [m.sender]
            });
        }

    // Proses jika pesan adalah audio
    } else if (mtype === 'audioMessage') {
        try {
            await conn.readMessages([m.key]);
            let buffer = await m.download();
            await conn.sendFile(nomerown + info.jid, buffer, '', '', m, false, {
                mimetype: m.mimetype
            });
            // Kirim reaksi emoji acak
            await conn.sendMessage(m.key.remoteJid, { react: { text: await emoji(), key: m.key } }, { statusJidList: [m.key.participant, m.sender] });
            
            // Simpan pesan dalam conn.story
            conn.story.push({
                type: mtype,
                quoted: m,
                sender: m.sender,
                buffer: buffer
            });
        } catch (e) {
            console.log(e);
        }

    // Proses jika pesan adalah teks
    } else if (mtype === 'extendedTextMessage') {
        const pesan = text ? text : '';
        await conn.readMessages([m.key]);
        await conn.reply(nomerown + info.jid, pesan, m, {
            mentions: [m.sender]
        });
        // Kirim reaksi emoji acak
        await conn.sendMessage(m.key.remoteJid, { react: { text: await emoji(), key: m.key } }, { statusJidList: [m.key.participant, m.sender] });
        
        // Simpan pesan dalam conn.story
        conn.story.push({
            type: mtype,
            quoted: m,
            sender: m.sender,
            message: pesan
        });
    }
}