import axios from "axios";
import * as cheerio from "cheerio";

async function sightDetails(url) {
  try {
    const ress = await axios.get(url);
    const $ = cheerio.load(ress.data);

    const title = $("h1.elementor-heading-title").text().trim();
    const author = $(".elementor-post-info__item--type-author").text().trim();
    const date = $(".elementor-post-info__item--type-date time").text().trim();
    const content = $(".elementor-widget-container p")
      .map((_, el) => $(el).text().trim())
      .get()
      .join("\n\n");
    const image =
      $("img.size-full.wp-image-130814").attr("src") ||
      "https://via.placeholder.com/300";
    const tags = $(".elementor-post-info__terms-list-item")
      .map((i, el) => $(el).text().trim())
      .get();

    return {
      success: true,
      author: "@Selxyz",
      result: { title, author, date, content, image, tags },
      request_at: new Date(),
    };
  } catch (error) {
    console.error("Error fetching article details:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

let handler = async (m, { text }) => {
  if (!text) {
    return m.reply("*Harap masukkan URL artikel untuk mendapatkan detail.*");
  }

  const result = await sightDetails(text);

  if (!result.success) {
    return m.reply(`*Gagal mengambil detail artikel: ${result.error}*`);
  }

  const { title, author, date, content, image, tags } = result.result;

  let response = `## 📖 Detail Artikel dari Sight Magazine\n\n`;
  response += `### **${title}**\n`;
  response += `- ✍️ **Penulis**: ${author || "Tidak tersedia"}\n`;
  response += `- 🗓️ **Tanggal**: ${date || "Tidak tersedia"}\n`;
  response += `- 🏷️ **Tag**: ${tags.length > 0 ? tags.join(", ") : "Tidak tersedia"}\n\n`;
  response += `![Gambar Artikel](${image})\n\n`;
  response += `### 📜 **Isi Artikel**\n`;
  response += `${content || "Tidak tersedia"}\n`;

  m.reply(response.trim());
};

handler.tags = ["berita"];
handler.command = ["sightmagazinedetail"];
handler.help = ["sightmagazinedetail <url artikel>"];

export default handler;