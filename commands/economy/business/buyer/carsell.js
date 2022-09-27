const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { EmbedBuilder } = require('@discordjs/builders');
const { version } = require('../../../../config.json');

const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('carsell')
    	.setDMPermission(false)
        .setDescription('SELL YOUR CAR')
        .setDescriptionLocalizations({
            de: 'VERKAUFE DEIN AUTO'
        }),
    async execute(interaction, client, lang, vote) {
        // Check if Cars are Enabled in Server
        const ces = await gopt.get(interaction.guild.id + '-CAR')
        if (parseInt(ces) == 1) {
            // Create Embed
            let message = new EmbedBuilder()
        		.setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
        		.setDescription('» Cars are disabled on this Server!')
        		.setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang == "de") {
                message = new EmbedBuilder()
        		    .setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
        		    .setDescription('» Autos sind auf diesem Server deaktiviert!')
        		    .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] CAR : DISABLED')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Set Variables
        const car = await item.get(interaction.user.id + '-CAR-' + interaction.guild.id, 'value')

        // Calculate Cost
        let cost
        if (car == 'jeep') { cost = 15000 }
        if (car == 'kia') { cost = 75000 }
        if (car == 'tesla') { cost = 240000 }
        if (car == 'porsche') { cost = 490000 }

        // Translate to Car Names
        let name
        if (car == 'jeep') { name = '2016 JEEP PATRIOT SPORT' }
        if (car == 'kia') { name = '2022 KIA SORENTO' }
        if (car == 'tesla') { name = 'TESLA MODEL Y' }
        if (car == 'porsche') { name = '2019 PORSCHE 911 GT2RS' }

        // Check if User has a Car
        if (await item.get(interaction.user.id + '-CAR-' + interaction.guild.id, 'amount') === 0) {
            // Create Embed
            let message = new EmbedBuilder()
            	.setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
  				.setDescription('» You dont own a Car!')
            	.setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang == "de") {
                message = new EmbedBuilder()
            	    .setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
  				    .setDescription('» Du besitzt kein Auto!')
            	    .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] CARSELL : DONTOWNCAR')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Create Buttons
        let row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('YES')
                    .setCustomId('CAR-SELL-YES-' + car + '-' + interaction.user.id)
                    .setEmoji('1024382942153285632')
					.setStyle(ButtonStyle.Success)
                    .setDisabled(false),

                new ButtonBuilder()
					.setLabel('NO')
                    .setCustomId('CAR-SELL-NO-' + car + '-' + interaction.user.id)
                    .setEmoji('1024382939020152982')
					.setStyle(ButtonStyle.Danger)
                    .setDisabled(false),
			);
        if (lang == "de") {
            row = new ActionRowBuilder()
			    .addComponents(
			    	new ButtonBuilder()
			    		.setLabel('JA')
                        .setCustomId('CAR-SELL-YES-' + car + '-' + interaction.user.id)
                        .setEmoji('1024382942153285632')
			    		.setStyle(ButtonStyle.Success)
                        .setDisabled(false),

                    new ButtonBuilder()
			    		.setLabel('NEIN')
                        .setCustomId('CAR-SELL-NO-' + car + '-' + interaction.user.id)
                        .setEmoji('1024382939020152982')
			    		.setStyle(ButtonStyle.Danger)
                        .setDisabled(false),
			    );
        }

        // Create Embed
        let message = new EmbedBuilder()
            .setTitle('<:BOXDOLLAR:1024402261784403999> » SELL CAR')
            .setDescription('» Do you want to sell your **' + name + '** for **$' + (cost/2) + '**?')
            .setFooter({ text: '» ' + vote + ' » ' + version });

        if (lang == 'de') {
            message = new EmbedBuilder()
                .setTitle('<:BOXDOLLAR:1024402261784403999> » AUTO VERKAUFEN')
                .setDescription('» Willst du deinen **' + name + '** für **' + (cost/2) + '€** verkaufen?')
                .setFooter({ text: '» ' + vote + ' » ' + version });
        }

        // Send Message
        bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] CARSELL : ' + name + ' : ' + cost + '€')
        return interaction.reply({ embeds: [message.toJSON()], components: [row] })
    },
};