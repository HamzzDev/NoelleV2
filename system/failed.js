export async function failed(type, m, conn) {

let msg = {
        premium: 'MAAF, FITUR INI HANYA DAPAT DIGUNAKAN OLEH PENGGUNA *PREMIUM*',
        group: 'FITUR INI HANYA DAPAT DIGUNAKAN DALAM GRUP',
        private: 'FITUR INI HANYA DAPAT DIGUNAKAN DALAM RUANG PRIBADI',       
        botAdmin: 'JADIKAN BOT SEBAGAI ADMIN, AGAR DAPAT MENGAKSES GRUP',
        admin: 'BUAT ADMIN, AGAR BISA AKSES KE GROUP',
        restrict: 'BATASAN TIDAK DIAKTIFKAN UNTUK CHAT INI',
        adminonly: 'FITUR TELAH DINONAKTIFKAN UNTUK ANGGOTA',
        premiumonly: `📢 KAMU TIDAK DAPAT MENGAKSES FITUR. BELI PREMIUM UNTUK MENGAKSES LEWAT PC. HUBUNGI OWNER DIBAWAH\nwa.me/${global.info.nomerown}`,
        groups: 'SAAT INI FITUR HANYA AKTIF UNTUK GRUP. SILAHKAN GUNAKAN FITUR BOT DI DALAM GRUP',
        gconly: `📢 KAMU TIDAK DAPAT MENGAKSES FITUR.JOIN GROUP BOT UNTUK MENDAPATKAN AKSES\n${global.url.sgc}`,
        game: 'FITUR *GAME* TIDAK DIAKTIFKAN UNTUK CHAT INI',
        rpg: 'FITUR *RPG* TIDAK DIAKTIFKAN UNTUK CHAT INI',
        rowner: 'FITUR KHUSUS REAL OWNER, *USER* TIDAK DAPAT MENGAKSES NYA',
        owner: 'FITUR KHUSUS OWNER, *USER* TIDAK DAPAT MENGAKSES NYA',
        mods: 'FITUR INI KHUSUS MODERATOR',
        unreg: `Kamu Belum Terdaftar\nDalam Database Kami.\n\nSilahkan Daftar Dengan Mengetik :\n> .Daftar Nama.umur\n> Umur Harus Berupa Angka.`
        }[type]
        
  if (msg) return conn.sendMessage(m.chat, {
      text: await style(msg, 1),
      contextInfo: {
      externalAdReply: {
      title: 'GAGAL MENGAKSES ✖️',
      body: 'Noelle-MultiDevs',
      thumbnailUrl: global.akses,
      sourceUrl: global.sgc,
      mediaType: 1,
      renderLargerThumbnail: true
      }}}, { quoted: m})
        
}