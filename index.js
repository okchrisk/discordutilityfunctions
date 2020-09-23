const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

const fs = require('fs'); // used to red/write from json file

// ========== CLIENT EVENTS ==========

// when the bot starts up
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// when a new user joins the discord
client.on("guildMemberAdd", member => {
    if (member.guild.systemChannel) {
        member.guild.systemChannel.send(`<@${member.user.id}>\n**Welcome**`);
    }
});

client.on('message', async (message) => {
    rename(message);
    deleteMessage(message);
    channelSendPictures(message);
});

// ========== UTILITY FUNCTIONS ==========

// Returns the number of files in a directory
const getAllDirFiles = function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        }
        else {
            arrayOfFiles.push(file);
        }
    })
    return arrayOfFiles;
}

// generates a random num between [min,max] inclusive
const roll = function (min, max) {
    if (!typeof min == `number` || !typeof max == `number`) {
        return false;
    }

    if (min < 0 || min > min) {
        return false;
    }

    return Math.floor(Math.random() * parseInt(max - min + 1)) + min;
}

// returns all voice channel IDs in the discord server
const getVoiceChannels = function () {
    const cache = JSON.parse(JSON.stringify(client.guilds.cache));
    const cachedChannels = cache[0].channels;
    var voiceChannelsArray = [];

    cachedChannels.forEach(function (channel) {
        var channelInfo = client.channels.cache.get(channel);
        if (Object.entries(channelInfo)[0][1] == "voice") {
            voiceChannelsArray.push(client.channels.cache.get(Object.entries(channelInfo)[2][1]));
        }
    });
    return voiceChannelsArray;
}

// returns userID of all users currently connected to a voice channel
const getConnectedUsers = function () {
    var usersArray = [];
    const currentlyConnectedCollection = getVoiceChannels()[0].guild.voiceStates.cache;
    currentlyConnectedCollection.forEach(function (user) {
        usersArray.push(user.id);
    })
    return usersArray;
}

// returns the discord user nickname if present, defaults to discord user profile name
const getNickname = function (userID) {
    var guildMembers = client.guilds.cache.first().members;
    var nickname = guildMembers.cache.get(`${userID}`).nickname;

    if (nickname != null) {
        return nickname;
    }

    var username = guildMembers.cache.get(`${userID}`).user.username
    return username;
}

// ========== CALLED FUNCTIONS ==========

// allows users to change their nickname 
function rename(message) {
    var name = "";

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift();
    if (command === `rename`) {

        // if input is blank
        if (!args.length) {
            return message.channel.send(`Invalid entry: You didn't provide a name.`);
        }

        args.forEach(word => {
            name += word + " ";
        });

        name.trim();

        // discord has a character limit of 32 characters for a nickname
        if (name.length > 32) {
            return message.channel.send(`Invalid entry: Name must be less than 32 characters.`)
        }

        message.member.setNickname(name);
        return message.channel.send(`<@${message.author.id}>, you have been renamed.`);

    }
}

// allows administrators to bulk delete messages
function deleteMessage(message) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift();

    if (command === `deletemessage`) {
        if (args.length != 1 || isNaN(args) || args < 1 || args > 25) {
            return message.channel.send(`Invalid entry: -deletemessage [1 - 25].`);
        }

        message.channel.messages.fetch({ limit: parseInt(args) + 1 }).then(messages => { // Fetches the messages
            message.channel.bulkDelete(messages) // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
        });
    }
}

// posts a random pictures from directory of saved images.
// Note: images must use the same file extension and must be named chronologically starting from 1 ... x
function channelSendPictures(message) {
    const petNames = JSON.parse(fs.readFileSync('json/petNames.json', 'utf-8'));

    for (var i = 0; i < petNames.length; i++) {
        if (message.content === `${prefix}${petNames[i]}`) {
            const name = petNames[i];
            const dirNumber = getAllDirFiles(`images/${name}/`).length;
            const rngImage = roll(1, dirNumber);
            return message.channel.send({ files: [`images/${name}/${rngImage}.jpg`] });
        }
    }
}

// allows the bot to login and connect to the server
client.login(token);
