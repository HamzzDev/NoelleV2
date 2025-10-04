import { watchFile, unwatchFile } from 'fs';
import 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
global.setting = {
  'clearSesi': false,
  'clearTmp': true,
  'addReply': true

};
global.limit = {
    premium: 'infinity',
    free: '30'
    };
global.info = {
  'nomerbot': "628981958555",
  'pairingNumber': "628981958555",
  'figlet': 'NOELLE',
  'nomorwa': "6289508242211",
  'nameown': "HamzzDev",
  'nomerown': "6289508242211",
  'packname': "ᴄʀᴇᴀᴛᴇᴅ ʙʏ",
  'author': "•´¯`•. Noelle-MD .•´¯`•",
  'namebot': "•´¯`•. Noelle-MD .•´¯`•",
  'wm': "Simple bot whatsapp 2024",
  'stickpack': "Whatsapp",
  'stickauth': "Bot - MD",
  'jid': '@s.whatsapp.net'
};
global.media = {
  'ppKosong': "https://i.ibb.co/3Fh9V6p/avatar-contact.png",
  'didyou': "https://telegra.ph/file/fdc1a8b08fe63520f4339.jpg",
  'rulesBot': "https://telegra.ph/file/afcfa712bd09f4fcf027a.jpg",
  'thumbnail': "https://telegra.ph/file/bb614844adc8e91ae2ce9.jpg",
  'thumb': "https://telegra.ph/file/89f925eaab0ab2d0f001a.jpg",
  'logo': "https://telegra.ph/file/bb614844adc8e91ae2ce9.jpg",
  'unReg': "https://telegra.ph/file/ef02d1fdd59082d05f08d.jpg",
  'registrasi': 'https://telegra.ph/file/0169f000c9ddc7c3315ff.jpg',
  'confess': "https://telegra.ph/file/03cabea082a122abfa5be.jpg",
  'access': "https://telegra.ph/file/5c35d4a180b9074a9f11b.jpg",
  'tqto': 'https://telegra.ph/file/221aba241e6ededad0fd5.jpg',
  'spotify': "https://telegra.ph/file/d888041549c7444f1212b.jpg",
  'weather': "https://telegra.ph/file/5b35ba4babe5e31595516.jpg",
  'gempaUrl': "https://telegra.ph/file/03e70dd45a9dc628d84c9.jpg",
  'akses': "https://telegra.ph/file/6c7b9ffbdfb0096e1db3e.jpg",
  'wel': "https://telegra.ph/file/9dbc9c39084df8691ebdd.mp4",
  'good': "https://telegra.ph/file/1c05b8c019fa525567d01.mp4",
  'sound': "https://files.catbox.moe/spx0qc.opus"
};
global.url = {
  'sig': "https://instagram.com/HamzzDev",
  'sgh': '-',
  'sgc': "https://chat.whatsapp.com/BC0OnvEO8Jk4bB37cEL8x1"
};
global.payment = {
  'psaweria': '-',
  'ptrakterr': '-',
  'pdana': '085717493023'
};
global.msg = {
  'wait': "▰▰▰▰▰▰▱▱ 98% 𝚠𝚊𝚒𝚝!!",
  'eror': "Mohon Maaf Server Kami Sedang Error!"
};
global.apiId = {
  'smm': '-',
  'lapak': '-'
};
global.api = {
  'user': '-',
  'screet': '-',
  'uptime': '-',
  'xyro': 'vRFLiyLPWu',
  'lol': "GataDios",
  'smm': '-',
  'lapak': '-',
  'prodia': "ca30661d-1df1-4855-a5bd-4daa5a987972",
  'bing': "12qV0YMFj2WcUsbyEz3Xbi4XqBpsV1t7W_0r1BQWDu2wZYit4d68vInmsyasdkJLcrE1NUkvugPdcABWV-AUa7iQeuoAyA1XYP5_V-VlqgVPTX8lrkFv7rDOVduM0EhTPlBOeU87aVHsSLZYrdqHMXhz2bdBgehv4i3CQ0ee15pEkMCos5lN2RJ3I8lbWc81nEd8UE_3jpByh6mbDjj23DQ"
};
global.APIs = {
  'nightTeam': "https://api.tioxy.my.id",
  'smm': "https://smmnusantara.id",
  'lapak': "https://panel.lapaksosmed.com"
};
global.APIKeys = {
  'nightTeam': "Kevin"
};
let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(_0x3d7f9.redBright("Update 'settings.js'"));
  import(file + "?update=" + Date.now());
});