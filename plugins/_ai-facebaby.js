import fetch from "node-fetch"

let handler = async (m, { usedPrefix, command, text, conn }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix + command} boy url1,url2`);

    let [gender, urls] = text.split(" ");
    if (!gender || !["boy", "girl"].includes(gender.toLowerCase())) {
        return m.reply("Pilih gender 'boy' atau 'girl'.");
    }

    if (!urls) return m.reply("Pastikan Anda memberikan dua URL yang valid dipisahkan dengan koma!");
    let [url1, url2] = urls.split(",").map(part => part.trim());
    if (!url1 || !url2) return m.reply("Anda harus memasukkan dua URL yang valid, dipisahkan dengan koma.");

    const apiKey = "FanzOffc";
    let attempt = 0;
    const maxAttempts = 20;
    let response = null;
    let errorLogs = [];

    m.reply("Tunggu proses pembuatan baby 😂👉🍍...");

    while (attempt < maxAttempts) {
        attempt++;
        try {
            response = await fetch(
                `https://api.fanzoffc.eu.org/api/facebaby?bapak=${encodeURIComponent(url1)}&emak=${encodeURIComponent(url2)}&gender=${encodeURIComponent(gender)}&apikey=${apiKey}`
            );
            let result = await response.json();

            if (result.status && result.resultImageUrl) {
                let imgUrl = result.resultImageUrl;

                await conn.sendMessage(
                    m.chat,
                    { image: { url: imgUrl }, mimetype: 'image/jpeg' },
                    { quoted: m }
                );
                return;
            } else {
                throw new Error(result.message || "Gagal mendapatkan hasil facebaby.");
            }
        } catch (e) {
            errorLogs.push(`Attempt ${attempt}: ${e.message}`);
            console.error(`Error on attempt ${attempt}:`, e);
            if (attempt === maxAttempts) {
                m.reply("Terjadi kesalahan setelah beberapa percobaan. Silakan coba lagi nanti.");
                console.log("Error logs:", errorLogs);
            }
        }
    }
};

handler.help = ["facebaby"];
handler.command = ["facebaby"];
handler.tags = ["ai"];
handler.limit = true
handler.register = true

export default handler