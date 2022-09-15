const { EmbedBuilder } = require('@discordjs/builders')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { version } = require('../../../config.json')

const wait = require('node:timers/promises').setTimeout

module.exports = {
    data: {
        name: 'memory-yes'
    },
    async execute(interaction, client, lang, vote, bet, sel) {
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
        		.setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang.toString() == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» <@' + reciever.toString().replace(/\D/g, '') + '> muss das entscheiden!')
        		    .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] MEMORY : YES : NOTALLOWED')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
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
        		.setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang.toString() == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» Du bist schon in einer Lobby!')
        		    .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] MEMORY : ' + reciever.toString().replace(/\D/g, '') + ' : ALREADYLOBBY')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
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
        		.setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang.toString() == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» <@' + reciever.toString().replace(/\D/g, '') + '> ist schon in einer Lobby!')
        		    .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] MEMORY : ' + sender.toString().replace(/\D/g, '') + ' : ALREADYLOBBY')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
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
        		.setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang.toString() == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> ist schon in einer Lobby!')
        		    .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] MEMORY : ' + reciever.toString().replace(/\D/g, '') + ' : ALREADYLOBBY')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Check for enough Money
        if (balance < bet) {
            const missing = bet - balance
            
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
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] MEMORY : ' + reciever.toString().replace(/\D/g, '') + ' : ' + bet + '€ : NOTENOUGHMONEY')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }
        if (otherbalance < bet) {
            const missing = bet - otherbalance
            
            // Create Embed
            let message = new EmbedBuilder()
            	.setTitle('» ERROR')
  				.setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> doesnt have enough Money, he is Missing **$' + missing + '**!')
            	.setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang.toString() == "de") {
                message = new EmbedBuilder()
            	    .setTitle('» FEHLER')
  				    .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> hat nicht genug Geld, im fehlen **' + missing + '€**!')
            	    .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] MEMORY : ' + reciever.toString().replace(/\D/g, '') + ' : ' + bet + '€ : NOTENOUGHMONEY')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Defer Reply
        await interaction.deferUpdate()

        // Create Buttons
        let row1 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-1-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-2-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-3-' + bet)
					.setStyle(ButtonStyle.Secondary),
                
                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-4-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-5-' + bet)
					.setStyle(ButtonStyle.Secondary),
			);
        let row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-6-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-7-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-8-' + bet)
					.setStyle(ButtonStyle.Secondary),
                
                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-9-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-10-' + bet)
					.setStyle(ButtonStyle.Secondary),
			);
        let row3 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-11-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-12-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-13-' + bet)
					.setStyle(ButtonStyle.Secondary),
                
                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-14-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-15-' + bet)
					.setStyle(ButtonStyle.Secondary),
			);
        let row4 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-16-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-17-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-18-' + bet)
					.setStyle(ButtonStyle.Secondary),
                
                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-19-' + bet)
					.setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setEmoji('1017050508252418068')
                    .setCustomId('MEMORY-20-' + bet)
					.setStyle(ButtonStyle.Secondary),
			);

        // Set Variables
        eval('global.memorys' + sender.toString().replace(/\D/g, '') + ' = true')
        eval('global.memorys' + reciever.toString().replace(/\D/g, '') + ' = true')
        eval('delete memorylc' + sender.replace(/\D/g, ''))

        eval('global.memorydatap' + sender.toString().replace(/\D/g, '') + ' = 0')
        eval('global.memorydatap' + reciever.toString().replace(/\D/g, '') + ' = 0')

        eval('global.memorydatatu' + sender.toString().replace(/\D/g, '') + ' = ' + sender.toString().replace(/\D/g, ''))

        eval('global.memorydatapc' + sender.toString().replace(/\D/g, '') + ' = []')
        eval('global.memorydatapc' + reciever.toString().replace(/\D/g, '') + ' = []')
        eval('global.memorydatapcn' + sender.toString().replace(/\D/g, '') + ' = []')
        eval('global.memorydatapcn' + reciever.toString().replace(/\D/g, '') + ' = []')
        eval('global.memorydatapca' + sender.toString().replace(/\D/g, '') + ' = 0')
        eval('global.memorydatapca' + reciever.toString().replace(/\D/g, '') + ' = 0')

        eval('global.memorydataf1' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf2' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf3' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf4' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf5' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf6' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf7' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf8' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf9' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf10' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf11' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf12' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf13' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf14' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf15' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf16' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf17' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf18' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf19' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')
        eval('global.memorydataf20' + sender.toString().replace(/\D/g, '') + ' = "1017050508252418068"')

        eval('global.memorydatabc1' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc2' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc3' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc4' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc5' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc6' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc7' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc8' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc9' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc10' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc11' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc12' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc13' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc14' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc15' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc16' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc17' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc18' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc19' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')
        eval('global.memorydatabc20' + sender.toString().replace(/\D/g, '') + ' = ButtonStyle.Secondary')

        eval('global.memorydatad1' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad2' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad3' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad4' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad5' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad6' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad7' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad8' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad9' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad10' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad11' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad12' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad13' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad14' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad15' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad16' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad17' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad18' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad19' + sender.toString().replace(/\D/g, '') + ' = false')
        eval('global.memorydatad20' + sender.toString().replace(/\D/g, '') + ' = false')

        const emojis = []
        const emojis2 = []

        // Generate Emoji Grid
        const emojilistraw = [
            "1017444934904729611",
            "1017445104685961236",
            "1017444736610619453",
            "1017445667347636294",
            "1017445007910772766",
            "1017445430310752336",
            "1017445761291669604",
            "1017445557842739221",
            "1017444837257134100",
            "1017444467353063474",
            "1017445246516334653",
            "1017445352078590093",
            "1017847213067604009",
            "1018083730688057394",
            "1018079045461741569",
            "1018079253004308490",
            "1018079408185163796",
            "1018927449368703098",
            "1014209756103184455",
            "1014209757214679121",
            "1018928177353072700",
            "1018928654568407243",
            "1018928987306737745",
            "1018929698916544723",
            "1018930597856559144",
            "1018930852513726534",
            "1019235162569068615",
            "1019236814768316466",
            "1014209765431324733",
            "1019238968346284084",
            "1019239168573968385",
            "1019247388587728936",
            "1019247603843596368",
            "1019247987970560010",
            "1019248618709983283",
            "1019248854694109276",
            "1019249349890429101",
            "1019250108681949315",
            "1019250327440068671",
            "1019251675644559500",
            "1019253539471642694",
            "1019254370124173352",
            "1019254562214903869",
            "790990037982248971",
        ]
        const copied = [...emojilistraw]
        const emojilist = []
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(
                Math.random() * copied.length
            )
            emojilist.push(
                copied[randomIndex]
            )
            copied.splice(randomIndex, 1)
        }

        let emojistate = false
        let emojinumber = 1
        let skipother = false
        const rdo = async () => {
            while (emojistate == false) {
                const emojirandom = await Math.floor(Math.random() * (10 - 1 + 1)) + 1
                const emoji = await emojilist[emojirandom - 1]
                skipother = false

                if (await typeof emoji !== 'undefined' && await typeof emojinumber !== 'undefined') {
                    if (await !emojis.includes(emoji)) {
                        emojis[emojinumber - 1] = await emoji
                        await wait(25)
                        await eval('global.memorydatag' + emojinumber + sender.toString().replace(/\D/g, '') + ' = "' + emoji + '"')
                        emojinumber = emojinumber + 1
                        if (emojinumber > 20) {
                            emojistate = true
                            return
                        }
                        skipother = true
                    }
                    if (await !emojis2.includes(emoji) && skipother != true) {
                        emojis2[emojinumber - 1] = await emoji
                        await wait(25)
                        await eval('global.memorydatag' + emojinumber + sender.toString().replace(/\D/g, '') + ' = "' + emoji + '"')
                        emojinumber = emojinumber + 1
                        if (emojinumber > 20) {
                            emojistate = true
                            return
                        }
                    }
                }

            }
        }
        await rdo()

        // Transfer Money
        bals.rem(sender.toString().replace(/\D/g, ''), bet)
        bals.rem(reciever.toString().replace(/\D/g, ''), bet)

        // Create Embed
        let message = new EmbedBuilder()
            .setTitle('» MEMORY')
            .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> is playing Memory with <@' + reciever.toString().replace(/\D/g, '') + '>!\nThe Bet is **$' + bet + '**\n\n🔵 » Points of <@' + sender.toString().replace(/\D/g, '') + '> are **0**\n🔴 » Points of <@' + reciever.toString().replace(/\D/g, '') + '> are **0**')
            .setFooter({ text: '» ' + version + ' » CURRENT TURN: 🔵' });

        if (lang.toString() == "de") {
            message = new EmbedBuilder()
                .setTitle('» MEMORY')
                .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> spielt mit <@' + reciever.toString().replace(/\D/g, '') + '> Memory!\nDie Wette ist **' + bet + '€**\n\n🔵 » Punkte von <@' + sender.toString().replace(/\D/g, '') + '> sind **0**\n🔴 » Punkte von <@' + reciever.toString().replace(/\D/g, '') + '> sind **0**')
                .setFooter({ text: '» ' + version + ' » AM ZUG: 🔵' });
        }

        // Send Message
        console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [' + interaction.user.id.replace(/\D/g, '') + ' @ ' + interaction.guild.id + '] [BTN] MEMORY : ' + sender.toString().replace(/\D/g, '') + ' : ACCEPT')
        return interaction.editReply({ embeds: [message.toJSON()], components: [row1, row2, row3, row4] })
    }
}