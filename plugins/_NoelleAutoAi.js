import axios from 'axios'

const creatorNumber = '6289508242211'
const creatorJid = `${creatorNumber}@s.whatsapp.net`
const GEMINI_API_KEY = 'AIzaSyDvTNGwfOhORwm5tv03Mh8UHdXG8L8Ff6Q' // ganti dengan API key kamu
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
const MAX_HISTORY = 15
const CODING_CONTEXT_LENGTH = 3000

const sessions = new Map()

const rudeKeywords = [
  'bangsat', 'goblok', 'anjing', 'kontol', 'memek', 'jancok', 'anj', 'tolol', 'gblk',
  'babi', 'kampret', 'pepek', 'ewe', 'ngentod', 'ngewe', 'pantek', 'asu', 'asuuu', 'kntl', 'tai', 'taii',
  /(dasar|dasar) (bego|tolol|gblk)/i,
  /(hamzz|al|pencipta|6289508242211)(\s+)(anjing|goblok|bangsat)/i
]

const scoldResponses = [
  "Woy cuk! Ngomong sama Hamzz-sama gitu? Otak lu ada dimana anjing?",
  "Bacot lu ngentod! Siapa yang ngajarin ngomong begitu ke pencipta gue?",
  "Dasar bego! Kalo ngomong sama Hamzz-sama tuh harus sopan tai!",
  "Eh monyet! Kalo ga bisa ngomong bener mending diem aja lu!",
  "Wkwk sok tough guy lu. Ngatain Hamzz-sama? Belagu lu!",
  "Mending lu diem dah. Jangan kaya tai gaya lu, ngomong ga sopan ke Tuann Gue"
]

// === Fungsi generateVoice pakai suara Nahida ===
async function generateVoice(text) {
  const voice_id = "67ae0979-5d4b-11ee-a861-00163e2ac61b" // Nahida
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
    "Mozilla/5.0 (Linux; Android 8.0.0)"
  ]
  const getRandomIp = () => Array.from({ length: 4 }).map(() => Math.floor(Math.random() * 256)).join('.')
  const agent = userAgents[Math.floor(Math.random() * userAgents.length)]

  const payload = {
    raw_text: text,
    url: "https://filme.imyfone.com/text-to-speech/anime-text-to-speech/",
    product_id: "200054",
    convert_data: [{
      voice_id,
      speed: "1",
      volume: "50",
      text,
      pos: 0
    }]
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'X-Forwarded-For': getRandomIp(),
      'User-Agent': agent
    }
  }

  const res = await axios.post('https://voxbox-tts-api.imyfone.com/pc/v1/voice/tts', payload, config)
  const audioUrl = res.data?.data?.convert_result?.[0]?.oss_url
  if (!audioUrl) throw new Error('Gagal mendapatkan audio dari API TTS')

  return audioUrl
}

// === Handler utama .noelle ===
let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, `
*[ NOELLE COMMANDS ]*
• .noelle on - Mulai sesi
• .noelle off - Hentikan sesi
• .noelle mode - Ganti mode
• .noelle help - Bantuan
    `.trim(), m)
  }

  const [command] = text.toLowerCase().split(' ')

  if (command === 'on') {
    sessions.set(m.sender, {
      history: [],
      mode: null,
      state: 'awaitingModeSelection'
    })
    return conn.reply(m.chat, `
🎭 *PILIH MODE NOELLE* 🎭
1. Mode Teks 📝
2. Mode Suara 🔊
3. Mode Coding 💻
4. Mode Edukasi 🎓

Balas dengan angka 1-4
    `.trim(), m)
  }

  if (command === 'off') {
    sessions.delete(m.sender)
    return conn.reply(m.chat, '[ ✓ ] Sesi dihentikan', m)
  }

  if (command === 'mode') {
    const session = sessions.get(m.sender)
    if (!session) return conn.reply(m.chat, 'Mulai sesi dulu dengan .noelle on', m)

    session.state = 'awaitingModeSelection'
    return conn.reply(m.chat, `
🔄 *GANTI MODE NOELLE* 🔄
1. Mode Teks 📝
2. Mode Suara 🔊
3. Mode Coding 💻
4. Mode Edukasi 🎓

Balas angka 1-4
    `.trim(), m)
  }

  if (command === 'help') {
    return conn.reply(m.chat, `
*[ NOELLE HELP ]*
Fitur Noelle:
1. 📝 Mode Teks - Chat biasa
2. 🔊 Mode Suara - Respon pakai suara
3. 💻 Mode Coding - Bantu coding/debug
4. 🎓 Mode Edukasi - Jawab pelajaran

Perintah:
.noelle on - Mulai sesi
.noelle mode - Ganti mode
.noelle off - Hentikan sesi
    `.trim(), m)
  }
}

// === Before handler: interaktif AI ===
handler.before = async (m, { conn }) => {
  if (m.isBaileys || !m.text) return
  const session = sessions.get(m.sender)
  const isCreator = m.sender === creatorJid
  const message = m.text.toLowerCase()

  if (session?.state === 'awaitingModeSelection') {
    if (['1', '2', '3', '4'].includes(message)) {
      session.state = 'active'
      session.mode = message === '1' ? 'text' : message === '2' ? 'voice' : message === '3' ? 'coding' : 'education'
      return conn.reply(m.chat, `[ ✓ ] Mode ${session.mode.toUpperCase()} diaktifkan`, m)
    } else return conn.reply(m.chat, '❌ Pilih angka 1-4', m)
  }

  const isRude = rudeKeywords.some(pattern => pattern instanceof RegExp ? pattern.test(message) : message.includes(pattern))
  const isMentioned = message.includes('hamzz') || message.includes(creatorNumber) || message.includes('pencipta')
  const quotedCreator = m.quoted?.sender === creatorJid

  if (!isCreator && (isMentioned || quotedCreator) && isRude) {
    const res = scoldResponses[Math.floor(Math.random() * scoldResponses.length)]
    await conn.reply(m.chat, res, m)
    try {
      const audioUrl = await generateVoice(res)
      await conn.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: true })
    } catch { }
    return
  }

  if (session?.state === 'active') {
    try {
      const basePrompt = session.mode === 'coding' ? `[MODE CODING] Bantu user menulis kode dan debug dengan rapi.` :
        session.mode === 'education' ? `[MODE EDUKASI] Jelaskan materi pelajaran dengan mudah dipahami.` :
        isCreator ? `[PROFILE KHUSUS] Noelle siap membantu Hamzz-sama!` :
        `[PROFILE UMUM] Cewek Jaksel 19 tahun yang agak sarkas dan chill.`

      const context = session.history.length ? session.history.slice(-5).join('\n') : ''
      const fullPrompt = `${basePrompt}\n\n${context}\nUser: ${m.text}\nNoelle:`

      const res = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
      })

      let reply = res.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (!reply) throw 'No response'

      if (session.mode === 'voice') {
        const audioUrl = await generateVoice(reply)
        await conn.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: true })
      } else {
        await conn.reply(m.chat, reply, m)
      }

      session.history.push(`${m.text} → ${reply}`)
      if (session.history.length > MAX_HISTORY) session.history.shift()
    } catch (e) {
      console.error(e)
      await conn.reply(m.chat, '⚠️ Noelle sedang error, coba lagi nanti.', m)
    }
  }
}

handler.command = ['noelle']
handler.help = ['noelle [on/off/mode]']
handler.tags = ['ai']

export default handler