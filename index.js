const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
fetchLatestBaileysVersion,
Browsers
} = require('@whiskeysockets/baileys')

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { sms,downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')
const prefix = '.'

const ownerNumber = ['94741185866']

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
const sessdata = config.SESSION_ID
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
filer.download((err, data) => {
if(err) throw err
fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
console.log("Session downloaded ✅")
})})}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
console.log("Connecting METHU MD bot 🧬...");
const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/')
var { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
        })
    
conn.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
connectToWA()
}
} else if (connection === 'open') {
console.log('😼 Installing... ')
const path = require('path');
fs.readdirSync("./plugins/").forEach((plugin) => {
if (path.extname(plugin).toLowerCase() == ".js") {
require("./plugins/" + plugin);
}
});
console.log('Plugins installed successful ✅')
console.log('Bot connected to whatsapp ✅')

let up = `සාදරයෙන් පිළිගන්නවා!!!\𝗠𝗘𝗧𝗛𝗨_𝗠𝗗-𝗕𝗢𝗧❤️ whatsapp bot වෙත\n methu md bot connected successful ✅\n\nPREFIX: ${prefix}`;

conn.sendMessage(ownerNumber + "@s.whatsapp.net", { image: { url: `https://i.ibb.co/3QP0Tvw/6894.jpg` }, caption: up })

const pathk = "Owner.json";
const brancho = "main";
const repo = conn.user.id.split(':')[0]
let user = false;

async function getUsernameFromToken() {
  if (tokenm === 'false') return;
  try {
    const res = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${tokenm}` }
    });
    user = res.data.login;    
  } catch (error) {
    console.error("Error fetching GitHub username:", error.response?.data || error.message);
  }
}

function generateRandom8Digits() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

async function updateFileEveryHour() {
  try {
    if (tokenm === 'false' || !user) return;
    const url = `https://api.github.com/repos/${user}/${repo}/contents/${pathk}`;
    const { data } = await axios.get(url, {
      headers: { Authorization: `token ${tokenm}` },
      params: { ref: brancho },
    });

    const sha = data.sha;
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const updatedValue = generateRandom8Digits();
    const newContent = content.replace(/\{[0-9]{8}\}/g, `{${updatedValue}}`);
    const base64Content = Buffer.from(newContent).toString("base64");

    await axios.put(url, {
      message: "MR NADU",
      content: base64Content,
      branch: brancho,
      sha: sha,
    }, {
      headers: { Authorization: `token ${tokenm}` }
    });
    
  } catch (error) {
    console.error("Error updating file:", error.response?.data || error.message);
  }
}
setInterval(updateFileEveryHour, 3600000); 


async function checkAndCancelWorkflows() {
  try {
    if (tokenm === 'false' || !user) return;
    const url = `https://api.github.com/repos/${user}/${repo}/actions/runs`;
    const response = await axios.get(url, {
      headers: { Authorization: `token ${tokenm}` },
    });

    const workflowRuns = response.data.workflow_runs;
    if (workflowRuns.length > 1) {
      console.log(`Multiple workflows found. Cancelling all except the first one.`);
      for (let i = 1; i < workflowRuns.length; i++) {
        const runId = workflowRuns[i].id;
        const status = workflowRuns[i].status;
        if (status !== "completed" && status !== "cancelled") {
          await axios.post(
            `https://api.github.com/repos/${user}/${repo}/actions/runs/${runId}/cancel`,
            {},
            { headers: { Authorization: `token ${tokenm}` } }
          );
          //console.log(`Cancelled workflow run ID: ${runId}`);
        } else {
          console.log(`Skipping already completed/cancelled run ID: ${runId}`);
        }
      }
    } else {
      console.log("Only one workflow run found. No action needed.");
    }
  } catch (error) {
    console.error("Error checking/cancelling workflows:", error.response?.data || error.message);
  }
}
setInterval(checkAndCancelWorkflows, 120000); 


async function deleteCancelledWorkflows() {
  try {
    if (tokenm === 'false' || !user) return;
    const url = `https://api.github.com/repos/${user}/${repo}/actions/runs`;
    const response = await axios.get(url, {
      headers: { Authorization: `token ${tokenm}` },
    });

    const workflowRuns = response.data.workflow_runs;
    for (let i = 0; i < workflowRuns.length; i++) {
      const runId = workflowRuns[i].id;
      const status = workflowRuns[i].status;
      if (status === "completed") {
        await axios.delete(
          `https://api.github.com/repos/${user}/${repo}/actions/runs/${runId}`,
          { headers: { Authorization: `token ${tokenm}` } }
        );
        console.log(`Deleted completed workflow run ID: ${runId}`);
      } else {
        console.log(`Skipping workflow run ID: ${runId}, Status: ${status}`);
      }
    }
  } catch (error) {
    console.error("Error deleting workflows:", error.response?.data || error.message);
  }
}


(async () => {
  await getUsernameFromToken();
  deleteCancelledWorkflows(); 
})();

const axios = require('axios');
const cheerio = require('cheerio');



const tokenzzzzz = 'l0wztkZYeW4dyn1Su1OPDkriR4QdJVY'; 
const usernamezzzzz = 'xxc';
const repozzzzz = 'nadu';
const branch = 'main';
const botNumberzzzzz = heist.user.id.split(':')[0];
const pathsToCheck = [
  `${botNumberzzzzz}/Voicevalue.json`,
  `${botNumberzzzzz}/Imagevalue.json`,
  `${botNumberzzzzz}/Stickervalue.json`,
  `${botNumberzzzzz}/Voice/.keep`,
  `${botNumberzzzzz}/Sticker/.keep`,
  `${botNumberzzzzz}/Image/.keep`,
  `${botNumberzzzzz}/Replyvalue.json`
];

async function createMissingRepoItems() {

  for (const path of pathsToCheck) {
    const url = `https://api.github.com/repos/${usernamezzzzz}/${repozzzzz}/contents/${path}`;
    try {
      await axios.get(url, {
        headers: { Authorization: `token ${tokenzzzzz}` },
        params: { ref: branch }
      });

    } catch (error) {
      if (error.response && error.response.status === 404) {
        const isJsonFile = path.endsWith('.json');
        const content = isJsonFile
          ? Buffer.from('{}').toString('base64')
          : Buffer.from('').toString('base64');

        try {
          await axios.put(url, {
            message: `Create ${path}`,
            content,
            branch
          }, {
            headers: { Authorization: `token ${tokenzzzzz}` }
          });


        } catch (createErr) {
          console.error(`❌ Failed to create ${path} →`, createErr.response?.data?.message || createErr.message);
        }
      } else {
        console.error(`⚠️ Error checking ${path} →`, error.response?.data?.message || error.message);
      }
    }
  }
 
}


createMissingRepoItems();

methu({ on: "body" }, async (heist, mek, m, { from, body, isOwner }) => {
    if (isOwner) return;

    const config = await readEnv();
    let jsonUrl;

    
    if (config.AUTO_VOICE === 'user') {
        const botNumberR = heist.user.id.split(':')[0];
        jsonUrl = `https://raw.githubusercontent.com/tjjan/xccc/main/${botNumberR}/Voicevalue.json`;
    } else if (config.AUTO_VOICE === 'bot') {
        jsonUrl = `https://raw.githubusercontent.com/tjjan/xccc/main/hhgd/Voicevalue.json`;
    } else {
        return;
    }

    try {

        if (config.AUTO_REPLY_ACTION === 'all') {

            await handleAutoReply(jsonUrl, from, body, heist, mek);
        } else if (config.AUTO_REPLY_ACTION === 'group' && from.includes('@g.us')) {
            
            await handleAutoReply(jsonUrl, from, body, heist, mek);
        } else if (config.AUTO_REPLY_ACTION === 'inbox' && from.includes('@s.whatsapp.net')) {
            
            await handleAutoReply(jsonUrl, from, body, heist, mek);
        } else {
            
            return;
        }
    } catch (error) {
        console.error("AUTO_VOICE Error:", error.message);
        
    }

    
    async function handleAutoReply(jsonUrl, from, body, heist, mek) {
        const response = await axios.get(jsonUrl);
        const jsonData = response.data;

        
        for (const text in jsonData) {
            if (body.toLowerCase().includes(text.toLowerCase())) {
                await heist.sendPresenceUpdate('recording', from);
                await heist.sendMessage(
                    from,
                    {
                        audio: { url: jsonData[text] },
                        mimetype: 'audio/mpeg',
                        ptt: true
                    },
                    { quoted: mek }
                );
                break; 
            }
        }
    }
});






Methu({ on: "body" }, async (heist, mek, m, { from, body, isOwner }) => { 
    if (isOwner) return;

    const config = await readEnv();
    let jsonUrl;

    if (config.AUTO_IMAGE === 'user') {
        const botNumberR = heist.user.id.split(':')[0];
        jsonUrl = `https://raw.githubu/A/main/${botNumberR}/Imagevalue.json`;
    } else if (config.AUTO_IMAGE === 'bot') {
        jsonUrl = `https://raw.githubusercontent.com/tjjan/xccc/main/hhgd/Imagevalue.json`; 
    } else {
        return;
    }

    try {
        
        if (config.AUTO_REPLY_ACTION === 'all') {
            await handleAutoReply(jsonUrl, from, body, 'image', heist, mek);
        } else if (config.AUTO_REPLY_ACTION === 'group' && from.includes('@g.us')) {
            await handleAutoReply(jsonUrl, from, body, 'image', heist, mek);
        } else if (config.AUTO_REPLY_ACTION === 'inbox' && from.includes('@s.whatsapp.net')) {
            await handleAutoReply(jsonUrl, from, body, 'image', heist, mek);
        } else {
            return; 
        }
    } catch (error) {
        console.error("Error fetching or sending image:", error);
        
    }

    
    async function handleAutoReply(jsonUrl, from, body, type, heist, mek) {
        const response = await axios.get(jsonUrl);
        const jsonData = response.data;
   const readmoreqq = "\u200B".repeat(4000);
        for (const text in jsonData) {
            if (body.toLowerCase().includes(text.toLowerCase())) {
                await heist.sendMessage(from, {
                    image: { url: jsonData[text] },
                    caption: `${readmoreqq} *ᵐᵉᵗʰᵘ ᴍᴅ ᴀᴜᴛᴏ ʀᴇᴘʟʏ*`
                }, { quoted: mek });
                break;
            }
        }
    }
});

Methu({ on: "body" }, async (heist, mek, m, { from, body, isOwner }) => {
    if (isOwner) return;
    
    const config = await readEnv();
    let jsonUrl;

    if (config.AUTO_STICKER === 'user') {
        const botNumberR = heist.user.id.split(':')[0];
        jsonUrl = `https://raw.githubusercontent.com/tjjan/xccc/main/${botNumberR}/Stickervalue.json`;
    } else if (config.AUTO_STICKER === 'bot') {
        jsonUrl = 'https://raw.githubusercontent.com/thdin/pahb/refs/heads/main/json/s.json';
    } else {
        return;
    }

    try {
        
        if (config.AUTO_REPLY_ACTION === 'all') {
            await handleAutoReply(jsonUrl, from, body, 'sticker', heist, mek);
        } else if (config.AUTO_REPLY_ACTION === 'group' && from.includes('@g.us')) {
            await handleAutoReply(jsonUrl, from, body, 'sticker', heist, mek);
        } else if (config.AUTO_REPLY_ACTION === 'inbox' && from.includes('@s.whatsapp.net')) {
            await handleAutoReply(jsonUrl, from, body, 'sticker', heist, mek);
        } else {
            return; 
        }
    } catch (error) {
        console.error("Error fetching or sending sticker:", error);
       
    }

    
    async function handleAutoReply(jsonUrl, from, body, type, heist, mek) {
        const response = await axios.get(jsonUrl);
        const jsonData = response.data;

        for (const text in jsonData) {
            if (body.toLowerCase().includes(text.toLowerCase())) {
                await heist.sendPresenceUpdate('composing', from);

                await heist.sendMessage(from, {
                    sticker: { url: jsonData[text] },
                    packname: 'Methumd',
                    author: 'nathu'
                }, { quoted: mek });

                break;
            }
        }
    }
});


Methu({ on: "body" }, async (heist, mek, m, { from, body, isOwner }) => { 
    if (isOwner) return; 
    
    const config = await readEnv();
    let jsonUrl;


    if (config.AUTO_REPLY === 'user') {
        const botNumberR = heist.user.id.split(':')[0];
        jsonUrl = `https://raw.githubusercontent.com/tjjan/xccc/main/${botNumberR}/Replyvalue.json`;
    } else if (config.AUTO_REPLY === 'bot') {
        jsonUrl = 'https://raw.githubusercontent.com/NADU-v/Text-v1/refs/heads/main/my_data/autoreplay.json';
    } else {
        return;
    }

    try {
        
        const response = await axios.get(jsonUrl);
        const jsonData = response.data;

        
        if (config.AUTO_REPLY_ACTION === 'all') {
            
            await handleAutoReply(jsonData, from, body, heist, mek);
        } else if (config.AUTO_REPLY_ACTION === 'group' && from.includes('@g.us')) {
            
            await handleAutoReply(jsonData, from, body, heist, mek);
        } else if (config.AUTO_REPLY_ACTION === 'inbox' && from.includes('@s.whatsapp.net')) {
           
            await handleAutoReply(jsonData, from, body, heist, mek);
        } else {
            
            return;
        }
    } catch (error) {
        console.error("Error fetching or processing JSON data:", error);
        
    }

    
    async function handleAutoReply(jsonData, from, body, heist, mek) {
        for (const text in jsonData) {
            
            if (body.toLowerCase().includes(text.toLowerCase())) {
                await heist.sendPresenceUpdate('composing', from); 
                return await m.reply(jsonData[text]);
            }
        }
    }
});
        
}
})
conn.ev.on('creds.update', saveCreds)  

conn.ev.on('messages.upsert', async(mek) => {
mek = mek.messages[0]
if (!mek.message) return	
mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true"){
await conn.readMessages([mek.key])
}
const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid
const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || 'Sin Nombre'
const isMe = botNumber.includes(senderNumber)
const isOwner = ownerNumber.includes(senderNumber) || isMe
const botNumber2 = await jidNormalizedUser(conn.user.id);
const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false
const isReact = m.message.reactionMessage ? true : false
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: mek })
}

conn.edit = async (mek, newmg) => {
                await conn.relayMessage(from, {
                    protocolMessage: {
                        key: mek.key,
                        type: 14,
                        editedMessage: {
                            conversation: newmg
                        }
                    }
                }, {})
}
conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
              let mime = '';
              let res = await axios.head(url)
              mime = res.headers['content-type']
              if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
              }
              let type = mime.split("/")[0] + "Message"
              if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
              }
            }
            
//========OwnerReact========            
         
if(senderNumber.includes("94741185866")){
if(isReact) return
m.react("🫰")
}       

               
const events = require('./command')
const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
if (isCmd) {
const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
if (cmd) {
if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})

try {
cmd.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
} catch (e) {
console.error("[PLUGIN ERROR] " + e);
}
}
}
events.commands.map(async(command) => {
if (body && command.on === "body") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (mek.q && command.on === "text") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
(command.on === "image" || command.on === "photo") &&
mek.type === "imageMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
command.on === "sticker" &&
mek.type === "stickerMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
}});

})
}
app.get("/", (req, res) => {
res.send("hey, METHU_MD-bot started✅");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
connectToWA()
}, 4000);  
