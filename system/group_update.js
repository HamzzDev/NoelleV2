import canvafy from "canvafy"

export async function participantsUpdate({ id, participants, action }) {
    if (opts['self'])
        return
    if (conn.isInit)
        return
    if (global.db.data == null)
        await loadDatabase()
    let chat = global.db.data.chats[id] || {}
    let templ = global.db.data.settings[conn.user.jid]  
    
    let text = ''
    switch (action) {

        case 'add':
            if (chat.welcome) {
                let groupMetadata = await conn.groupMetadata(id) || (conn.chats[id] || {}).metadata
                let member = groupMetadata.participants.length
                let gpname = await conn.getName(id)
                                              
                for (let user of participants) {
                    let pp = ppKosong
                    let ppgc = ppKosong
                    
                    try {
                        pp = await conn.profilePictureUrl(user, 'image')
                        ppgc = await conn.profilePictureUrl(id, 'image')
                        
                    } catch (e) {
                    } finally {
                        text = (chat.sWelcome || conn.welcome || 'Welcome, @user!').replace('@user', '@' + user.split('@')[0]).replace('@subject', await conn.getName(id)).replace('@member', member).replace('@desc', groupMetadata.desc?.toString() || 'unknow')
                            
const canWel = await new canvafy.WelcomeLeave()
    .setAvatar(pp)
    .setBackground("image", "https://telegra.ph/file/39ef0462ab2a3cc5ebfcc.jpg")
    .setTitle("Welcome")
    .setDescription(`Selamat datang di Grup ${groupMetadata.subject}`)
    .setBorder("#2a2e35")
    .setAvatarBorder("#2a2e35")
    .setOverlayOpacity(0.3)
    .build();
let xnxx = canWel
if (templ.gcImg) {

    conn.sendMessage(id, {
        text: text,
        contextInfo: {
        mentionedJid: [user],
            externalAdReply: {
                title: 'W E L C O M E',
                body: '',
                thumbnail: xnxx,
                sourceUrl: sgc,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    })

} else if (templ.gcGif) {

    conn.sendMessage(id, {
        video: {
            url: wel,
        },
        gifPlayback: true,
        caption: text,
    })

} else if (templ.gcTeks) {

    conn.reply(id, text, null,{contextInfo: {
    mentionedJid: [user]
    }})

} else if (templ.gcDoc) {

    conn.sendMessage(id, {
        document: fs.readFileSync("./package.json"),
        fileName: 'W E L C O M E',
        fileLength: 100000000000,
        pageCount: "1000",
        caption: '',
        contextInfo: {
        mentionedJid: [user],
            externalAdReply: {
                containsAutoReply: true,
                mediaType: 1,
                mediaUrl: 'https://telegra.ph/file/74abb87ac6082571db546.jpg',
                renderLargerThumbnail: true,
                showAdAttribution: true,
                sourceUrl: null,
                thumbnailUrl: pp,
                title: 'W E L C O M E',
                body: `Member ke-${member}`,
            },
        },
    });
}
      
                    }
                }
            }
            
            break 
            case 'remove':
            if (chat.bye) {
        let groupMetadata = await conn.groupMetadata(id) || (conn.chats[id] || {}).metadata;
        let totalMembers = groupMetadata.participants.length;
        let remainingMembers = totalMembers - 1;  // Mengurangi 1 karena ada anggota yang keluar
        let gpname = await conn.getName(id);

        for (let user of participants) {
            let pp = ppKosong;
            let ppgc = ppKosong;
            
            try {
                pp = await conn.profilePictureUrl(user, 'image');
                ppgc = await conn.profilePictureUrl(id, 'image');
            } catch (e) {
                // Error handling jika foto profil tidak ditemukan
            } finally {
                // Pesan yang akan dikirim
                text = (chat.sBye || conn.bye || 'Bye, @user!').replace('@user', '@' + user.split('@')[0])
                    .replace('@subject', await conn.getName(id))
                    .replace('@member', remainingMembers)  // Menampilkan jumlah anggota yang tersisa
                    .replace('@desc', await groupMetadata.desc?.toString() || 'unknown');
                
                const canLea = await new canvafy.WelcomeLeave()
                    .setAvatar(pp)
                    .setBackground("image", "https://telegra.ph/file/39ef0462ab2a3cc5ebfcc.jpg")
                    .setTitle("Goodbye")
                    .setDescription("Selamat jalan kawan!")
                    .setBorder("#2a2e35")
                    .setAvatarBorder("#2a2e35")
                    .setOverlayOpacity(0.3)
                    .build();

                let xnxx = canLea;
                
                if (templ.gcImg) {
                    conn.sendMessage(id, {
                        text: text,
                        contextInfo: {
                            mentionedJid: [user],
                            externalAdReply: {
                                title: 'G O O D B Y E',
                                body: '',
                                thumbnail: xnxx,
                                sourceUrl: sgc,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    });
                } else if (templ.gcGif) {
                    conn.sendMessage(id, {
                        video: {
                            url: good
                        },
                        gifPlayback: true,
                        caption: text,
                    });
                } else if (templ.gcTeks) {
                    conn.reply(id, text, null, {
                        contextInfo: {
                            mentionedJid: [user]
                        }
                    });
                } else if (templ.gcDoc) {
                    conn.sendMessage(id, {
                        document: fs.readFileSync("./package.json"),
                        fileName: 'G O O D B Y E',
                        fileLength: 100000000000,
                        pageCount: "1000",
                        caption: '',
                        contextInfo: {
                            mentionedJid: [user],
                            externalAdReply: {
                                containsAutoReply: true,
                                mediaType: 1,
                                mediaUrl: 'https://telegra.ph/file/74abb87ac6082571db546.jpg',
                                renderLargerThumbnail: true,
                                showAdAttribution: true,
                                sourceUrl: null,
                                thumbnailUrl: pp,
                                title: 'G O O D B Y E',
                                body: `Member ke- ${remainingMembers}`,  // Menampilkan jumlah anggota yang tersisa
                            },
                        },
                    });
                }
            }
        }
    }
break;
}
}
export async function groupsUpdate(groupsUpdate) {
    if (opts['self'])
        return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id], text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (!text) continue
        await conn.sendMessage(id, { text: text })
    }
}

export async function deleteUpdate(message) {
    try {
    
        const { fromMe, id, remoteJid, participant} = message
        if (fromMe)
            return
        let msg = conn.serializeM(conn.loadMessage(id))
        if (!msg)
            return
        if (!msg.isGroup) return;
        let chat = global.db.data.chats[msg.chat]
    
        if (chat.delete) {
        await conn.reply(msg.chat, `
Terdeteksi si @${participant.split(`@`)[0]} telah menghapus pesan barusan

> Untuk mematikan fitur ini, ketik
*.disable antidelete*
`.trim(), msg, {contextInfo: {
            mentionedJid: [participant]
            }
        })
        conn.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))
        }
    } catch (e) {
        console.error(e)
    }
}

export async function callUpdate(callUpdates) {
  let bot = global.db.data.settings[conn.user.jid];
  if (!bot.antiCall) return;
  for (const usr of callUpdates) {
  
    if (!usr.isGroup && usr.status === "offer" && usr.from !== global.nomerown + "@s.whatsapp.net") {
      const jenisPanggilan = usr.isVideo ? "panggilan video" : "panggilan suara";
      const pesan = `🚫 *Anti Call* 🚫\
*@${usr.from.split("@")[0]}* kamu telah melakukan \`${jenisPanggilan}\` terhadap *Bot* (kamu terbanned dan terblokir).\n\nJika ini adalah kesalahan, silakan hubungi owner:\n• https://wa.me/${global.nomerown}`;
      global.db.data.users[usr.from].banned = true;
      await conn.reply(usr.from, pesan, false, {
        contextInfo: {mentionedJid: [usr.from] }
      })
      await conn.updateBlockStatus(usr.from, "block").then(() => conn.rejectCall(usr.id, usr.from))
    }
  }
}