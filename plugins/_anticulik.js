import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = m => m;

handler.all = async function (m, { isBlocked }) {
    if (isBlocked) return;

    // Deteksi pesan yang berawalan https://chat.whatsapp.com
    if (m.text && m.text.startsWith('https://chat.whatsapp.com') && !m.isBaileys && !m.isGroup) {
        // Kirim gambar dengan caption
        const imagePath = path.join(__dirname, '../image/Logo.jpg');
        const image = fs.readFileSync(imagePath);
        await this.sendFile(m.chat, image, 'Logo.jpg', 'Ngapain? Mau Sewa?😹\n\nChat Ownerku Aja Kak, Nih Nomernya Dibawah👇');

        // Buat VCARD untuk kontak owner
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:HamzzStore\nTEL;type=CELL;type=VOICE;waid=6289508242211:+62 895-0824-2211\nEND:VCARD`;

        // Kirim kontak owner dengan VCARD
        await this.sendMessage(m.chat, {
            contacts: {
                displayName: 'HamzzStore',
                contacts: [{ vcard }]
            }
        }, { quoted: m });
    }
}

export default handler;