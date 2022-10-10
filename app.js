const Discord = require('discord.js');
const config = require("./config.json");

let prefix = config.prefix; //Leo

var roleGame = {
    "Uygulamanın Tam İsmi.": { //Tablo ismi
        name: "Yeni etkinlik ismi.", //Oynuyor kısmı.
        id: 'Rol ID.' //Verilecek rol id.
    },
};


var blackListUsers = [" "];
var blackListWords = ["custom", "status", "noxplayer"];


var client = new Discord.Client();

function collectRoleIds() {
    client.guilds.cache.forEach(function(server) {
        server.roles.cache.forEach(function(role) {
            for (var gKey in roleGame) {
                if (prefix + gKey === role.name) {
                    roleGame[gKey]['id'] = role.id;
                }
            }
        });
    });
}

function registeredGame(game) {
    game.toString();
    for (var gKey in roleGame) {
        if ((game !== null && game !== undefined) && roleGame[gKey].name === game.toString().toLowerCase()) {
            return gKey;
        }
    }

    return false;
}

function removeWords(text) {
    var str2 = text.replace(/,/g, " ");
    var str3 = str2.toLowerCase();
    var str = str3.split(" ");

    for (var i = 0; i < blackListWords.length; i++) {
        for (var j = 0; j < str.length; j++) {
            if (str[j].toLowerCase() === blackListWords[i]) {
                str.splice(j, 1);
            }
        }
    }
    return text = str.join(" ");
}


client.on('presenceUpdate', (oldPresence, newPresence) => {
    //if (JSON.stringify(oldPresence) == 'undefined') {return};

    if (JSON.stringify(oldPresence) == undefined) {
        return
    };
    if (oldPresence == 'undefined') {
        return
    };
    if (oldPresence == null && newPresence == null) {
        return
    }
    if (oldPresence == 'undefined' && newPresence == 'undefined') {
        return
    }
    if (oldPresence.activities == 'undefined' && newPresence.activities == 'undefined') {
        return
    }

    //REMOVE BOTS UPDATE
    for (var ii in blackListUsers) {
        if (oldPresence.userID.includes(blackListUsers[ii].toLowerCase())) {
            return
        }
    }


    var oldActivities = oldPresence.activities.toString();
    var newActivities = newPresence.activities.toString();

    //REMOVE WORDS
    var oldActivities = removeWords(oldActivities);
    var newActivities = removeWords(newActivities);

    if (oldActivities == newActivities) {
        return
    };


    console.log('\n------------------------------------------------------------------------------------------------------------------------\n');
    console.log('Eski aktivite: ' + oldActivities + '\nYeni Aktivite: ' + newActivities + '\nUser: ' + newPresence.member.displayName);

    var oldGame = registeredGame(oldActivities);
    if (oldGame) {
        newPresence.member.roles.remove(roleGame[oldGame].id).catch(e => {
            console.error(e)
        });
        console.log('Başarıyla eklenen rol kaldırıldı.');
    }

    var gameId = registeredGame(newActivities);
    if (gameId) {
        newPresence.member.roles.add(roleGame[gameId].id).catch(e => {
            console.error(e)
        });
        console.log('Başarıyla rol eklendi.');
    }


});

client.on('ready', () => {
    console.log('Aktiviteler izleniyor, bot aktif. ©Leo');
    client.user.setStatus('online');

    collectRoleIds();
});

client.login(process.env.token);