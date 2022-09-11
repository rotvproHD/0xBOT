const { EmbedBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { version } = require('../../../config.json');

const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: {
        name: 'ttt-yes'
    },
    async execute(interaction, client, bet, sel) {
        // Get Users
        const cache = interaction.message.embeds
        const description = cache[0].description.toString().replace(/[^\d@!]/g, '').split('!')[0].substring(1).split("@");
        const [sender, reciever] = description

        // Set Variables
        const balance = await bals.get(reciever.toString().replace(/\D/g, ''))
        const otherbalance = await bals.get(sender.toString().replace(/\D/g, ''))

        // Check if User is Authorized
        if (interaction.user.id.replace(/\D/g, '') != reciever.toString().replace(/\D/g, '')) {
            // Create Embed
            let message = new EmbedBuilder()
        		.setTitle('» ERROR')
        		.setDescription('» <@' + reciever.toString().replace(/\D/g, '') + '> has to decide this!')
        		.setFooter({ text: '» ' + version });

            if (interaction.guildLocale == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» <@' + reciever.toString().replace(/\D/g, '') + '> muss das entscheiden!')
        		    .setFooter({ text: '» ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] TICTACTOE : YES : NOTALLOWED')
            return interaction.message.edit({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Check if Person is already in a Lobby
        let lobby
        try {
            eval('memorys' + interaction.user.id.toString().replace(/\D/g, ''))
            lobby = true
        } catch (e) {
            lobby = false
        }
        if (lobby) {
            // Create Embed
            let message = new EmbedBuilder()
        		.setTitle('» ERROR')
        		.setDescription('» You are already in a Lobby!')
        		.setFooter({ text: '» ' + version });

            if (interaction.guildLocale == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» Du bist schon in einer Lobby!')
        		    .setFooter({ text: '» ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] TICTACTOE : ' + reciever.toString().replace(/\D/g, '') + ' : ALREADYLOBBY')
            return interaction.message.edit({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Check if Reciever is already in a Lobby
        try {
            eval('memorys' + reciever.toString().replace(/\D/g, ''))
            lobby = true
        } catch (e) {
            lobby = false
        }
        if (lobby) {
            // Check if Reciever is Person
            if (interaction.user.id.replace(/\D/g, '') == reciever.toString().replace(/\D/g, '')) return

            // Create Embed
            let message = new EmbedBuilder()
        		.setTitle('» ERROR')
        		.setDescription('» <@' + reciever.toString().replace(/\D/g, '') + '> is already in a Lobby!')
        		.setFooter({ text: '» ' + version });

            if (interaction.guildLocale == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» <@' + reciever.toString().replace(/\D/g, '') + '> ist schon in einer Lobby!')
        		    .setFooter({ text: '» ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] TICTACTOE : ' + sender.toString().replace(/\D/g, '') + ' : ALREADYLOBBY')
            return interaction.message.edit({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Check if Sender is already in a Lobby
        try {
            eval('memorys' + sender.toString().replace(/\D/g, ''))
            lobby = true
        } catch (e) {
            lobby = false
        }
        if (lobby) {
            // Check if Sender is Person
            if (interaction.user.id.replace(/\D/g, '') == sender.toString().replace(/\D/g, '')) return

            // Create Embed
            let message = new EmbedBuilder()
        		.setTitle('» ERROR')
        		.setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> is already in a Lobby!')
        		.setFooter({ text: '» ' + version });

            if (interaction.guildLocale == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> ist schon in einer Lobby!')
        		    .setFooter({ text: '» ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] TICTACTOE : ' + reciever.toString().replace(/\D/g, '') + ' : ALREADYLOBBY')
            return interaction.message.edit({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Check for enough Money
        if (balance < bet) {
            const missing = bet - balance
            
            // Create Embed
            let message = new EmbedBuilder()
            	.setTitle('» ERROR')
  				.setDescription('» You dont have enough Money for that, you are missing **$' + missing + '**!')
            	.setFooter({ text: '» ' + version });

            if (interaction.guildLocale == "de") {
                message = new EmbedBuilder()
            	    .setTitle('» FEHLER')
  				    .setDescription('» Du hast dafür nicht genug Geld, dir fehlen **' + missing + '€**!')
            	    .setFooter({ text: '» ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] TICTACTOE : ' + reciever.toString().replace(/\D/g, '') + ' : ' + bet + '€ : NOTENOUGHMONEY')
            return interaction.message.edit({ embeds: [message.toJSON()], ephemeral: true })
        }
        if (otherbalance < bet) {
            const missing = bet - otherbalance
            
            // Create Embed
            let message = new EmbedBuilder()
            	.setTitle('» ERROR')
  				.setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> doesnt have enough Money, he is Missing **$' + missing + '**!')
            	.setFooter({ text: '» ' + version });

            if (interaction.guildLocale == "de") {
                message = new EmbedBuilder()
            	    .setTitle('» FEHLER')
  				    .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> hat nicht genug Geld, im fehlen **' + missing + '€**!')
            	    .setFooter({ text: '» ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] TICTACTOE : ' + reciever.toString().replace(/\D/g, '') + ' : ' + bet + '€ : NOTENOUGHMONEY')
            return interaction.message.edit({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Create Buttons
        let row1 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('TTT-1-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('TTT-2-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('TTT-3-' + bet)
					.setStyle(ButtonStyle.Secondary),
			);
        let row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('TTT-4-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('TTT-5-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('TTT-6-' + bet)
					.setStyle(ButtonStyle.Secondary),
			);
        let row3 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('TTT-7-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('TTT-8-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('TTT-9-' + bet)
					.setStyle(ButtonStyle.Secondary),
			);

        // Set Variable
        eval('global.ttts' + sender.toString().replace(/\D/g, '') + ' = true')
        eval('global.ttts' + reciever.toString().replace(/\D/g, '') + ' = true')

        eval('global.tttdatap' + sender.toString().replace(/\D/g, '') + ' = 0')
        eval('global.tttdatap' + reciever.toString().replace(/\D/g, '') + ' = 0')

        eval('global.tttdatatu' + sender.toString().replace(/\D/g, '') + ' = ' + sender.toString().replace(/\D/g, ''))
        eval('global.tttdatatuf' + sender.toString().replace(/\D/g, '') + ' = 0')

        eval('global.tttdata1a' + sender.toString().replace(/\D/g, '') + ' = []')
        eval('global.tttdata2a' + sender.toString().replace(/\D/g, '') + ' = []')

        eval('global.tttdatapc' + sender.toString().replace(/\D/g, '') + ' = []')
        eval('global.tttdatapc' + reciever.toString().replace(/\D/g, '') + ' = []')
        eval('global.tttdatapcn' + sender.toString().replace(/\D/g, '') + ' = []')
        eval('global.tttdatapcn' + reciever.toString().replace(/\D/g, '') + ' = []')
        eval('global.tttdatapca' + sender.toString().replace(/\D/g, '') + ' = 0')
        eval('global.tttdatapca' + reciever.toString().replace(/\D/g, '') + ' = 0')

        eval('global.tttdataf1' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.tttdataf2' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.tttdataf3' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.tttdataf4' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.tttdataf5' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.tttdataf6' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.tttdataf7' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.tttdataf8' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.tttdataf9' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')

        eval('global.tttdatabc1' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.tttdatabc2' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.tttdatabc3' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.tttdatabc4' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.tttdatabc5' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.tttdatabc6' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.tttdatabc7' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.tttdatabc8' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.tttdatabc9' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')

        eval('global.tttdatad1' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.tttdatad2' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.tttdatad3' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.tttdatad4' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.tttdatad5' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.tttdatad6' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.tttdatad7' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.tttdatad8' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.tttdatad9' + sender.toString().replace(/\D/g, '') + ' = false')

        // Transfer Money
        bals.rem(sender.toString().replace(/\D/g, ''), bet)
        bals.rem(reciever.toString().replace(/\D/g, ''), bet)

        // Create Embed
        let message = new EmbedBuilder()
            .setTitle('» MEMORY')
            .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> is playing Tic Tac Toe with <@' + reciever.toString().replace(/\D/g, '') + '>!\nThe Bet is **$' + bet + '**\n\n🔵 » <@' + sender.toString().replace(/\D/g, '') + '>\n🔴 » <@' + reciever.toString().replace(/\D/g, '') + '>')
            .setFooter({ text: '» ' + version + ' » CURRENT TURN: 🔵' });

        if (interaction.guildLocale == "de") {
            message = new EmbedBuilder()
                .setTitle('» MEMORY')
                .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> spielt mit <@' + reciever.toString().replace(/\D/g, '') + '> Tic Tac Toe!\nDie Wette ist **' + bet + '€**\n\n🔵 » <@' + sender.toString().replace(/\D/g, '') + '>\n🔴 » <@' + reciever.toString().replace(/\D/g, '') + '>')
                .setFooter({ text: '» ' + version + ' » AM ZUG: 🔵' });
        }

        // Send Message
        console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] TICTACTOE : ' + sender.toString().replace(/\D/g, '') + ' : ACCEPT')
        return interaction.update({ embeds: [message.toJSON()], components: [row1, row2, row3] })
    }
}