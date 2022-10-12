const { SlashCommandBuilder } = require('@discordjs/builders');
const { version } = require('../../config.json');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donate')
    	.setDMPermission(false)
        .setDescription('DONATE THE BOT')
        .setDescriptionLocalizations({
            de: 'SPENDE DEM BOT'
        }),
    async execute(interaction, client, lang, vote) {
        // Create Embed
        let message = new EmbedBuilder()
        	.setTitle('<:DONATE:1024397357988720711> » DONATE')
        	.setDescription('**»» DONATE**\n» LINK\nhttps://donate.rjansen.de\n» QR CODE')
    		.setImage("https://img.rjansen.de/bot/donate.png")
    		.setFooter({ text: '» ' + vote + ' » ' + version });

        if (lang == "de") {
            message = new EmbedBuilder()
        		.setTitle('<:DONATE:1024397357988720711> » SPENDEN')
        		.setDescription('**»» SPENDEN**\n» LINK\nhttps://donate.rjansen.de\n» QR CODE')
        		.setImage("https://img.rjansen.de/bot/donate.png")
        		.setFooter({ text: '» ' + vote + ' » ' + version });
        }

        // Send Correct Response
        bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] DONATE <3')
        return interaction.reply({ embeds: [message], ephemeral: true })
    },
};