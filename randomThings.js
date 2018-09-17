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
const cfi = 0;
exports.handleMessage = function handleMessage(message, words) {
    if (words[cfi].toLowerCase() === '!who') {
        message.channel.sendMessage(people[Math.floor(Math.random() * people.length)]);
    }

    if(words[cfi].toLowerCase() === '!will' || words[cfi].toLowerCase() === '!should' || words[cfi].toLowerCase() === '!are' || words[cfi].toLowerCase() === '!do'|| words[cfi].toLowerCase() === '!am' || words[cfi].toLowerCase() === '!is') {
        message.channel.sendMessage(answers[Math.floor(Math.random() * answers.length)]);
    }
    // for (let i = 0; i < words.length; i++) {
    //
    //     // For Ashr
    //     if (words[i].toLowerCase() === 'ashr') {
    //         message.channel.sendTTSMessage("~ashr is an alien");
    //     }
    // }
}
