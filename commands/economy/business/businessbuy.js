const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');
const { version } = require('../../../config.json');

const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('businessbuy')
    	.setDMPermission(false)
        .setDescription('BUY BUSINESSES')
        .setDescriptionLocalizations({
            de: 'KAUFE GESCHÄFTE'
        })
        .addStringOption(option =>
            option.setName('business')
                .setNameLocalizations({
                    de: 'geschäft'
                })
                .setDescription('THE BUSINESS')
                .setDescriptionLocalizations({
                    de: 'DAS GESCHÄFT'
                })
                .setRequired(true)
    			.addChoices(
                    // Setup Choices
                    { name: '🟢 [150000€] SUPERMARKT', value: 'market' },
            		{ name: '🔵 [390000€] PARKHAUS', value: 'parking garage' },
                    { name: '🟡 [520000€] AUTOHAUS', value: 'car dealership' },
				)),
    async execute(interaction, client, lang, vote) {
        // Set Variables
        const business = interaction.options.getString("business")
        const balance = await bals.get(interaction.user.id.replace(/\D/g, ''));

        // Check if Command is Allowed :P
        if (interaction.user.id.replace(/\D/g, '') != "745619551865012274" && interaction.user.id.replace(/\D/g, '') != "994495187617321010") {
            // Create Embed
            const err = new EmbedBuilder()
                .setTitle('» FEHLER')
                .setDescription('» Nur für Devs!')
                .setFooter({ text: '» ' + vote + ' » ' + version });
    
            // Send Message
            console.log(interaction.user.id + ' is a lol')
            return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
        }

        // Check if Business is Empty
        let businessowner, oldleft
        if (business == 'market' && await market.get('g-' + interaction.guild.id + '-OWNER') != 0) {
            oldleft = true
            businessowner = await market.get('g-' + interaction.guild.id + '-OWNER')
            try {
                await interaction.guild.members.fetch(businessowner)
            } catch (e) {return}

            // Create Embed
            let message = new EmbedBuilder()
        	    .setTitle('» ERROR')
        	    .setDescription('» <@' + businessowner + '> already owns this Business!')
        	    .setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang.toString() == 'de') {
                message = new EmbedBuilder()
        	        .setTitle('» FEHLER')
        	        .setDescription('» Dieses Geschäft gehört schon <@' + businessowner + '>!')
        	        .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [CMD] BUSINESSBUY : ALREADYOWNED')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Calculate Cost
        let cost
        if (business == 'market') { cost = 150000 }
        if (business == 'parking garage') { cost = 390000 }
        if (business == 'car dealership') { cost = 520000 }

        // Translate to Business Names
        let name
        if (business == 'market') { name = 'MARKET' }
        if (business == 'parking garage') { name = 'PARKING GARAGE' }
        if (business == 'car dealership') { name = 'CAR DEALERSHIP' }
        if (lang.toString() == 'de') {
            if (business == 'market') { name = 'SUPERMARKT' }
            if (business == 'parking garage') { name = 'PARKHAUS' }
            if (business == 'car dealership') { name = 'AUTOHAUS' }
        }

        if (balance < cost) {
            const missing = cost - balance
            
            // Create Embed
            let message = new EmbedBuilder()
            	.setTitle('» ERROR')
  				.setDescription('» You dont have enough Money for that, you are missing **$' + missing + '**!')
            	.setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang.toString() == "de") {
                message = new EmbedBuilder()
            	    .setTitle('» FEHLER')
  				    .setDescription('» Du hast dafür nicht genug Geld, dir fehlen **' + missing + '€**!')
            	    .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [CMD] BUSINESSBUY : ' + name.toUpperCase() + ' : NOTENOUGHMONEY : ' + cost + '€')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Remove Money
        bals.rem(interaction.user.id.replace(/\D/g, ''), cost)

        // Own Business
        if (business == 'market') {
            market.set(('g-' + interaction.guild.id + '-OWNER'), interaction.user.id.replace(/\D/g, ''))
        }

        // Create Embed
        let message = new EmbedBuilder()
            .setTitle('» BUY BUSINESS')
            .setDescription('» You successfully bought a **' + name + '** for **$' + cost + '**!')
            .setFooter({ text: '» ' + vote + ' » ' + version });

        if (lang.toString() == 'de') {
            message = new EmbedBuilder()
                .setTitle('» GESCHÄFT KAUFEN')
                .setDescription('» Du hast erfolgreich ein **' + name + '** für **' + cost + '€** gekauft!')
                .setFooter({ text: '» ' + vote + ' » ' + version });
        }

        // Send Message
        console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [CMD] BUSINESSBUY : ' + name.toUpperCase() + ' : ' + cost + '€')
        return interaction.reply({ embeds: [message.toJSON()] })
    },
};