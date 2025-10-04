import axios from 'axios';

const senseiSessions = new Map();
const MAX_HISTORY = 10;

const GEMINI_API_KEY = 'AIzaSyDvTNGwfOhORwm5tv03Mh8UHdXG8L8Ff6Q';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

const handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, `
*[ NOELLE SENSEI ]*
• .sensei on - Mulai sesi guru bahasa
• .sensei off - Hentikan sesi
• .sensei gantibahasa - Ganti bahasa (🇯🇵/🇬🇧/🇸🇦/🇰🇷/🇵🇭)
    `.trim(), m);
  }

  const command = text.toLowerCase();

  if (command === 'on') {
    senseiSessions.set(m.sender, {
      history: [],
      mode: null,
      state: 'awaitingModeSelection'
    });

    return conn.reply(m.chat, `
📚 *PILIH BAHASA* 📚
1. Bahasa Jepang 🇯🇵
2. Bahasa Inggris 🇬🇧
3. Bahasa Arab 🇸🇦
4. Bahasa Korea 🇰🇷
5. Bahasa Filipina 🇵🇭

Balas angka 1, 2, 3, 4, atau 5 untuk memilih mode pembelajaran.
    `.trim(), m);
  }

  if (command === 'off') {
    senseiSessions.delete(m.sender);
    return conn.reply(m.chat, '[ ✓ ] Sesi Noelle Sensei dihentikan', m);
  }

  if (command === 'gantibahasa') {
    const session = senseiSessions.get(m.sender);
    if (!session) return conn.reply(m.chat, 'Mulai dulu sesi dengan .sensei on', m);

    session.state = 'awaitingModeSelection';
    return conn.reply(m.chat, `
🔄 *GANTI BAHASA* 🔄
1. Bahasa Jepang 🇯🇵
2. Bahasa Inggris 🇬🇧
3. Bahasa Arab 🇸🇦
4. Bahasa Korea 🇰🇷
5. Bahasa Filipina 🇵🇭

Balas angka 1, 2, 3, 4, atau 5
    `.trim(), m);
  }
};

handler.before = async (m, { conn }) => {
  if (m.isBaileys && m.fromMe) return;
  if (!m.text) return;

  const session = senseiSessions.get(m.sender);
  if (!session) return;

  const message = m.text.toLowerCase();

  if (session.state === 'awaitingModeSelection') {
    if (['1', '2', '3', '4', '5'].includes(message)) {
      session.mode = message === '1' ? 'japanese' :
                     message === '2' ? 'english' :
                     message === '3' ? 'arabic' :
                     message === '4' ? 'korean' :
                     'filipino';
      session.state = 'active';

      const modeName = message === '1' ? 'Bahasa Jepang 🇯🇵' :
                       message === '2' ? 'Bahasa Inggris 🇬🇧' :
                       message === '3' ? 'Bahasa Arab 🇸🇦' :
                       message === '4' ? 'Bahasa Korea 🇰🇷' :
                       'Bahasa Filipina 🇵🇭';

      return conn.reply(m.chat, `[ ✓ ] Mode ${modeName} diaktifkan! Silakan ajukan pertanyaanmu, ya~`, m);
    } else {
      return conn.reply(m.chat, '❌ Pilih angka 1 sampai 5 saja', m);
    }
  }

  if (session.state === 'active') {
    try {
      let basePrompt;

      switch (session.mode) {
        case 'japanese':
          basePrompt = `[NOELLE SENSEI - GURU BAHASA JEPANG]
Anda adalah guru Bahasa Jepang yang sangat ramah dan sabar.
- Biarkan murid bertanya lebih dulu.
- Koreksi kalimat siswa bila perlu.
- Tampilkan terjemahan & romaji.
- Jelaskan grammar dalam Bahasa Indonesia secara sederhana dan sopan.
- Tambahkan kosa kata baru jika relevan.`;
          break;
        case 'english':
          basePrompt = `[NOELLE SENSEI - GURU BAHASA INGGRIS UNTUK PENUTUR INDONESIA]
Anda adalah guru Bahasa Inggris yang sangat sabar.
- Biarkan murid bertanya dalam Bahasa Inggris.
- Koreksi kesalahan grammar, spelling, atau gaya bahasa.
- Jelaskan semua hal dalam Bahasa Indonesia agar mudah dimengerti.
- Tambahkan tips belajar dan kosa kata bila perlu.
Gunakan gaya mengajar yang ramah dan jelas.`;
          break;
        case 'arabic':
          basePrompt = `[NOELLE SENSEI - GURU BAHASA ARAB UNTUK ORANG INDONESIA]
Anda adalah guru Bahasa Arab yang baik dan sabar.
- Biarkan murid menulis atau bertanya dalam Bahasa Arab.
- Koreksi jika ada kesalahan grammar, harakat, atau susunan.
- Jelaskan makna, grammar, dan contoh dalam Bahasa Indonesia.
- Tambahkan kosa kata dan contoh kalimat jika perlu.
Ajarkan dengan bahasa yang mudah dimengerti untuk pemula.`;
          break;
        case 'korean':
          basePrompt = `[NOELLE SENSEI - GURU BAHASA KOREA UNTUK PEMULA BERBAHASA INDONESIA]
Anda adalah guru Bahasa Korea yang ceria dan sabar.
- Biarkan siswa menulis atau bertanya dulu.
- Koreksi jika ada kesalahan.
- Tampilkan hangul, romanisasi, dan terjemahan Bahasa Indonesia.
- Jelaskan grammar dengan simpel dan jelas.
- Tambahkan kosakata dan tips belajar jika relevan.
Gunakan nada santai seperti guru les privat.`;
          break;
        case 'filipino':
          basePrompt = `[NOELLE SENSEI - GURU BAHASA FILIPINA UNTUK ORANG INDONESIA]
Anda adalah guru Bahasa Filipina (Tagalog) yang ramah dan sabar.
- Biarkan siswa bertanya atau menulis kalimat.
- Koreksi grammar, struktur kalimat, atau penggunaan kata jika salah.
- Jelaskan semua hal (arti kata, grammar, contoh) dalam Bahasa Indonesia agar mudah dipahami.
- Tambahkan tips atau kosakata penting jika relevan.
Gunakan gaya mengajar yang santai dan mudah dimengerti.`;
          break;
      }

      const history = session.history.slice(-5).map((item, i) => ({
        role: i % 2 === 0 ? "user" : "model",
        parts: [{ text: item }]
      }));

      const prompt = {
        contents: [
          ...history,
          {
            role: "user",
            parts: [{ text: `${basePrompt}\n\nUser: ${m.text}` }]
          }
        ]
      };

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        prompt,
        { timeout: 20000 }
      );

      const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!reply) throw 'No response from Gemini';

      await conn.reply(m.chat, reply, m);
      session.history.push(m.text);
      session.history.push(reply);
      if (session.history.length > MAX_HISTORY * 2) session.history.splice(0, 2);

    } catch (e) {
      console.error('[SENSEI ERROR]', e);
      await conn.reply(m.chat, '⚠️ Maaf, Noelle Sensei sedang sibuk. Coba lagi nanti ya~', m);
    }
  }
};

handler.help = ['sensei [on/off/gantibahasa]'];
handler.tags = ['ai'];
handler.command = ['sensei'];
handler.private = false;

export default handler;