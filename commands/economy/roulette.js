const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');
const { version } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roulette')
    	.setDMPermission(false)
        .setDescription('PLAY ROULETTE')
        .setDescriptionLocalizations({
            de: 'SPIELE ROULETTE'
        })
        .addStringOption(option =>
            option.setName('color')
                .setNameLocalizations({
                    de: 'farbe'
                })
                .setDescription('THE COLOR')
                .setDescriptionLocalizations({
                    de: 'DIE FARBE'
                })
                .setRequired(true)
    			.addChoices(
                    // Setup Choices
                    { name: '🟢 [x4] GRÜN', value: 'grün' },
            		{ name: '⚫ [x2] SCHWARZ', value: 'schwarz' },
                    { name: '🔴 [x2] ROT', value: 'rot' },
				))
        .addIntegerOption(option =>
            option.setName('bet')
                .setNameLocalizations({
                    de: 'wette'
                })
                .setDescription('THE BET')
                .setDescriptionLocalizations({
                    de: 'DIE WETTE'
                })
                .setRequired(true)),
    async execute(interaction) {
        // Count to Global Commands
        addcmd('t-all', 1)
        
        // Count Guild Commands and User
        addcmd('g-' + interaction.guild.id, 1)
        addcmd('u-' + interaction.user.id, 1)
        
        // Set Variables
        const farbe = interaction.options.getString("color")
        const wette = interaction.options.getInteger("bet")
        
        const money = await getbal('<@' + interaction.user.id + '>');
        const random = Math.floor(Math.random() * (21 - 1 + 1)) + 1;

        // Check if Balance is Minus
        if (wette < 0) {
            // Create Embed
            const err = new EmbedBuilder()
        		.setTitle('» FEHLER')
        		.setDescription('» Du kannst keine negativen Einsätze spielen!')
        		.setFooter({ text: '» ' + version });
            
            // Send Message
            console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] ROULETTE : NEGATIVEMONEY : ' + wette + '€')
            return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
        }
        
        // Calculate Color
        let color
        if (random == 1) { color = 'grün' }
        if (random >= 2) { color = 'schwarz' }
        if (random >= 11) { color = 'rot' }
        
        // Calculate Status
        let status
        if (color == farbe) { status = 'GEWONNEN' }
        if (color != farbe) { status = 'VERLOREN' }
        
        // Check for enough Money
        if (money >= wette) {
            // Check for Max Amount
            if (wette > 15000) {
                // Create Embed
                const err = new EmbedBuilder()
            		.setTitle('» ROULETTE')
  					.setDescription('» Du kannst nicht soviel Wetten! **5000€** ist das Maximum.')
            		.setFooter({ text: '» ' + version });
                
                // Send Message
            	console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] ROULETTE : TOOMUCHMONEY : ' + wette + '€')
        		return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
            }
            
        	// Set Money
            let resultmul
            if (color == farbe && color == 'grün') {
                resultmul = 4
            }
            if (color == farbe && color != 'grün') {
                resultmul = 2
            }
            if (color != farbe) {
                resultmul = 0
            }
            const result = wette * resultmul
            const resultadd = result - wette
            let resultdis
            if (result == 0) {
                resultdis = wette
            } else {
                resultdis = result
            }
        
        	// Create Embed
      		const message = new EmbedBuilder()
            	.setTitle('» ROULETTE')
  				.setDescription('» Du hast **' + wette + '€** auf **' + farbe.toUpperCase() + '** gesetzt und **' + resultdis + '€** **' + status + '**!')
            	.setFooter({ text: '» ' + version });
            
            // Set Money
            if (color != farbe) {
            	rembal('<@' + interaction.user.id + '>', wette);
            }
			if (color == farbe) {
            	addbal('<@' + interaction.user.id + '>', resultadd);
            }
            
            // Send Message
        	console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] ROULETTE : ' + farbe.toUpperCase() + '[W:' + color.toUpperCase() + '] : ' + status + ' : ' + resultdis + '€')
        	return interaction.reply({ embeds: [message.toJSON()] })
        } else {
            const missing = wette - money
            
            // Create Embed
            const err = new EmbedBuilder()
            	.setTitle('» ROULETTE')
  				.setDescription('» Du hast dafür nicht genug Geld, dir fehlen **' + missing + '€**!')
            	.setFooter({ text: '» ' + version });
            
            // Send Message
            console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] GUESS : NOTENOUGHMONEY : ' + missing + '€')
        	return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
        }
    },
};