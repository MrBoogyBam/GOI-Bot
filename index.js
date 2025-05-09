const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildInvites] });
const invites = new Map();

const urlRegex = new RegExp(
    'https?:\\/\\/' +
    '(www\\.)?' +
    '[-a-zA-Z0-9@:%._\\+~#=]{1,256}' +
    '\\.[a-zA-Z0-9()]{1,6}' +
    '\\b' +
    '([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)','i');

const philipRegex = /(.*(f|ph)il.*ip.*|.*poop.*|.*ppworld.*)/gi

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    for (const [id, guild] of client.guilds.cache) {
        try {
            const guildInvites = await guild.invites.fetch();
            invites.set(id, new Map(guildInvites.map(invite => [invite.code, invite.uses])));
        } catch (err) {
            console.error(`Could not fetch invites for ${guild.name}:`, err);
        }
    }
});

client.on(Events.MessageCreate, message => {
    if(message.author.bot) return;

    if(message.channelId == "1370399083503812698" && message.attachments.size < 1 && !urlRegex.test(message.content)) {
        message.delete();
    }

    if(message.channelId == "1370421150009524256" && !message.content.includes("https://www.speedrun.com/goiwbf/runs/")) {
        message.delete();
    }
});

client.on(Events.GuildMemberAdd, async (member) => {
    accountAge = Date.now() - member.user.createdAt;

    if(accountAge < 1000 * 60 * 60 * 24 * 7) {
        member.ban({ reason: "account age under 7 days" });

        return;
    }

    if(philipRegex.test(member.user.username)) {
        member.ban();
    }
})

client.login(token);