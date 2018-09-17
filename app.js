// author: Rayner Kristanto

const Discord = require('discord.js');
const client = new Discord.Client();
const playerChampRandomizer = require('./playerChampRandomizer.js');
const randomThings = require('./randomThings.js');


client.on('ready', () => {
  playerChampRandomizer.initializeCollections();
  console.log('Initialized Collections');
});

client.on('message', message => {
  if (message.author.bot) return;

  var words = message.content.split(" ");

  playerChampRandomizer.handleMessage(message, words);
  randomThings.handleMessage(message, words);
});


client.login('MjU5ODA5MTQ0NTQ0OTUyMzIw.CzdN5w.2_GkjHBcfv7dnE1O2uL7FZ0ctXE');
