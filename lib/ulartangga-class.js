import Jimp from 'jimp';
import axios from 'axios';

export class SnakeLadder {
  constructor(chat, playerIds) {
    this.chat = chat;
    this.players = playerIds.map(id => ({ id, move: 1 }));
    this.turn = 0;
    this.id = '';
    this.time = Date.now();
    this.map = {
      url: 'https://raw.githubusercontent.com/nazedev/database/master/games/images/snake-ladder-board.jpg',
      move: {
        4: 14, 8: 30, 21: 42, 28: 76,
        32: 10, 36: 6, 48: 26, 50: 67,
        62: 18, 71: 92, 80: 99, 87: 24,
        95: 56, 98: 78
      }
    };
  }

  rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  nextTurn() {
    this.turn = (this.turn + 1) % this.players.length;
  }

  async drawBoard(url, players) {
    try {
      // Ambil buffer gambar dari URL dengan axios
      const { data } = await axios.get(url, { responseType: 'arraybuffer' });
      const board = await Jimp.read(data);
      const colors = [0xff0000ff, 0x0000ffff, 0xffff00ff, 0x00ff00ff]; // Merah, Biru, Kuning, Hijau

      for (let i = 0; i < players.length; i++) {
        const pos = players[i].move;
        const { x, y } = this.getXY(pos);
        const circle = new Jimp(16, 16, colors[i]);
        board.composite(circle, x, y);
      }

      return await board.getBufferAsync(Jimp.MIME_JPEG);
    } catch (e) {
      console.error('❌ Gagal menggambar papan:', e);
      throw new Error('Gagal memuat gambar papan dari URL');
    }
  }

  getXY(pos) {
    const row = Math.floor((pos - 1) / 10);
    let col = (pos - 1) % 10;
    if (row % 2 === 1) col = 9 - col; // zigzag
    const x = col * 50 + 30;
    const y = (9 - row) * 50 + 30;
    return { x, y };
  }
}