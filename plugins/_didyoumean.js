import didyoumean from 'didyoumean'
import similarity from 'similarity'
import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn, usedPrefix }) {
  try {
    if (!m.text || typeof m.text !== 'string') return

    const prefix = usedPrefix || m.text[0]
    if (!/^[!.#\\/+=~?%^&*@-]/.test(prefix)) return

    const [cmdRaw] = m.text.slice(prefix.length).trim().split(/\s+/)
    const command = cmdRaw.toLowerCase()

    // Cari apakah command cocok dengan plugin manapun
    const allPlugins = Object.entries(global.plugins).filter(([_, plugin]) => !plugin.disabled)
    const matchedPlugin = allPlugins.find(([_, plugin]) =>
      plugin.command instanceof RegExp
        ? plugin.command.test(command)
        : Array.isArray(plugin.command)
        ? plugin.command.some(c => new RegExp(c).test(command))
        : typeof plugin.command === 'string'
        ? new RegExp(plugin.command).test(command)
        : false
    )

    // Jika ada plugin cocok, berarti command valid, jangan munculkan autocorrect
    if (matchedPlugin) return

    // Kumpulan semua command dari help (hanya untuk usulan)
    const allCommands = allPlugins.flatMap(([_, plugin]) =>
      plugin.help?.map(cmd => cmd.toLowerCase()) || []
    )

    if (allCommands.includes(command)) return // Command valid

    const suggestion = didyoumean(command, allCommands)
    if (!suggestion) return

    const score = similarity(command, suggestion)
    if (score < 0.4) return

    const percent = parseInt(score * 100)
    const caption = `
┌───〔🔍 *Pencarian Command* 〕
│ ❓ Yang kamu ketik: *${prefix + command}*
│ ✅ Maksudmu: *${prefix + suggestion}*
│ 📊 Kemiripan: *${percent}%*
├─────────────────────
│ 💡 Gunakan *.allmenu* untuk
│    melihat semua fitur!
└────`.trim()

    const img = await fetch('https://files.catbox.moe/3don4u.jpg').then(res => res.buffer())
    await conn.sendFile(m.chat, img, 'notfound.jpg', caption, m)

  } catch (err) {
    console.error('[❌ Autocorrect Error]', err)
  }
}

export default handler