const Discord = require('discord.js');
const axios = require('axios');
const dotenv = require('dotenv');
const client = new Discord.Client({
	intents: [
		Discord.IntentsBitField.Flags.Guilds,
		Discord.IntentsBitField.Flags.GuildMembers,
		Discord.IntentsBitField.Flags.GuildMessages,
		Discord.IntentsBitField.Flags.MessageContent
	]
});

let Informations = [];
dotenv.config();

const HS_Servers_ID = [
    {'id': 'Ze2k00zuoT', 'name': 'Tranzit 4', 'category': '1', 'channelId': '1182461833584582726'},
    {'id': 'L-Gn_5UmcN', 'name': 'Nuketown 4', 'category': '1', 'channelId': '1182461834645749791'},
    {'id': 'wNIDX6UOmq', 'name': 'Die Rise 4', 'category': '1', 'channelId': '1182461838143795342'},
    {'id': 'IpXeJzAkqh', 'name': 'Alcatraz 4', 'category': '1', 'channelId': '1182461836709339188'},
    {'id': 'eD1wSa-xa0', 'name': 'Buried 4', 'category': '1', 'channelId': '1182461839632760893'},
    {'id': 'TUFCjLFXiO', 'name': 'Origins 4', 'category': '1', 'channelId': '1182461841528586340'},

    {'id': 'Ym376GPxM_', 'name': 'Tranzit 8', 'category': '2', 'channelId': '1182461848273047682'},
    {'id': 'uYT5u-gScj', 'name': 'Nuketown 8', 'category': '2', 'channelId': '1182461843143413780'},
    {'id': 'O4rUpUmC2Q', 'name': 'Die Rise 8', 'category': '2', 'channelId': '1182461845706113034'},
    {'id': 'ThEqoddfGB', 'name': 'Alcatraz 8', 'category': '2', 'channelId': '1182461844405878885'},
    {'id': 'yh3HkAoge5', 'name': 'Buried 8', 'category': '2', 'channelId': '1182461846993776680'},
    {'id': 'VJqsVtMQQd', 'name': 'Origins 8', 'category': '2', 'channelId': '1182461849501958236'},

    {'id': '3ftDorwZnO', 'name': 'Alcatraz 8 (2)', 'category': '3', 'channelId': '1182461852324745226'},
    {'id': 'Qpvi1pc6im', 'name': 'Buried 8 (2)', 'category': '3', 'channelId': '1182461850898681986'},
    {'id': '1q-5OfQDil', 'name': 'S & S', 'category': '3', 'channelId': '1182419563288199301'}, 
    {'id': 'QF9MI15KBh', 'name': 'TDM', 'category': '3', 'channelId': '1182419561992179772'}, 
    {'id': 'zOYxWhkP1L', 'name': 'FFA', 'category': '3', 'channelId': '1182419560637411490'}, 
    {'id': 'cdJ_-P2opw', 'name': 'GunGame', 'category': '3', 'channelId': '1182419559383306411'} 
];

function getCategoryById(id) {
    let _id = HS_Servers_ID.find((server) => server.id === id);

    return _id ? _id.category : "Unknown";
}

function getServerNameById(id) {
    let _id = HS_Servers_ID.find((server) => server.id === id);

    return _id ? _id.name : "Unknown";
}

function getChannelIdById(id) {
    let _id = HS_Servers_ID.find((server) => server.id === id);

    return _id ? _id.channelId : "Unknown";
}

async function getInformations(id) {
    const res = await axios.get(`https://list.plutools.pw/s/${id}/json`);

    let players = res.data['players'];
    let online  = res.data['online'];

    if (!online) {
        Informations.push( {'value': `🔴 [${getServerNameById(id)}](https://discord.com/channels/946185722698797108/${getChannelIdById(id)})\n`, 'category': getCategoryById(id), 'online': false, 'players': 0} );
    } else {
        if (players.length > 0) {
            Informations.push( {'value': `🟢 [${getServerNameById(id)}](https://discord.com/channels/946185722698797108/${getChannelIdById(id)})\n`, 'category': getCategoryById(id), 'online': true, 'players': players.length} );
        } else {
            Informations.push( {'value': `🟡 [${getServerNameById(id)}](https://discord.com/channels/946185722698797108/${getChannelIdById(id)})\n`, 'category': getCategoryById(id), 'online': true, 'players': 0} );
        };
    };

    return;
};

client.on('ready', () => {
	console.log(`Bot prêt. [PTERO] \nConnecté en tant que ${client.user.tag}`);
    setInterval(() => {
        let _COne   = "";
        let _CTwo   = "";
        let _CThree = "";

        let OnlineServers        = 0;
        let TotalPlayers         = 0;
        let MaxPlayers           = 160; 
        let BestPlayers          = 0;
        let BestPlayersTimestamp = new Date(Date.now()).toUTCString();

        let waitInformations = new Promise((resolve, reject) => {
            HS_Servers_ID.forEach((server, index, array) => {
                getInformations(server.id)
                if (index === array.length - 1) resolve();
            });
        });
        
        waitInformations.then(() => {
            let waitParsing = new Promise((resolve, reject) => {
                Informations.forEach((serverInfo, index, array) => {
                    if(serverInfo.online) {
                        OnlineServers++;
                    };

                    TotalPlayers += serverInfo.players;

                    if(TotalPlayers > BestPlayers) {
                        BestPlayers          = TotalPlayers;
                        BestPlayersTimestamp = new Date(Date.now()).toUTCString();
                    };

                    switch(serverInfo.category) {
                        case "1":
                            _COne += serverInfo.value;
                            break;
                        case "2":
                            _CTwo += serverInfo.value;
                            break;
                        case "3":
                            _CThree += serverInfo.value;
                            break;
                    };

                    if (index === array.length - 1) resolve();
                });   
            });

            waitParsing.then(() => {
                Informations = [];

                let statusEmbed = new Discord.EmbedBuilder()
                    .setTitle("Honte-Servers BO2 Status List")
                    .setURL("https://honte-servers.com/")
                    .setDescription(`**Servers are restarting everyday at 00am (UTC+2)**\n\nServers Online: \`${OnlineServers}\`\nPlayers Online: \`${TotalPlayers}/${MaxPlayers}\`\nPlayers Record: \`${BestPlayers}/${MaxPlayers}\`\nAt \`${BestPlayersTimestamp}\`\n\n**============================================**\n\`\`\`Click a server link to see its status\`\`\``)
                    .addFields(
                        {
                            name: "🟢 : ON",
                            value: _COne ? _COne : "Empty.",
                            inline: true
                        },
                        {
                            name: "🟡 : RESTART",
                            value: _CTwo ? _CTwo : "Empty.",
                            inline: true
                        },
                        {
                            name: "🔴 : OFF",
                            value: _CThree ? _CThree : "Empty.",
                            inline: true
                        },
                    )
                    .setImage("https://cdn.discordapp.com/attachments/982743704865488896/1175294915605954570/d57x7mr-21299832-c9a6-49e0-b37a-6a76d8c7596a.png")
                    .setThumbnail("https://cdn.discordapp.com/attachments/982743704865488896/1175226523150712832/Logo_Honte.png?ex=656a75fd&is=655800fd&hm=f6c16ad63f3ed573df8a1af933b1a2ecc5c10806253655d69a85cebba9c06c76&")
                    .setFooter({
                        text: "Honte-Servers BO2 Bot",
                        iconURL: "https://cdn.discordapp.com/attachments/982743704865488896/1175226523150712832/Logo_Honte.png?ex=656a75fd&is=655800fd&hm=f6c16ad63f3ed573df8a1af933b1a2ecc5c10806253655d69a85cebba9c06c76&",
                    }).setTimestamp();

                    client.channels.cache.get('953470259040514178').messages.fetch('1182467864322646060').then(message => {
                        message.edit({ embeds: [ statusEmbed ] });
                    });
            });
        });
    }, 180000);
});

client.login(process.env.TOKEN);