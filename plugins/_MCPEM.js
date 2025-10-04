import axios from 'axios';
import cheerio from 'cheerio';

// INI WM CUY BY PUTRAMODZ JANGAN DI HAPUS
// My Group https://chat.whatsapp.com/Gl5ALz9UkSOFHzJFRqdgd2
const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `Gunakan perintah berikut:\n\n${usedPrefix}${command} <opsi>\n\n*Opsi yang tersedia:*\n- latest: Tampilkan mod terbaru.\n- random: Tampilkan mod acak.\n- detail <link>: Lihat detail mod dari link.\n\nContoh:\n${usedPrefix}${command} random\n${usedPrefix}${command} detail <link>`,
            m
        );
    }

    let args = text.split(" ");
    let opsi = args[0].toLowerCase();

    if (opsi === "latest") {
        let mods = await latestModsMinecraft();
        if (!mods.length) {
            return conn.reply(m.chat, "Tidak ada data mod terbaru yang ditemukan.", m);
        }

        let message = `*Mod Minecraft Terbaru*\n\n${mods
            .map(
                (mod, i) =>
                    `${i + 1}. *${mod.title}*\nDeskripsi: ${mod.description}\nLink: ${mod.link}\nImage: ${mod.image}`
            )
            .join("\n\n")}`;
        return conn.reply(m.chat, message, m);
    } else if (opsi === "random") {
        let mods = await modsMinecraftRandom();
        if (!mods.length) {
            return conn.reply(m.chat, "Tidak ada data mod acak yang ditemukan.", m);
        }

        let message = `*Mod Minecraft Acak*\n\n${mods
            .map(
                (mod, i) =>
                    `${i + 1}. *${mod.title}*\nDeskripsi: ${mod.description}\nLink: ${mod.link}\nImage: ${mod.image}`
            )
            .join("\n\n")}`;
        return conn.reply(m.chat, message, m);
    } else if (opsi === "detail") {
        let url = args[1];
        if (!url) {
            return conn.reply(m.chat, `Masukkan link detail mod. Contoh:\n\n${usedPrefix}${command} detail <link>`, m);
        }

        let details = await detailModsMinecraft(url);
        if (typeof details === "string") {
            return conn.reply(m.chat, `Gagal mengambil detail. Error:\n\n${details}`, m);
        }

        let message = `*Detail Mod Minecraft*\n\nJudul: ${details.title}\nDeskripsi: ${details.description}\nLink Download: ${details.downloadLink}\nImage: ${details.image}`;
        return conn.reply(m.chat, message, m);
    } else {
        return conn.reply(
            m.chat,
            `Opsi tidak valid. Gunakan salah satu dari berikut:\n- latest\n- random\n- detail <link>`,
            m
        );
    }
};

handler.help = ["minecraftmods <opsi>"];
handler.tags = ["internet"];
handler.command = ["minecraftmods"];
handler.limit = true;

export default handler;

// Fungsi Scraper by Hann
async function modsMinecraftRandom() {
    try {
        let randomPage = Math.floor(Math.random() * 120);
        const response = await axios.get(`https://tlauncher.org/en/mods_2/${randomPage}/`, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        const mods = [];
        const $ = cheerio.load(response.data);
        $("article.b-anons").each((i, element) => {
            const title = $(element).find("h2 a span").text();
            const link = $(element).find("h2 a").attr("href");
            const image = $(element).find("img").attr("src");
            const description = $(element).find("p").text().trim();

            mods.push({
                title,
                link: `https://tlauncher.org${link}`,
                image,
                description,
            });
        });

        return mods;
    } catch (error) {
        return [];
    }
}

async function detailModsMinecraft(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        const $ = cheerio.load(response.data);
        const result = {
            title: $("h1").text(),
            image: "https://tlauncher.org" + $("img").first().attr("src"),
            description: $("article.single-content").find("p").first().text().trim(),
            downloadLink: $("a.b-button_modal").attr("href"),
        };

        return result;
    } catch (error) {
        return error.message;
    }
}

async function latestModsMinecraft() {
    try {
        const response = await axios.get(`https://tlauncher.org/en/mods_2/`, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        const mods = [];
        const $ = cheerio.load(response.data);
        $("article.b-anons").each((i, element) => {
            const title = $(element).find("h2 a span").text();
            const link = $(element).find("h2 a").attr("href");
            const image = $(element).find("img").attr("src");
            const description = $(element).find("p").text().trim();

            mods.push({
                title,
                link: `https://tlauncher.org${link}`,
                image,
                description,
            });
        });

        return mods;
    } catch (error) {
        return [];
    }
}