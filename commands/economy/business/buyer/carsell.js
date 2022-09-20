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
        // Set Variables
        const car = await item.get(interaction.user.id.replace(/\D/g, '') + '-CAR', 'value')

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

        // Calculate Cost
        let cost
        if (await bsns.get('g-' + interaction.guild.id + '-3-PRICES') === '0' || await bsns.get('g-' + interaction.guild.id + '-3-PRICES') === 0) {
            if (car == 'jeep') { cost = 150000 }
            if (car == 'kia') { cost = 200000 }
            if (car == 'tesla') { cost = 340000 }
            if (car == 'porsche') { cost = 490000 }
        } else {
            const dbprices = await bsns.get('g-' + interaction.guild.id + '-3-PRICES')
            const cache = dbprices.split('-')
			const [j, k, t, p] = cache

            if (car == 'jeep') { cost = parseInt(j) }
            if (car == 'kia') { cost = parseInt(k) }
            if (car == 'tesla') { cost = parseInt(t) }
            if (car == 'porsche') { cost = parseInt(p) }
        }

        // Translate to Car Names
        let name
        if (car == 'jeep') { name = '2016 JEEP PATRIOT SPORT' }
        if (car == 'kia') { name = '2022 KIA SORENTO' }
        if (car == 'tesla') { name = 'TESLA MODEL Y' }
        if (car == 'porsche') { name = '2019 PORSCHE 911 GT2RS' }

        // Check if User has a Car
        if (await item.get(interaction.user.id.replace(/\D/g, '') + '-CAR', 'amount') === 0) {
            // Create Embed
            let message = new EmbedBuilder()
            	.setTitle('» ERROR')
  				.setDescription('» You dont own a Car!')
            	.setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang.toString() == "de") {
                message = new EmbedBuilder()
            	    .setTitle('» FEHLER')
  				    .setDescription('» Du besitzt kein Auto!')
            	    .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [CMD] CARSELL : DONTOWNCAR')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Create Buttons
        let row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('YES')
                    .setCustomId('CAR-SELL-YES-' + car + '-' + interaction.user.id)
                    .setEmoji('1017050442431209543')
					.setStyle(ButtonStyle.Success)
                    .setDisabled(true),

                new ButtonBuilder()
					.setLabel('NO')
                    .setCustomId('CAR-SELL-NO-' + car + '-' + interaction.user.id)
                    .setEmoji('1017050508252418068')
					.setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
			);
        if (lang.toString() == "de") {
            row = new ActionRowBuilder()
			    .addComponents(
			    	new ButtonBuilder()
			    		.setLabel('JA')
                        .setCustomId('CAR-SELL-YES-' + car + '-' + interaction.user.id)
                        .setEmoji('1017050442431209543')
			    		.setStyle(ButtonStyle.Success)
                        .setDisabled(false),

                    new ButtonBuilder()
			    		.setLabel('NEIN')
                        .setCustomId('CAR-SELL-NO-' + car + '-' + interaction.user.id)
                        .setEmoji('1017050508252418068')
			    		.setStyle(ButtonStyle.Danger)
                        .setDisabled(false),
			    );
        }

        // Create Embed
        let message = new EmbedBuilder()
            .setTitle('» SELL CAR')
            .setDescription('» Do you want to sell your **' + name + '** for **$' + (cost/2) + '**?')
            .setFooter({ text: '» ' + vote + ' » ' + version });

        if (lang.toString() == 'de') {
            message = new EmbedBuilder()
                .setTitle('» AUTO VERKAUFEN')
                .setDescription('» Willst du deinen **' + name + '** für **' + (cost/2) + '€** verkaufen?')
                .setFooter({ text: '» ' + vote + ' » ' + version });
        }

        // Send Message
        console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [CMD] CARSELL : ' + name.toUpperCase() + ' : ' + cost + '€')
        return interaction.reply({ embeds: [message.toJSON()], components: [row] })
    },
};