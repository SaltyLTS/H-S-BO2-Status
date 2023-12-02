const {Client, IntentsBitField, EmbedBuilder} = require('discord.js');
const axios = require('axios');
const dotenv = require('dotenv')
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

dotenv.config();

let lastMessage = null;

client.on('ready', () => {
	console.log(`Bot prêt. [PTERO] \nConnecté en tant que ${client.user.tag}`);
	setInterval(() => {
		refreshEmbed();
	}, 10000);
});

async function refreshEmbed() {
	try {
		const response = await axios.get('https://list.plutools.pw/s/o8bl0DA1rF/json');
		const {
			ip,
			port,
			hostname,
			players,
			maxplayers,
			round,
			online
		} = response.data;
		const Round = round === -1 ? 0 : round;
		let Ping = '0';

		if (!online) {
			const embedOffline = new EmbedBuilder()
				.setTitle("Honte-Servers BO2 Status List")
  .setURL("https://example.com")
  .setDescription("**Servers are restarting at the end of each game**\nServers Online: `${serversonline}`\nPlayers Online: `${playersonline}/${maxplayers}`\nPlayers Record: `${bestplayers}/${maxplayers}` at `${timestamp}`\n**============================================**\n```Click a server link to see its status```")
  .addFields(
    {
      name: "🟢 : Online",
      value: "🟢 [Tranzit 4](https://canary.discord.com)\n🔴 [Nuketown 4](https://canary.discord.com)\n🔴 [Die Rise 4](https://canary.discord.com)\n🔴 [Alcatraz 4](https://canary.discord.com)\n🔴 [Buried 4](https://canary.discord.com)\n🔴 [Origins 4](https://canary.discord.com)",
      inline: true
    },
    {
      name: "🟡 : Restart",
      value: "🔴 [Tranzit 8](https://canary.discord.com)\n🔴 [Nuketown 8](https://canary.discord.com)\n🔴 [Die Rise 8](https://canary.discord.com)\n🔴 [Alcatraz 8](https://canary.discord.com)\n🔴 [Buried 8](https://canary.discord.com)\n🔴 [Origins 8](https://canary.discord.com)",
      inline: true
    },
    {
      name: "🔴 : Offline",
      value: "🔴 [Alcatraz 8 (2)](https://canary.discord.com)\n🔴 [Buried 8 (2)](https://canary.discord.com)\n🔴 [S & S](https://canary.discord.com)\n🔴 [TDM](https://canary.discord.com)\n🔴 [FFA](https://canary.discord.com)\n🔴 [GunGame](https://canary.discord.com)",
      inline: true
    },
  )
  .setImage("https://cdn.discordapp.com/attachments/982743704865488896/1175294915605954570/d57x7mr-21299832-c9a6-49e0-b37a-6a76d8c7596a.png")
  .setThumbnail("https://cdn.discordapp.com/attachments/982743704865488896/1175226523150712832/Logo_Honte.png?ex=656a75fd&is=655800fd&hm=f6c16ad63f3ed573df8a1af933b1a2ecc5c10806253655d69a85cebba9c06c76&")
  .setFooter({
    text: "Honte-Servers BO2 Bot",
    iconURL: "https://cdn.discordapp.com/attachments/982743704865488896/1175226523150712832/Logo_Honte.png?ex=656a75fd&is=655800fd&hm=f6c16ad63f3ed573df8a1af933b1a2ecc5c10806253655d69a85cebba9c06c76&",
  })
  .setTimestamp();


			const guild = client.guilds.cache.get('946185722698797108');
			const textChannel = guild.channels.cache.get('1175252347946016788');

			if (lastMessage) {
				await lastMessage.edit({
					embeds: [embedOffline]
				});
			} else {
				const sentMessage = await textChannel.send({
					embeds: [embedOffline]
				});
				lastMessage = sentMessage;
			}
			return;
		}

		if (players.length > 0) {
			averagePing = players.reduce((sum, player) => sum + player.ping, 0) / players.length;
			averagePing = averagePing.toFixed(2);
		}

		const embed = new EmbedBuilder()
			.setColor('#57F287')
			.setTitle(`${hostname}`)
			.addFields({
				name: 'IP',
				value: `\`${ip}:${port}\``,
				inline: true
			}, {
				name: 'Current server status:',
				value: `\`🟢 ONLINE\``,
				inline: true
			}, {
				name: '‎ ',
				value: `‎ `,
				inline: true
			}, {
				name: 'Players',
				value: `\`${players.length}/${maxplayers.toString()}\``,
				inline: true
			}, {
				name: 'Round',
				value: `\`${Round.toString()}\``,
				inline: true
			}, {
				name: 'Av. Ping',
				value: `\`${Ping}\``,
				inline: true
			})
			.setImage('https://media.discordapp.net/attachments/982743704865488896/1175235298704248892/Tranzit.png')
			.setFooter({
				text: 'Honte-Servers BO2 Bot',
				iconURL: 'https://cdn.discordapp.com/attachments/982743704865488896/1175226523150712832/Logo_Honte.png',
			})
			.setTimestamp();

		const guild = client.guilds.cache.get('946185722698797108');
		const textChannel = guild.channels.cache.get('1175252347946016788');

		if (lastMessage) {
			await lastMessage.edit({
				embeds: [embed]
			});
		} else {
			const sentMessage = await textChannel.send({
				embeds: [embed]
			});
			lastMessage = sentMessage;
		}
	} catch (error) {
		console.error('Error during refresh:', error);
	}
}

client.login(process.env.TOKEN);