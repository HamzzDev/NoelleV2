import fetch from 'node-fetch';

// Plugins
const messages = [];

export const handler = async (m, { text, usedPrefix, command, conn }) => {
  try {
    if (!text) return m.reply(`The text is where?`);

    // React with a loading emoji
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const response = await fetch(`https://restapii.rioooxdzz.web.id/api/llama?message=${encodeURIComponent(text)}`);

    if (!response.ok) {
      throw new Error("Request to the API failed");
    }

    const result = await response.json();

    // Send bot response and react with a check emoji
    await conn.sendMessage(m.chat, {
      text: result.data.response,
    });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    messages.push({ role: "user", content: text });
  } catch (error) {
    // Handle error and react with an error emoji
    await conn.sendMessage(m.chat, {
      text: `Error: ${error.message}`,
    });
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
};

handler.help = ['ailama <pertanyaan>'];
handler.tags = ['ai'];
handler.command = /^(ailama)$/i;
handler.register = true;

export default handler;

// Case handling function
export const caseHandler = async (m, { text, conn }) => {
  try {
    if (!text) return m.reply(`The text is where?`);

    // React with a loading emoji
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const response = await fetch(`https://restapii.rioooxdzz.web.id/api/llama?message=${encodeURIComponent(text)}`);

    if (!response.ok) {
      throw new Error("Request to the API failed");
    }

    const result = await response.json();

    // Send bot response and react with a check emoji
    await conn.sendMessage(m.chat, {
      text: result.data.response,
    });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    messages.push({ role: "user", content: text });
  } catch (error) {
    // Handle error and react with an error emoji
    await conn.sendMessage(m.chat, {
      text: `Error: ${error.message}`,
    });
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
};