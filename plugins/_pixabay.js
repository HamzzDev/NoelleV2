import axios from 'axios';

// Function to format the number
async function formatNumber(integer) {
  let numb = parseInt(integer);
  return Number(numb).toLocaleString().replace(/,/g, '.');
}

let handler = async (m, { conn, text, prefix, command }) => {
  if (!text) {
    return m.reply(`*• Example :* .${command} *[type query]*

List Type:
* *Image*
* *Video*`);
  }

  let keyword = text.split(" ")[0];
  let data = text.slice(keyword.length + 1);

  if (keyword.toLowerCase() === "image") {
    if (!data) return m.reply(`*• Example :* .${command} image *[query]*`);

    let res = await (await axios.get("https://pixabay.com/api/?key=30089426-4575ed7bbbc8bfffe9a0b8eb4&q=" + data)).data;
    let rand = res.hits[Math.floor(Math.random() * res.hits.length)];

    let cap = `*± P I X - A B A Y*
* *Type :* ${rand.type}
* *Tags :* ${rand.tags}
* *Size :* ${rand.imageWidth} x ${rand.imageHeight}
* *Views :* ${await formatNumber(rand.views)}
* *Likes :* ${await formatNumber(rand.likes)}
* *Comments :* ${await formatNumber(rand.comments)}
* *Downloads :* ${await formatNumber(rand.downloads)}
* *Username :* ${rand.user} *[ ${rand.user_id} ]*`;

    await conn.sendMessage(m.chat, {
      image: { url: rand.largeImageURL },
      caption: cap
    }, { quoted: m });

  } else if (keyword.toLowerCase() === "video") {
    if (!data) return m.reply(`*• Example :* .${command} video *[query]*`);

    let res = await (await axios.get("https://pixabay.com/api/videos?key=30089426-4575ed7bbbc8bfffe9a0b8eb4&q=" + data)).data;
    let rand = res.hits[Math.floor(Math.random() * res.hits.length)];

    let cap = `*± P I X - A B A Y*
* *Type :* ${rand.type}
* *Tags :* ${rand.tags}
* *Duration :* ${rand.duration} seconds
* *Views :* ${await formatNumber(rand.views)}
* *Likes :* ${await formatNumber(rand.likes)}
* *Comments :* ${await formatNumber(rand.comments)}
* *Downloads :* ${await formatNumber(rand.downloads)}
* *Username :* ${rand.user} *[ ${rand.user_id} ]*`;

    await conn.sendMessage(m.chat, {
      video: { url: rand.videos["medium"].url },
      caption: cap,
      gifPlayback: true
    }, { quoted: m });
  }
};

handler.help = ['pixabay']; 
handler.tags = ['ai'];
handler.command = /^(pixabay)/i;
handler.register = true;
handler.limit = true;

export default handler;