const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

const urlRegex = new RegExp(
    'https?:\\/\\/' +
    '(www\\.)?' +
    '[-a-zA-Z0-9@:%._\\+~#=]{1,256}' +
    '\\.[a-zA-Z0-9()]{1,6}' +
    '\\b' +
    '([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)','i');

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, message => {
    if(message.channelId == "448984025776783371" && message.attachments.size < 1 && !urlRegex.test(message.content)) {
        message.delete();
    }

    if(message.channelId == "910744722144886794" && !message.content.includes("https://www.speedrun.com/goiwbf/runs/")) {
        message.delete();
    }
});

client.login(token);