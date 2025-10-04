/**
- RANDOM QURAN + SOUND > Via APIKeys
- DIRECODE ULANG OLEH = KEVIN-ALAMSYAH
- WM BIARIN YA BANG☺️☺️
- YANG HAPUS WM TITID NYA ILANG..
- MASIH BERANTAKAN RAPIIN SENDIRI😁😅
- https://chat.whatsapp.com/KD9epQg7thxHH6CTm0Taw4
**/
import fetch from 'node-fetch';
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
let handler = async (m, { conn }) => {
  // Mengambil surah acak dari 1 sampai 114
  const randomSurah = getRandom(Array.from({ length: 114 }, (_, i) => i + 1));
  let json1 = await fetch(`https://api.quran.gading.dev/surah/${randomSurah}`);
  let result1 = await json1.json();

  // Mengambil ayat acak dari total ayat dalam surah
  let randomAyat = getRandom(
    Array.from({ length: result1.data.numberOfVerses }, (_, i) => i + 1)
  );
  let json = await fetch(
    `https://api.quran.gading.dev/surah/${randomSurah}/${randomAyat}`
  );
  let result = await json.json();
  let url = result.data.audio.primary || '';
  if (!url) {
    m.reply("Audio tidak tersedia untuk ayat ini.");
    return;
  }
  let kevin = `
*Random Quran*

Quran: ${result.data.surah.name.short}
Teks Latin: ${result.data.surah.name.translation.id}
Surat ke: ${result.data.surah.number}
Juz: ${result.data.meta.juz}
Total ayat: ${result.data.surah.numberOfVerses}
Ayat ke: ${result.data.number.inSurah}

Isi ayat: ${result.data.text.arab}

Latin: ${result.data.text.transliteration.en}

Arti dalam bahasa Indonesia: ${result.data.translation.id}

Arti dalam bahasa Inggris: ${result.data.translation.en}

Tafsir surah: ${result.data.tafsir.id.long}
`;
  m.reply(kevin);
  
  await conn.sendMessage(
    m.chat,
    { mimetype: "audio/mp4", audio: { url } },
    { quoted: m }
  );
};

handler.help = ["randomquran"];
handler.tags = ["islamic"];
handler.command = ["randomquran"];
handler.register = true;
handler.limit = true;

export default handler;