const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("group-participants.update", async (data) => {
    try {
      if (data.action !== "add") return;

      for (const user of data.participants) {
        const msg = `🎉 Welcome @${user.split("@")[0]} 🎉

ᴱᴳᴼ͢ Family me aapka swagat hai!

📌 GROUP RULE

✅ Sabhi members ko apne NAME ke AAGE
「ᴱᴳᴼ͢」 lagana compulsory hai.

Example:
ᴱᴳᴼ͢ Rahul
ᴱᴳᴼ͢ Aman

⚠️ Rule follow na karne par warning ya remove kiya ja sakta hai.

❤️ Respect • Unity • Discipline`;

        await sock.sendMessage(
          data.id,
          {
            text: msg,
            mentions: [user]
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
}

startBot();