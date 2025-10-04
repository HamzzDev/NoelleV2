import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

const brat = async (text) => {
    try {
        return await new Promise((resolve, reject) => {
            if (!text) return reject("Missing text input");
            const random = Math.floor(Math.random() * 8);
            const API = `https://fastrestapis.fasturl.cloud/maker/furbrat?text=${encodeURIComponent(text)}&style=${random}&position=center&mode=animated`;
            axios
                .get(API, {
                    responseType: "arraybuffer",
                })
                .then((res) => {
                    const image = Buffer.from(res.data);
                    if (image.length <= 10240) return reject("Failed to generate brat");
                    return resolve({
                        success: true,
                        image
                    });
                })
                .catch((e) => reject(e));
        });
    } catch (e) {
        return {
            success: false,
            errors: e
        };
    }
};

const cooldown = new Map();

const handler = async (m, {
    conn,
    text,
    usedPrefix
}) => {
    const user = m.sender;
    const cooldownTime = 10000; // 10 seconds
    const maxAttempts = 3;

    const quo = text || m.quoted?.text || m.quoted?.caption || null;
    if (!quo) return m.reply(`Use this command in the format: ${usedPrefix}furbrat <text>`);

    if (cooldown.has(user)) {
        const lastTime = cooldown.get(user);
        const elapsed = (Date.now() - lastTime) / 1000;

        if (elapsed < cooldownTime / 1000) {
            const attempts = global.db.data.users[user]?.attempts || 0;
            global.db.data.users[user] = {
                ...(global.db.data.users[user] || {}),
                attempts: attempts + 1
            };

            if (global.db.data.users[user].attempts >= maxAttempts) {
                global.db.data.users[user].banned = true;
                return m.reply("[❗] You have been banned for spamming!");
            }

            return m.reply(`[❗] Wait ${Math.ceil(cooldownTime / 1000 - elapsed)} seconds before using this command again.\n\n[ note ]\nIf you spam this feature 3 times during the cooldown, you will be banned from the bot!`);
        }
    }

    cooldown.set(user, Date.now());
    if (global.db.data.users[user]?.attempts) global.db.data.users[user].attempts = 0;

    try {
        conn.sendMessage(m.chat, {
            react: {
                text: '⏳',
                key: m.key
            }
        });
        const result = await brat(quo);
        if (!result.success) throw "Failed to create brat sticker";

        const sticker = new Sticker(result.image, {
            pack: 'Sticker By',
            author: 'Shizuka - MD :\nKevin-Devs',
            type: 'image/png',
        });
        const stickerBuffer = await sticker.toBuffer();
        await conn.sendMessage(m.chat, {
            sticker: stickerBuffer
        }, {
            quoted: m
        });
    } catch (error) {
        console.error('Error:', error);
        await conn.reply(m.chat, 'Sorry, an error occurred while trying to create the brat sticker. Please try again later.', m);
    }
};

handler.help = ['furbratgif'];
handler.tags = ['sticker'];
handler.command = /^furbratgif|furbratvid|furbratvideo$/i;
handler.limit = 3;
handler.register = true;

export default handler;