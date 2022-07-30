const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');
const { version } = require('../../config.json');
var fs = require('file-system');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('apiview')
        .setDescription('BETRACHTE EINE API')
    	.setDMPermission(false)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('DER NAME')
                .setRequired(true)
        		.addChoices(
            		// Setup Choices
					{ name: '💻 1', value: '1' },
					{ name: '💻 2', value: '2' },
					{ name: '💻 3', value: '3' },
            		{ name: '💻 4', value: '4' },
            		{ name: '💻 5', value: '5' },
				)),
    async execute(interaction) {
        // Count to Global Commands
        addcmd('t-all', 1)
        
        // Count Guild Commands and User
        addcmd('g-' + interaction.guild.id, 1)
        addcmd('u-' + interaction.user.id, 1)
        
        // Set Variables
        const name = interaction.options.getString("name")
        const amount = await getapi('<@' + interaction.user.id + '>');
        
        // Check Maintenance
        const { maintenance } = require('../../config.json');
        if (maintenance == 'yes' && interaction.user.id != '745619551865012274') {
            // Create Embed
            var err = new EmbedBuilder()
        		.setTitle('» FEHLER')
        		.setDescription('» Der Bot ist aktuell unter Wartungsarbeiten!')
        		.setFooter({ text: '» ' + version });
            
            return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
        }
        
       	// Check if API even exists
        var path = '/paper-api/' + interaction.user.id + '/' + name
        try {
        	
            // Read File
            var data = fs.readFileSync(path, "utf8");
            
        	// Create Embed
        	var message = new EmbedBuilder()
            	.setTitle('» PAPER API EDIT')
  				.setDescription('» Der inhalt von **' + name + '**:\n`' + data + '`\n» Der Link:\n**`https://api.paperstudios.de/user/' + interaction.user.id + '/' + name + '`**')
        		.setFooter({ text: '» ' + version + ' » SLOTS ' + amount + '/5'});

        	// Send Message
        	console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] APIVIEW : ' + name + ' : ' + data.toUpperCase())
        	return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        } catch (err) {
            // Create Embed
            var err = new EmbedBuilder()
        		.setTitle('» PAPER API EDIT')
        		.setDescription('» Diese API existiert garnicht!\n</apicreate:1000322453614104636> um eine zu erstellen')
        		.setFooter({ text: '» ' + version + ' » SLOTS ' + amount + '/5'});
            
            // Send Message
            console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] APIVIEW : ' + name + ' : NOTFOUND')
            return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
        }
    },
};