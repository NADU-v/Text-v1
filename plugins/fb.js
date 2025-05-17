
const {cmd , commands} = require('../command');
const {fetchJson} = require('../lib/functions');

const apikey = `sadiya`;

cmd({
    pattern: "fb",
    desc: "Downlord Fb Video.",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(!q) return reply("Please give me fb url");

const fb = await fetchJson(`https://sadiya-tech-apis.vercel.app/download/fbdl?url=${q}&apikey=${apikey}`);
let fbmsg = `*🎥 METHU MD FB DL.🎥*

*Title* - ${fb.result.title}`;

await conn.sendMessage(from, { image: {url: fb.result.thumb }, caption: fbmsg }, { quoted: mek });

await conn.sendMessage(from, { video: { url: fb.result.sd }, mimetype: "video/mp4", caption: `SD\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀᴅɪʏᴀ ᴛᴇᴄʜ*` }, { quoted: mek });
await conn.sendMessage(from, { video: { url: fb.result.hd }, mimetype: "video/mp4", caption: `HD\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀᴅɪʏᴀ ᴛᴇᴄʜ*` }, { quoted: mek });

}catch(e){
console.log(e)
reply(e)
}
})
