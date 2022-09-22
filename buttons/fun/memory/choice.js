const { EmbedBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const memory = require('../../../commands/fun/memory');
const { version } = require('../../../config.json');

const wait = require('node:timers/promises').setTimeout;

// Function for Button Row Grabber
const rowget = async (button) => {
    let row, btn
    if (button < 21) { row = 3; btn = button-15 }
    if (button < 16) { row = 2; btn = button-10 }
    if (button < 11) { row = 1; btn = button-5 }
    if (button < 6) { row = 0; btn = button }

    const output = []
    output[0] = btn-1 // -1 So I dont have to do it before
    output[1] = row
    return output
}

module.exports = {
    data: {
        name: 'memory-choice'
    },
    async execute(interaction, client, lang, vote, bet, sel) {
        // Get Users
        const cache = interaction.message.embeds
        const description = cache[0].description.toString().replace(/[^\d@!]/g, '').split('!')[0].substring(1).split("@");
        const [sender, reciever] = description

        // Check if User is playing
        if (sender.toString().replace(/\D/g, '') != interaction.user.id && reciever.toString().replace(/\D/g, '') != interaction.user.id) {
            // Create Embed
            let message = new EmbedBuilder()
        		.setTitle('» ERROR')
        		.setDescription('» You arent playing!')
        		.setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» Du spielst garnicht mit!')
        		    .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[BTN] MEMORY : NOTPLAYING')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Check Turn
        if (interaction.user.id != bot.memory.get('TURN-' + sender)) {
            // Create Embed
            let message = new EmbedBuilder()
        		.setTitle('» ERROR')
        		.setDescription('» Its not your turn!')
        		.setFooter({ text: '» ' + vote + ' » ' + version });

            if (lang == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» Es ist nicht dein Zug!')
        		    .setFooter({ text: '» ' + vote + ' » ' + version });
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[BTN] MEMORY : NOTTURN')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Defer Reply
        await interaction.deferUpdate()

        // Translate Turn to Emoji
        let turnemoji
        if (bot.memory.get('TURN-' + sender) == sender) {
            turnemoji = '🔵'
        }
        if (bot.memory.get('TURN-' + sender) == reciever) {
            turnemoji = '🔴'
        }

        /// Set Variables
        let doflush = false
        // Select Field
        bot.memory.set('D_EMOJI-' + sel + '-' + sender, { id: bot.memory.get('I_EMOJI-' + sel + '-' + sender), name: 'MEMORY' })
        bot.memory.set('DISABLED-' + sel + '-' + sender, true)
        const comp = await rowget(parseInt(sel))
        interaction.message.components[comp[1]].components[comp[0]].data.disabled = true
        interaction.message.components[comp[1]].components[comp[0]].data.emoji = bot.memory.get('D_EMOJI-' + sel + '-' + sender)

        // Add Field Values to Cache
        bot.memory.get('C_PLAYERSELECT-' + interaction.user.id).push(bot.memory.get('I_EMOJI-' + sel + '-' + sender))
        bot.memory.get('B_PLAYERSELECT-' + interaction.user.id).push(sel)

        // Count Player Interactions Up by 1
        bot.memory.set('A_PLAYERSELECT-' + interaction.user.id, (parseInt(bot.memory.get('A_PLAYERSELECT-' + interaction.user.id))+1))

        // Check if its the 2nd Player Interaction
        if (bot.memory.get('A_PLAYERSELECT-' + interaction.user.id) === 2) {
            // Check if Both Fields have the same Emoji
            if (bot.memory.get('C_PLAYERSELECT-' + interaction.user.id)[0] === bot.memory.get('C_PLAYERSELECT-' + interaction.user.id)[1]) {
                // Add Point
                bot.memory.set('POINTS-' + interaction.user.id, (parseInt(bot.memory.get('POINTS-' + interaction.user.id))+1))

                // Get Button Position
                const comp1 = await rowget(bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[0])
                const comp2 = await rowget(bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[1])

                // Color the Fields
                if (interaction.user.id == sender) {
                    bot.memory.set('STYLE-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[0] + '-' + sender, ButtonStyle.Primary)
                    interaction.message.components[comp1[1]].components[comp1[0]].data.style = ButtonStyle.Primary
                    bot.memory.set('STYLE-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[1] + '-' + sender, ButtonStyle.Primary)
                    interaction.message.components[comp2[1]].components[comp2[0]].data.style = ButtonStyle.Primary
                }
                if (interaction.user.id == reciever) {
                    bot.memory.set('STYLE-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[0] + '-' + sender, ButtonStyle.Danger)
                    interaction.message.components[comp1[1]].components[comp1[0]].data.style = ButtonStyle.Danger
                    bot.memory.set('STYLE-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[1] + '-' + sender, ButtonStyle.Danger)
                    interaction.message.components[comp2[1]].components[comp2[0]].data.style = ButtonStyle.Danger
                }

                // Clear Cache Arrays
                bot.memory.set('A_PLAYERSELECT-' + interaction.user.id, 0)
                bot.memory.set('B_PLAYERSELECT-' + interaction.user.id, [])
                bot.memory.set('C_PLAYERSELECT-' + interaction.user.id, [])
            } else { // If they dont have the same Emoji
                // Get Button Positions
                const comp1 = await rowget(bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[0])
                const comp2 = await rowget(bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[1])

                // Clear the Fields
                interaction.message.components[comp1[1]].components[comp1[0]].data.disabled = false
                interaction.message.components[comp1[1]].components[comp1[0]].data.emoji = { id: '1020411843644243998', name: 'MEMORY' }
                interaction.message.components[comp2[1]].components[comp2[0]].data.disabled = false
                interaction.message.components[comp2[1]].components[comp2[0]].data.emoji = { id: '1020411843644243998', name: 'MEMORY' }

                bot.memory.set('DISABLED-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[0] + '-' + sender, false)
                bot.memory.set('DISABLED-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[1] + '-' + sender, false)

                // Turn Switcher
                console.log(bot.memory.get('TURN-' + sender))
                if (bot.memory.get('TURN-' + sender) == sender) {
                    bot.memory.set('TURN-' + sender, reciever)
                    turnemoji = '🔴'
                } else {
                    bot.memory.set('TURN-' + sender, sender)
                    turnemoji = '🔵'
                }
            }

            /// Actions that run in both Cases
            // DoFlush
            doflush = true
        }

        /*let se = false
        let sno = false
        let nums = []
        if (bot.memory.get('A_PLAYERSELECT-' + interaction.user.id) < 2) {
            if (bot.memory.get('E_PLAYERSELECT-' + interaction.user.id).includes(bot.memory.get('D_EMOJI-' + sel + '-' + sender))) {
                bot.memory.set('POINTS-' + interaction.user.id, (parseInt(bot.memory.get('POINTS-' + interaction.user.id))+1))
                bot.memory.set('A_PLAYERSTYLE-' + interaction.user.id, 0)

                if (interaction.user.id == sender.toString().replace(/\D/g, '')) {
                    bot.memory.set('STYLE-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[0] + '-' + sender, ButtonStyle.Primary)
                    bot.memory.set('STYLE-' + sel + '-' + sender, ButtonStyle.Primary)
                }
                if (interaction.user.id == reciever.toString().replace(/\D/g, '')) {
                    bot.memory.set('STYLE-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[0] + '-' + sender, ButtonStyle.Danger)
                    bot.memory.set('STYLE-' + sel + '-' + sender, ButtonStyle.Danger)
                }
                bot.memory.set('E-PLAYERSELECT-' + interaction.user.id, [])
                bot.memory.set('B-PLAYERSELECT-' + interaction.user.id, [])
                sno = true
                se = true
            }
        }
        if (bot.memory.get('A_PLAYERSELECT-' + interaction.user.id) < 2 && !sno) {
            if (!bot.memory.get('E_PLAYERSELECT-' + interaction.user.id).includes(bot.memory.get('D_EMOJI-' + sel + '-' + sender))) {
                bot.memory.get('E_PLAYERSELECT-' + interaction.user.id).push(bot.memory.get('D_EMOJI-' + sel + '-' + sender))
                bot.memory.get('B_PLAYERSELECT-' + interaction.user.id).push(sel)
                bot.memory.set('DISABLED-' + sel + '-' + sender, true)
                se = false
            }
        }
        if (bot.memory.get('A_PLAYERSELECT-' + interaction.user.id) > 1) {
            nums = []
            nums[0] = bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[0]
            nums[1] = bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[1]


            // Turn Switcher
            if (bot.memory.get('TURN-' + sender) == sender) {
                bot.memory.set('TURN-' + sender, reciever)
                turnemoji = '🔴'
            }
            if (bot.memory.get('TURN-' + sender) == reciever) {
                bot.memory.set('TURN-' + sender, sender)
                turnemoji = '🔵'
            }


            bot.memory.set('A_PLAYERSELECT-' + interaction.user.id, 0)
            bot.memory.set('A_PLAYERSELECT-' + interaction.user.id, [])
            bot.memory.set('B_PLAYERSELECT-' + interaction.user.id, [])
            se = true
        }
        console.log(bot.memory.get('A_PLAYERSELECT-' + interaction.user.id))*/

        // Edit Buttons
        if (doflush) {
            let i
            for (i = 0; i < 20; i++) {
                const row = Math.floor(i / 5);
                const button = interaction.message.components[row].components[i % 5];
              
                button.data.label = null
                button.data.emoji = bot.memory.get('D_EMOJI-' + (i+1) + '-' + sender)
                button.data.style = bot.memory.get('STYLE-' + (i+1) + '-' + sender)
                button.data.disabled = true
            }
        }

        // Create Embed
        let message = new EmbedBuilder()
            .setTitle('» MEMORY')
            .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> is playing Memory with <@' + reciever.toString().replace(/\D/g, '') + '>!\nThe Bet is **$' + bet + '**\n\n🔵 » Points of <@' + sender.toString().replace(/\D/g, '') + '> are **' + bot.memory.get('POINTS-' + sender)+ '**\n🔴 » Points of <@' + reciever.toString().replace(/\D/g, '') + '> are **' + bot.memory.get('POINTS-' + reciever) + '**')
            .setFooter({ text: '» ' + version + ' » CURRENT TURN: ' + turnemoji });

        if (lang == "de") {
            message = new EmbedBuilder()
                .setTitle('» MEMORY')
                .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> spielt mit <@' + reciever.toString().replace(/\D/g, '') + '> Memory!\nDie Wette ist **' + bet + '€**\n\n🔵 » Punkte von <@' + sender.toString().replace(/\D/g, '') + '> sind **' + bot.memory.get('POINTS-' + sender) + '**\n🔴 » Punkte von <@' + reciever.toString().replace(/\D/g, '') + '> sind **' + bot.memory.get('POINTS-' + reciever) +'**')
                .setFooter({ text: '» ' + version + ' » AM ZUG: ' + turnemoji });
        }

        // Send Message
        bot.log(false, interaction.user.id, interaction.guild.id, '[BTN] MEMORY : ' + sel + ' : ' + bot.memory.get('I_EMOJI-' + sel + '-' + sender))
        interaction.editReply({ embeds: [message.toJSON()], components: interaction.message.components, ephemeral: true })

        // Check for Special Conditions
        if (!doflush) return
        await wait(2000)

        // Remove Emojis
        bot.memory.set('D_EMOJI-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[0] + '-' + sender, { id: '1020411843644243998', name: 'MEMORY' })
        bot.memory.set('D_EMOJI-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[1] + '-' + sender, { id: '1020411843644243998', name: 'MEMORY' })
        bot.memory.set('DISABLED-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[0] + '-' + sender, false)
        bot.memory.set('DISABLED-' + bot.memory.get('B_PLAYERSELECT-' + interaction.user.id)[1] + '-' + sender, false)

        // Clear Cache Arrays
        bot.memory.set('A_PLAYERSELECT-' + interaction.user.id, 0)
        bot.memory.set('B_PLAYERSELECT-' + interaction.user.id, [])
        bot.memory.set('C_PLAYERSELECT-' + interaction.user.id, [])

        // Edit Buttons
        let i
        for (i = 0; i < 20; i++) {
            const row = Math.floor(i / 5);
            const button = interaction.message.components[row].components[i % 5];
            
            button.data.label = null
            button.data.emoji = bot.memory.get('D_EMOJI-' + (i+1) + '-' + sender)
            button.data.style = bot.memory.get('STYLE-' + (i+1) + '-' + sender)
            button.data.disabled = bot.memory.get('DISABLED-' + (i+1) + '-' + sender)
        }

        // Check if Round has ended
        if((bot.memory.get('POINTS-' + sender) + bot.memory.get('POINTS-' + reciever)) == 10) {
            // Check Who Won
            const senderpoints = bot.memory.get('POINTS-' + sender)
            const recieverpoints = bot.memory.get('POINTS-' + reciever)
            let winner
            if (parseInt(senderpoints) > parseInt(recieverpoints)) {
                winner = '<@' + sender + '>'
            } else if (parseInt(senderpoints) < parseInt(recieverpoints)) {
                winner = '<@' + reciever + '>'
            } else {
                winner = '**Noone**'
                if (lang == "de") {
                    winner = '**Niemand**'
                }
            } 

            // Transfer Money
            const betwon = parseInt(bet) * 2
            if (winner != '**Noone**' && winner != '**Niemand**') {
                bals.add(winner.toString().replace(/\D/g, ''), parseInt(betwon))
            } else {
                bals.add(sender.toString().replace(/\D/g, ''), parseInt(bet))
                bals.add(reciever.toString().replace(/\D/g, ''), parseInt(bet))
            }

            // Create Embed
            message = new EmbedBuilder()
                .setTitle('» MEMORY')
                .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> is playing Memory with <@' + reciever.toString().replace(/\D/g, '') + '>!\nThe Bet is **$' + bet + '**\n\n🔵 » Points of <@' + sender.toString().replace(/\D/g, '') + '> are **' + bot.memory.get('POINTS-' + sender) + '**\n🔴 » Points of <@' + reciever.toString().replace(/\D/g, '') + '> are **' + bot.memory.get('POINTS-' + reciever) + '**\n\n' + winner + ' has won **$' + betwon + '**!')
                .setFooter({ text: '» ' + version });

            if (lang == "de") {
                message = new EmbedBuilder()
                    .setTitle('» MEMORY')
                    .setDescription('» <@' + sender.toString().replace(/\D/g, '') + '> spielt mit <@' + reciever.toString().replace(/\D/g, '') + '> Memory!\nDie Wette ist **' + bet + '€**\n\n🔵 » Punkte von <@' + sender.toString().replace(/\D/g, '') + '> sind **' + bot.memory.get('POINTS-' + sender) + '**\n🔴 » Punkte von <@' + reciever.toString().replace(/\D/g, '') + '> sind **' + bot.memory.get('POINTS-' + reciever) +'**\n\n' + winner + ' hat **' + betwon + '€** gewonnen!')
                    .setFooter({ text: '» ' + version });
            }

            // Delete Variables
            bot.game.delete('PLAYING-' + sender)
            bot.game.delete('PLAYING-' + reciever)

            bot.memory.delete('TURN-' + sender,)
            bot.memory.delete('A_PLAYERSELECT-' + sender,)
            bot.memory.delete('A_PLAYERSELECT-' + reciever)
            bot.memory.delete('POINTS-' + sender)
            bot.memory.delete('POINTS-' + reciever)

            bot.memory.delete('E_PLAYERSELECT-' + sender)
            bot.memory.delete('E_PLAYERSELECT-' + reciever)
            bot.memory.delete('B_PLAYERSELECT-' + reciever)
            bot.memory.delete('B_PLAYERSELECT-' + sender)
            bot.memory.delete('C_PLAYERSELECT-' + reciever)
            bot.memory.delete('C_PLAYERSELECT-' + sender)

            // Update Message
            return interaction.message.edit({ embeds: [message.toJSON()], components: interaction.message.components, ephemeral: true })
        }

        // Update Message
        return interaction.message.edit({ embeds: [message.toJSON()], components: interaction.message.components, ephemeral: true })
    }
}