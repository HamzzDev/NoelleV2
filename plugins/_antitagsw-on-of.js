let handler = async (
    m, {
        isAdmin,
        isOwner,
        isBotAdmin,
        conn,
        args,
        usedPrefix,
        command
    },
) => {
    global.db = global.db || { data: { chats: {} } };
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};
    let chat = global.db.data.chats[m.chat];
    let prefix = usedPrefix;
    let successMsg = `*[ ✓ ] Anti Tag Status berhasil diaktifkan untuk grup ini.*`.trim();

    let isEnable = {
        on: true,
        off: false,
    }[args[0]?.toLowerCase() || ""];

    if (isEnable === undefined) {
        let usageMsg = `*[ ${command.toUpperCase()} EXAMPLE ]*:
> *• Contoh :* ${usedPrefix + command} on
> *• Contoh :* ${usedPrefix + command} off`;
        m.reply(usageMsg);
        throw false;
    } else if (isEnable === false) {
        chat.antitagsw = false;
        await m.reply("*[ ✓ ] Anti Tag Status berhasil dimatikan untuk grup ini.*");
    } else if (isEnable === true) {
        chat.antitagsw = true;
        await m.reply(successMsg);
    }
};

handler.help = ["antitagsw *[on/off]*"];
handler.tags = ["group"];
handler.command = ["antitagsw"];
handler.group = true;
handler.admin = true;
handler.botAdmin = false;

export default handler;