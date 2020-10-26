/* LIB MANAGEMENT */
const { randomImageName } = require("./js/lib/randomImageName");

const { updateChannelList } = require("./js/lib/updateChannelList");

const { getServerID } = require("./js/lib/getServerID");

const { getChannelID } = require("./js/lib/getChannelID");

const { imageSaver } = require("./js/lib/imageSaver");

const { createLibrary } = require("./js/lib/createLibrary");

const { collectFromChannel } = require("./js/lib/collectFromChannel");

/* DISCORD.JS */
const { prefix, token } = require('./config.json');

const Discord = require(`discord.js`);

const client = new Discord.Client();

//All the Discord.js stuff down here
client.once('ready', () => {
	client.user.setActivity(':: help');
	console.log("DISCORD BOT READY");
})

client.login(token);

client.on('channelUpdate', (channel) => {
	updateChannelList(channel);
});

client.on('message', message => {
	// HELP
	if(message.content == `${prefix} help` || message.content == `${prefix} h`) {
	message.channel.send(
		'**HELP:**\n`:: help`/`:: h` - list of commands\n`:: server id` - basic server info\n`:: channel id` - basic channel info\n \n**DO AFTER INVITING BOT:**\n`:: server init` - creates server library\n`:: channel collect` - adds channel to list of channels that bot is getting images from\n \n**OTHER COMMANDS:**\n`:: skip`/`:: s` - omitts downloading of attached image\n`:: random image chan` - sends random image from channel you requested\n`:: update chanlist` - manualy updates channel names in library');
	}
	// SERVER ID
	else if(message.content == `${prefix} server id`) {
		getServerID(message.guild, message.channel);
	}
	// CHANNEL ID	
	else if(message.content == `${prefix} channel id`) {
		getChannelID(message.guild, message.channel);
	}
	// INITIATE
	else if(message.content == `${prefix} server init`) {
		createLibrary(message.guild, message.channel);
	}
	// COLLECT FROM CHANNEL
	else if(message.content == `${prefix} channel collect`) {
		collectFromChannel(message.guild, message.channel);
	}
	// UPDATE CHANLIST
	else if(message.content == `${prefix} update chanlist`) {
		updateChannelList(message.channel);
		message.react('✅');
	}
	// BACKUP FILES TO GOOGLE DRIVE
	else if(message.content == `${prefix} backup files`) {
		// backup2GoogleDrive(auth, message.guild);
		backup2GoogleDrive(auth, message).catch(console.error);
	}
	// RANDOM IMAGE FROM NAME
	else if(message.content.startsWith(`${prefix} random image chan`)) {
		const args = message.content.slice(prefix.length).split(' ');
		if(args.length === 5) {
			randomImageName(message.guild, message.channel, args[4]);
		}
		else {
			message.channel.send('This channel name do not exist. Check the spelling, or try updating channel names manually (`:: update chanlist`)');
		}
	}
	//MAKE "SKIP" A VALID COMMAND
	else if(message.content == `${prefix} s`|| message.content == `${prefix} skip`) {
		
	}
	// ELSE
	else if(message.content.startsWith(`${prefix}`)) {
		message.channel.send("That's not a real command dude. Check te spelling, or use `:: h`");
	}

	// DOWNLOAD
	if(message.content == `${prefix} s`|| message.content == `${prefix} skip`) {
		message.react('⏩');
		console.log(`image omitted`);
	}
	else if(message.attachments.first()) {
		imageSaver(
			message,
			message.attachments.first()
		);
	}
});