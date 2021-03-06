// author: Rayner Kristanto
// TODO: Play! for player pools
// TODO: clear for player pools when players is cleared
// TODO: restore for player pools when player is restored



const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

var champs = new Set();
var players = new Set();
var champsBackup = new Set();
var playersBackup = new Set();
var playersChampMap = new Map();
var playersChampMapBackup = new Map();

function decideSet(flag) {
    if (flag === 'c') {
        return champs;
    } else if (flag === 'p') {
        return players;
    } else if (playersChampMap.has(flag)) {
        return playersChampMap.get(flag);
    }
    return null;
}
function decideCopySet(flag) {
    if (flag === 'c') {
        return champsBackup;
    } else if (flag === 'p') {
        return playersBackup;
        
    } else if (playersChampMapBackup.has(flag)) {
        return playersChampMapBackup.get(flag);
    }
    return null;
}
function copySet(set1, set2) {
    set2.clear();
    set1.forEach(item => {
        set2.add(item);
    });
}
function copyMap(map1, map2) {
    map2.clear();
    map1.forEach((value, key) => {
        map2.set(key, value);
    })
}
function getFromSet(set, i) {
    let count = 0;
    let iterator = set.values();
    let temp = null;
    while (count <= i && count < set.size) {
        temp = iterator.next();
        count++;
    }
    return temp.value;
}
function saveCollectionsToFile() {
    saveSetToFile('players.json', players);
    saveSetToFile('champs.json', champs);
    saveSetToFile('playersBackup.json', playersBackup);
    saveSetToFile('champsBackup.json', champsBackup);
    saveMapToFile('playersChampMap.json', playersChampMap);
    saveMapToFile('playersChampMapBackup.json', playersChampMapBackup);
}

function saveSetToFile(filename, set) {
    let setJSON = JSON.stringify(Array.from(set));
    fs.writeFile(filename, setJSON, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}
function saveMapToFile(filename, map) {
    let obj = Object.create(null);
    map.forEach((value, key) => {
        obj[key] = Array.from(value);
    })

    let mapJSON = JSON.stringify(obj);
    fs.writeFile(filename, mapJSON, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

function initializeSet(filename) {
    try {
        let data = fs.readFileSync(filename);
        if (data) {
            let setArray = JSON.parse(fs.readFileSync(filename));
            return new Set(setArray);
        } else {
            console.log(filename + "is empty");
        }
    } catch (error) {
        // console.log(error);
        return new Set();
    }
}

function initializeMap(filename) {
    try {
        let data = fs.readFileSync(filename);
        if (data) {
            let obj = JSON.parse(fs.readFileSync(filename));
            let map = new Map();
            for (let k of Object.keys(obj)) {
                map.set(k, new Set(obj[k]));
            }
            return map;
        }
    } catch (error) {
        return new Map();
    }
}

function formatWord(word) {
    let result = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    result = result.replace(/,/g, "");
    return result;
}

const cfi = 0; // command flag index
const sfi = 1; // set flag index
const numFlags = 2;
const setFlags = ['c', 'p']; // set flags

exports.initializeCollections = function initializeCollections() {
    champs = initializeSet('champs.json');
    players = initializeSet('players.json');
    champsBackup = initializeSet('champsBackup.json');
    playersBackup = initializeSet('playersBackup.json');
    playersChampMap = initializeMap('playersChampMap.json');
    playersChampMapBackup = initializeMap('playersChampMapBackup.json');
}

exports.handleMessage = function handleMessage(message, words) {
    if (words[0].charAt(0) != '!') {
        return;
    }

    let commandFlag = words[cfi].toLowerCase();
    if (words.length  > sfi) {
        var setFlag = words[sfi].length > 1 ? formatWord(words[sfi]) : words[sfi].toLowerCase();
    }
    // commands that are not set dependent
    if (commandFlag === '!play1') {
        let result = "";
        if (champs.size >= players.size && players.size > 1) {
            result = "";
            let c = new Set();
            copySet(champs, c);
            players.forEach(player => {
                let randomNum = Math.floor((Math.random() * c.size));
                let randomChamp = getFromSet(c, randomNum);
                result = result + player + ": " + randomChamp + "\n";
                c.delete(randomChamp);
            });
        } else {
            result = "Number of players must be greater than number of champs. Players #: " + players.size + " Champs #: " + champs.size;
        }
        message.channel.sendMessage(result);
    } else if (commandFlag === '!play2') {
        let result = "";
        let error = false;
        playersChampMap.forEach((set, player) => {
            if (!error) {
                if (!set || set.size == 0) {
                    console.log("got in here for " + player);
                    result = player + "'s champ pool is empty.";
                    error = true;
                } else {
                    let randomNum = Math.floor((Math.random() * set.size));
                    let randomChamp = getFromSet(set, randomNum);
                    result = result + player + ": " + randomChamp + "\n";
                }
            }
        });

        message.channel.sendMessage(result);
    } else if (commandFlag === '!commands') {
       
        message.channel.send({embed: {
            color: 3447003,
            title: "Player Champ Randomizer Commands",
            description: "Randomly assign people to things! Add c to perform action on champs pool, p for players pool and player's name for player's champ pool",
            fields: [{
                name: "!add",
                value: "Add to a pool."
              },
              {
                name: "!remove",
                value: "Remove from a pool."
              },
              {
                name: "!clear",
                value: "Remove everything from a pool and save a backup of how it was before you cleared it."
              },
              {
                name: "!restore",
                value: "Restore a pool to its backup"
              },
              {
                name: "!show",
                value: "Show a pool."
              },
              {
                name: "!play1",
                value: "Randomly assign each player in players pool to a champ in champs pool"
              },
              {
                name: "!play2",
                value: "Randomly assign each player in players pool to a champ in the respective player's champ pool"
              },
            ],
          }
        });
    }

    if (words.length - 1 === sfi && (setFlags.includes(setFlag) || players.has(setFlag))) {

        // Commands that are set dependent and do not need additional user input
        // Clear set
        if (commandFlag === '!clear') {

            let s = decideSet(setFlag);
            let sc = decideCopySet(setFlag);

            if (s && sc) {
                copySet(s, sc);
                s.clear();

                if (setFlag === 'p') {
                    copyMap(playersChampMap, playersChampMapBackup);
                    playersChampMap.clear();
                }
                message.channel.sendMessage("cleared!");
            }
        }
        // Restore set to how it was previously before it was cleared
        else if (commandFlag === '!restore') {
            let s = decideSet(setFlag);
            let sc = decideCopySet(setFlag);

            if (s && sc) {
                let temp = new Set();
                copySet(s, temp);
                copySet(sc, s);
                copySet(temp, sc);

                if (setFlag === 'p') {
                    let tempMap = new Map();
                    copyMap(playersChampMap, tempMap);
                    copyMap(playersChampMapBackup, playersChampMap);
                    copyMap(tempMap, playersChampMapBackup);
                }
                message.channel.sendMessage("restored!");
            }
        }
        // Show set
        else if (commandFlag === '!show') {
            let result = "";
            let s = decideSet(setFlag);

            if (s) {
                if (s.size > 0) {
                    s.forEach(item => {
                        result = result + ", " + item;
                    });
                    message.channel.sendMessage(result.substring(1));
                } else {
                    message.channel.sendMessage("set is empty");
                }
            }
        }
    } else if (words.length > numFlags && (setFlags.includes(setFlag) || players.has(setFlag))) {

        // Commands which edit the set based on user input
        // Add to set
        if (commandFlag === '!add') {
            let s = decideSet(setFlag);
            if (s) {
                for (let i = numFlags ; i < words.length; i++) {
                    s.add(formatWord(words[i]));

                    if (setFlag === 'p' && !playersChampMap.has(formatWord(words[i]))) {
                        playersChampMap.set(formatWord(words[i]), new Set());
                        playersChampMapBackup.set(formatWord(words[i]), new Set());
                    }
                }

                message.channel.sendMessage("added!");
            }
        }
        // Remove from set
        else if (commandFlag === '!remove') {
            let s = decideSet(words[1]);
            if (s) {
                for (let i = numFlags; i < words.length; i++) {
                    s.delete(formatWord(words[i]));

                    if (setFlag === 'p' && playersChampMap.has(formatWord(words[i]))) {
                        playersChampMap.delete(formatWord(words[i]));
                        playersChampMapBackup.delete(formatWord(words[i]));
                    }
                }
                message.channel.sendMessage("removed!");
            }
        }
    }
    saveCollectionsToFile();
}
