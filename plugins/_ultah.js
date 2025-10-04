let lastCheckTime = 0; // Inisialisasi dengan nilai 0 atau bisa dengan Date.now()

const checkBirthday = async (conn) => {
    const now = new Date();
    const today = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;

    const users = global.db.data.ultah || {};
    let objek = Object.keys(users);
    if (!objek.length) global.db.data.ultah = {};  // Memastikan data ultah terinisialisasi sebagai objek kosong jika belum ada.

    global.birthdayMessages = [];

    for (let ob of objek) {
        let ultah = users[ob];
        if (ultah.date.startsWith(today)) {
            birthdayMessages.push({
                userId: ob,
                message: `🎉 Selamat Ulang Tahun, @${ob.split('@')[0]}! 🎂\nHarapan: ${ultah.isi}`
            });
        }
    }

    for (let { userId, message } of birthdayMessages) {
        await conn.sendMessage(userId, { text: message, contextInfo: { mentionedJid: [userId] } });
    }
};

export async function before(m, {conn}) {
    const interval = 24 * 60 * 60 * 1000;  // 24 jam dalam milidetik
    const now = Date.now();

    // Mengecek apakah waktu saat ini sudah melebihi interval dari pengecekan terakhir
    if (now - lastCheckTime >= interval) {
        await checkBirthday(conn);
        lastCheckTime = now;  // Memperbarui waktu pengecekan terakhir
    }
};