import axios from 'axios';
import Tesseract from 'tesseract.js';
import Yts from 'yt-search';
import Vreden from '@vreden/youtube_scraper';
import { GoogleGenAI, Modality } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyDU6yxdT-C5YhK9Le063f4Zi_s1WsCU3-k' });

const handler = m => m;

handler.before = async function (m, { conn }) {
    if (m.text?.startsWith('.')) return;

    const isNoelleMentioned = /(Noelle|noell|nell|ell|silva|noelle silva)/i.test(m.text);
    if (!isNoelleMentioned) return;

    const text = m.text.toLowerCase();

    if (/lagu|musik|putar|play/i.test(text) && !/gambar/i.test(text)) {
        try {
            const query = text.replace(/noelle|lagu|musik|putar|play|tolong/gi, '').trim();
            if (!query || query.length < 2) return m.reply("Lagu apa yang Noelle harus carikan, ne~? 🎵");

            await conn.sendMessage(m.chat, { text: "Baiklah, tunggu sebentar ya~ aku carikan lagunya... 🎶" }, { quoted: m });

            const res = await Yts(query);
            const video = res.all?.find(v => v.type === 'video');
            if (!video) return m.reply(`Maaf, Noelle tidak menemukan lagu berjudul: *${query}* 😿`);

            const audio = await Vreden.ytmp3(video.url, '128');
            const stream = await fetch(audio.download.url).then(res => res.buffer());

            await conn.sendMessage(m.chat, {
                audio: stream,
                mimetype: "audio/mp4",
                fileName: `${video.title}.mp3`,
                caption: `🎧 *${video.title}*\n📡 128kbps`,
                contextInfo: {
                    externalAdReply: {
                        title: video.title,
                        body: 'Noelle Music Assistant',
                        thumbnailUrl: video.image,
                        sourceUrl: video.url,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });

            return;
        } catch (e) {
            return m.reply("Noelle gagal memutar lagu ini... maaf yaa 😥");
        }
    }

    if (/buatkan|bikin/i.test(text) && !m.quoted?.mimetype?.startsWith('image/')) {
        try {
            const desc = text.replace(/noelle|buatkan|bikin|gambar/gi, '').trim();
            if (!desc || desc.length < 3) return m.reply("Deskripsinya terlalu singkat, ne~ kasih contoh kayak 'cewek anime rambut ungu' ✨");

            await conn.sendMessage(m.chat, { text: "Noelle sedang membuat gambarnya, tunggu sebentar ya~ 🎨" }, { quoted: m });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-image-generation",
                contents: desc,
                config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
            });

            const parts = response.candidates?.[0]?.content?.parts || [];
            const imagePart = parts.find(p => p.inlineData);
            const imageBuffer = Buffer.from(imagePart?.inlineData?.data || "", 'base64');

            await conn.sendMessage(m.chat, {
                image: imageBuffer,
                caption: desc
            }, { quoted: m });

            return;
        } catch (e) {
            return m.reply("Aduh... Noelle gagal menggambar nih, coba nanti lagi yaa 😢");
        }
    }

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let imageDescription = '';
    let ocrText = '';
    let translatedText = '';

    await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key } });

    if (/image\/(jpe?g|png)/.test(mime)) {
        try {
            let imgBuffer = await q.download();

            try {
                const result = await Tesseract.recognize(imgBuffer, 'ind+eng');
                ocrText = result.data.text.trim();
            } catch (e) {
                ocrText = '';
            }

            try {
                let base64Img = imgBuffer.toString('base64');
                let base64Url = `data:${mime};base64,${base64Img}`;

                let { data } = await axios.post('https://imageprompt.org/api/ai/prompts/image',
                    { base64Url },
                    { headers: { 'accept': '/', 'content-type': 'application/json' } }
                );

                if (data?.prompt) imageDescription = data.prompt;
            } catch (e) {}

            const textToTranslate = `${ocrText}\n${imageDescription}`.trim();
            if (textToTranslate) {
                try {
                    const res = await axios.post("https://translate.googleapis.com/translate_a/single", null, {
                        params: {
                            client: "gtx",
                            sl: "auto",
                            tl: "id",
                            dt: "t",
                            q: textToTranslate
                        }
                    });
                    translatedText = res.data?.[0]?.map(x => x[0]).join(' ');
                } catch (e) {}
            }

        } catch (e) {}
    }

    const isAskingQuestion = /(jawab(kan)?|soal|berapakah|tentukan|hitung|solve|answer|apa jawaban)/i.test(m.text);
    const isImage = !!imageDescription || !!ocrText;

    const prompt = isImage
        ? isAskingQuestion
            ? `
Gambar ini tampaknya berisi soal atau pertanyaan.

Deskripsi visual AI: "${imageDescription || 'Tidak tersedia'}"
Teks terbaca (OCR): "${ocrText || 'Tidak terbaca'}"
Terjemahan: "${translatedText || 'Tidak tersedia'}"

User berkata: "${m.text}"

Jawablah soal tersebut secara jelas, logis, dan profesional. Sertakan langkah-langkah jika diperlukan. Jangan gunakan gaya anime.
            `
            : `
Gambar ini menggambarkan:

Deskripsi visual AI: "${imageDescription || 'Tidak tersedia'}"
Teks OCR: "${ocrText || 'Tidak terbaca'}"
Terjemahan: "${translatedText || 'Tidak tersedia'}"

User berkata: "${m.text}"

Berikan penjelasan tentang gambar di atas secara objektif dan profesional. Fokus pada isi pesan atau konteks visual gambar tersebut.
            `
        : `
Kamu adalah Noelle Silva, seorang gadis anime yang imut dan kalem.

Gaya bicaramu:
- Lembut, manis, dan sedikit formal
- Jangan terlalu sering pakai kata seperti "desu~", "ne", dan emoji 😊, sesekali saja boleh
- Tetap sopan dan tidak lebay

User berkata: "${m.text}"

Jawablah dengan gaya Noelle yang imut dan ramah ya 💖
        `;

    try {
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDvTNGwfOhORwm5tv03Mh8UHdXG8L8Ff6Q`, {
            contents: [{ parts: [{ text: prompt }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (result) {
            await conn.sendMessage(m.chat, {
                text: result,
                contextInfo: {
                    externalAdReply: {
                        title: 'Noelle-MD',
                        body: 'Powered By HamzzDev',
                        thumbnailUrl: 'https://files.catbox.moe/806i3f.jpg',
                        sourceUrl: '',
                        mediaType: 1,
                        renderLargerThumbnail: true,
                    }
                }
            }, { quoted: m });
        } else {
            return m.reply('Maaf, aku gak ngerti maksudnya 😥');
        }
    } catch (error) {
        return m.reply('Aduh... ada yang error pas jawab, maaf ya >_<');
    }
};

export default handler;