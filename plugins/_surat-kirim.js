import PDFDocument from 'pdfkit'
import { createWriteStream } from 'fs'
import { suratCache } from '../lib/cache.js' // Import cache shared

export const before = async (m, { conn }) => {
  const teks = m.text?.trim() || ''
  if (!teks.startsWith('.surat-kirim')) return

  const pilihan = teks.split(' ')[1]?.toLowerCase()
  const isi = suratCache[m.sender] // Gunakan cache shared

  if (!isi) {
    return conn.reply(
      m.chat, 
      '- [x] Kirim sebagai Teks\n- [ ] Tidak ada surat yang bisa dikirim. Gunakan .surat terlebih dahulu.', 
      m
    )
  }

  if (pilihan === 'teks') {
    await conn.reply(m.chat, isi, m)
    delete suratCache[m.sender] // Hapus cache setelah dikirim
    return
  }

  if (pilihan === 'pdf') {
    const filename = `/tmp/surat-${Date.now()}.pdf`
    const doc = new PDFDocument()
    
    doc.pipe(createWriteStream(filename))
    doc.font('Times-Roman').fontSize(12).text(isi, { align: 'left' })
    doc.end()

    await conn.sendMessage(
      m.chat,
      {
        document: { url: filename },
        fileName: 'surat.pdf',
        mimetype: 'application/pdf'
      },
      { quoted: m }
    )
    delete suratCache[m.sender] // Hapus cache setelah dikirim
    return
  }
}