// author: Rayner Kristanto

const Discord = require('discord.js');
const client = new Discord.Client();

const people = [
    "Ashr",
    "Bruce",
    "Lauretta",
    "Reid",
    "Karl",
    "Vi",
    "Peter",
    "Rayner",
]

const answers = [
    "Yea!",
    "No",
]
function getRandomPinnedMessage(message) {
    message.channel.fetchPinnedMessages()
    .then(messages => {
        if (messages && messages.size > 0) {
            let randomMessage = messages.random(1)[0];
            let attachments = [];
            randomMessage.attachments.forEach(attachment => {
                attachments.push(attachment.url);
            });

            message.channel.send(randomMessage.content, {
                files: attachments
            });
        }
    })
    .catch(console.error);;
}
const cfi = 0;
exports.handleMessage = function handleMessage(message, words) {
    if (words[cfi].toLowerCase() === '!who') {
        message.channel.sendMessage(people[Math.floor(Math.random() * people.length)]);
    }

    if(words[cfi].toLowerCase() === '!will' || words[cfi].toLowerCase() === '!should' || words[cfi].toLowerCase() === '!are' || words[cfi].toLowerCase() === '!do'|| words[cfi].toLowerCase() === '!am' || words[cfi].toLowerCase() === '!is') {
        message.channel.sendMessage(answers[Math.floor(Math.random() * answers.length)]);
    }
    if(words[cfi].toLowerCase() === '!memory') {
        getRandomPinnedMessage(message);
    }

    // for (let i = 0; i < words.length; i++) {
    //
    //     // For Ashr
    //     if (words[i].toLowerCase() === 'ashr') {
    //         message.channel.sendTTSMessage("~ashr is an alien");
    //     }
    // }
}
