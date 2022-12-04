import { EmbedBuilder } from "discord.js"
import { setTimeout as wait } from "timers/promises"

// Function for Button Row Grabber
const rowGet = (button: number) => {
    let row: number, btn: number
    if (button < 10) { row = 2; btn = button-6 }
    if (button < 7) { row = 1; btn = button-3 }
    if (button < 4) { row = 0; btn = button }

    const output = []
    if (btn > 0) output[0] = (btn - 1)
    else output[0] = btn
    output[1] = row

    return output
}

import * as bot from "@functions/bot.js"
import Client from "@interfaces/Client.js"
import { ButtonInteraction } from "discord.js"
export default {
    data: {
        name: 'ttt-choice'
    },

    async execute(interaction: ButtonInteraction, client: Client, lang: string, vote: string, bet: number, sel: number) {
        // Get Users
        const cache = interaction.message.embeds
        const description = cache[0].description.toString().replace(/[^\d@!]/g, '').split('!')[0].substring(1).split("@")
        const [ sender, reciever ] = description

        // Check if User is playing
        if (sender !== interaction.user.id && reciever !== interaction.user.id) {
            // Create Embed
            let message = new EmbedBuilder().setColor(0x37009B)
        		.setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
        		.setDescription('» You arent playing!')
        		.setFooter({ text: '» ' + vote + ' » ' + client.config.version })

            if (lang === 'de') {
                message = new EmbedBuilder().setColor(0x37009B)
        		    .setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
        		    .setDescription('» Du spielst garnicht mit!')
        		    .setFooter({ text: '» ' + vote + ' » ' + client.config.version })
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[BTN] TICTACTOE : NOTPLAYING')
            return interaction.reply({ embeds: [message], ephemeral: true })
        }

        // Check Turn
        const turn = bot.ttt.get('TURN-' + sender)
        if (interaction.user.id !== turn) {
            // Create Embed
            let message = new EmbedBuilder().setColor(0x37009B)
        		.setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
        		.setDescription('» Its not your turn!')
        		.setFooter({ text: '» ' + vote + ' » ' + client.config.version })

            if (lang === 'de') {
                message = new EmbedBuilder().setColor(0x37009B)
        		    .setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
        		    .setDescription('» Es ist nicht dein Zug!')
        		    .setFooter({ text: '» ' + vote + ' » ' + client.config.version })
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[BTN] TICTACTOE : NOTTURN')
            return interaction.reply({ embeds: [message], ephemeral: true })
        }

        // Defer Reply
        await interaction.deferUpdate()

        // Translate Turn to Emoji
        let turnemoji: string
        if (turn === sender) turnemoji = '🔵'
        if (turn === reciever) turnemoji = '🔴'

        // Turn Switcher
        if (turn === sender) {
            bot.ttt.set('TURN-' + sender, reciever)
            turnemoji = '🔴'
        }; if (turn === reciever) {
            bot.ttt.set('TURN-' + sender, sender)
            turnemoji = '🔵'
        }

        // Edit Buttons
        const comp = rowGet(sel)
        if (interaction.user.id === sender) {
            bot.ttt.set('FIELD-' + sel + '-' + sender, sender)
            bot.ttt.get('FIELDS-' + sender).push(sel);

            (interaction.message.components[comp[1]].components[comp[0]].data.disabled as boolean) = true;
            (interaction.message.components[comp[1]].components[comp[0]] as any).data.emoji = { id: '1020411088245903451', name: 'TICTACTOE' };
            (interaction.message.components[comp[1]].components[comp[0]] as any).data.style = 1;
        }; if (interaction.user.id === reciever) {
            bot.ttt.set('FIELD-' + sel + '-' + sender, reciever)
            bot.ttt.get('FIELDS-' + reciever).push(sel);

            (interaction.message.components[comp[1]].components[comp[0]].data.disabled as boolean) = true;
            (interaction.message.components[comp[1]].components[comp[0]] as any).data.emoji = { id: '1020411023414542447', name: 'TICTACTOE' };
            (interaction.message.components[comp[1]].components[comp[0]] as any).data.style = 4;
        }

        // Create Embed
        let message = new EmbedBuilder().setColor(0x37009B)
            .setTitle('<:GAMEPAD:1024395990679167066> » TICTACTOE')
            .setDescription('» <@' + sender + '> is playing Tic Tac Toe with <@' + reciever + '>!\nThe Bet is **$' + bet + '**\n\n🔵 » <@' + sender + '>\n🔴 » <@' + reciever + '>')
            .setFooter({ text: '» ' + client.config.version + ' » CURRENT TURN: ' + turnemoji })

        if (lang === 'de') {
            message = new EmbedBuilder().setColor(0x37009B)
                .setTitle('<:GAMEPAD:1024395990679167066> » TICTACTOE')
                .setDescription('» <@' + sender + '> spielt mit <@' + reciever + '> Tic Tac Toe!\nDie Wette ist **' + bet + '€**\n\n🔵 » <@' + sender + '>\n🔴 » <@' + reciever + '>')
                .setFooter({ text: '» ' + client.config.version + ' » AM ZUG: ' + turnemoji })
        }

        // Send Message
        bot.log(false, interaction.user.id, interaction.guild.id, '[BTN] TICTACTOE : ' + sel)
        interaction.editReply({ embeds: [message], components: interaction.message.components, ephemeral: true } as any)
        await wait(500)

        /// Check if Anyone Won
        const fields = []
        let won = false

        // Horizontal
        if (
            bot.ttt.get('FIELD-1-' + sender) === bot.ttt.get('FIELD-2-' + sender) &&
            bot.ttt.get('FIELD-1-' + sender) === bot.ttt.get('FIELD-3-' + sender) &&
            bot.ttt.get('FIELD-1-' + sender) !== null &&
            bot.ttt.get('FIELD-2-' + sender) !== null &&
            bot.ttt.get('FIELD-3-' + sender) !== null
        ) { won = true; fields.push(1, 2, 3) }
        if (
            bot.ttt.get('FIELD-4-' + sender) === bot.ttt.get('FIELD-5-' + sender) &&
            bot.ttt.get('FIELD-4-' + sender) === bot.ttt.get('FIELD-6-' + sender) &&
            bot.ttt.get('FIELD-3-' + sender) !== null &&
            bot.ttt.get('FIELD-4-' + sender) !== null &&
            bot.ttt.get('FIELD-5-' + sender) !== null
        ) { won = true; fields.push(3, 4, 5) }
        if (
            bot.ttt.get('FIELD-7-' + sender) === bot.ttt.get('FIELD-8-' + sender) &&
            bot.ttt.get('FIELD-7-' + sender) === bot.ttt.get('FIELD-9-' + sender) &&
            bot.ttt.get('FIELD-7-' + sender) !== null &&
            bot.ttt.get('FIELD-8-' + sender) !== null &&
            bot.ttt.get('FIELD-9-' + sender) !== null
        ) { won = true; fields.push(7, 8, 9) }

        // Vertical
        if (
            bot.ttt.get('FIELD-1-' + sender) === bot.ttt.get('FIELD-4-' + sender) &&
            bot.ttt.get('FIELD-1-' + sender) === bot.ttt.get('FIELD-7-' + sender) &&
            bot.ttt.get('FIELD-1-' + sender) !== null &&
            bot.ttt.get('FIELD-4-' + sender) !== null &&
            bot.ttt.get('FIELD-7-' + sender) !== null
        ) { won = true; fields.push(1, 4, 7) }
        if (
            bot.ttt.get('FIELD-2-' + sender) === bot.ttt.get('FIELD-5-' + sender) &&
            bot.ttt.get('FIELD-2-' + sender) === bot.ttt.get('FIELD-8-' + sender) &&
            bot.ttt.get('FIELD-2-' + sender) !== null &&
            bot.ttt.get('FIELD-5-' + sender) !== null &&
            bot.ttt.get('FIELD-8-' + sender) !== null
        ) { won = true; fields.push(2, 5, 8) }
        if (
            bot.ttt.get('FIELD-3-' + sender) === bot.ttt.get('FIELD-6-' + sender) &&
            bot.ttt.get('FIELD-3-' + sender) === bot.ttt.get('FIELD-9-' + sender) &&
            bot.ttt.get('FIELD-3-' + sender) !== null &&
            bot.ttt.get('FIELD-6-' + sender) !== null &&
            bot.ttt.get('FIELD-9-' + sender) !== null
        ) { won = true; fields.push(3, 6, 9) }

        // Diagonal
        if (
            bot.ttt.get('FIELD-1-' + sender) === bot.ttt.get('FIELD-5-' + sender) &&
            bot.ttt.get('FIELD-1-' + sender) === bot.ttt.get('FIELD-9-' + sender) &&
            bot.ttt.get('FIELD-1-' + sender) !== null &&
            bot.ttt.get('FIELD-5-' + sender) !== null &&
            bot.ttt.get('FIELD-9-' + sender) !== null
        ) { won = true; fields.push(1, 5, 9) }
        if (
            bot.ttt.get('FIELD-3-' + sender) === bot.ttt.get('FIELD-5-' + sender) &&
            bot.ttt.get('FIELD-3-' + sender) === bot.ttt.get('FIELD-7-' + sender) &&
            bot.ttt.get('FIELD-3-' + sender) !== null &&
            bot.ttt.get('FIELD-5-' + sender) !== null &&
            bot.ttt.get('FIELD-7-' + sender) !== null
        ) { won = true; fields.push(3, 5, 7) }

        // Check if Round has ended
        if (won || (bot.ttt.get('FIELDS-' + sender).length + bot.ttt.get('FIELDS-' + reciever).length) === 9) {
            // Check Who Won
            let winner = '**Noone**', rawWinner: string
            if (lang === 'de') winner = '**Niemand**'

            if (won) {
                rawWinner = bot.ttt.get('FIELD-' + fields[0] + '-' + sender)
                winner = '<@' + bot.ttt.get('FIELD-' + fields[0] + '-' + sender) + '>'
            }

            fields.forEach((field: number) => {
                const comp = rowGet(field);

                (interaction.message.components[comp[1]].components[comp[0]] as any).data.style = 3
            })

            // Transfer Money
            const betwon = bet * 2; let transaction: any
            if (rawWinner) {
                bot.money.add(interaction.guild.id, rawWinner, betwon)

                // Log Transaction
                if (betwon > 0) transaction = await bot.transactions.log({
                    success: true,
                    sender: {
                        id: (rawWinner === sender ? reciever : sender),
                        amount: betwon,
                        type: 'negative'
                    }, reciever: {
                        id: rawWinner,
                        amount: betwon,
                        type: 'positive'
                    }
                })
            } else {
                bot.money.add(interaction.guild.id, sender, bet)
                bot.money.add(interaction.guild.id, reciever, bet)
            }

            // Create Embed
            message = new EmbedBuilder().setColor(0x37009B)
                .setTitle('<:GAMEPAD:1024395990679167066> » TICTACTOE')
                .setDescription('» <@' + sender + '> is playing Tic Tac Toe with <@' + reciever + '>!\nThe Bet is **$' + bet + '**\n\n🔵 » <@' + sender + '>\n🔴 » <@' + reciever + '>\n\n<:AWARD:1024385473524793445> ' + winner + ' has won **$' + betwon + '**.' + ((typeof transaction === 'object') ? `\nID: ${transaction.id}` : ''))
                .setFooter({ text: '» ' + vote + ' » ' + client.config.version })

            if (lang === 'de') {
                message = new EmbedBuilder().setColor(0x37009B)
                    .setTitle('<:GAMEPAD:1024395990679167066> » TICTACTOE')
                    .setDescription('» <@' + sender + '> spielt mit <@' + reciever + '> Tic Tac Toe!\nDie Wette ist **' + bet + '€**\n\n🔵 » <@' + sender + '>\n🔴 » <@' + reciever + '>\n\n<:AWARD:1024385473524793445> ' + winner + ' hat **' + betwon + '€** gewonnen.' + ((typeof transaction === 'object') ? `\nID: ${transaction.id}` : ''))
                    .setFooter({ text: '» ' + vote + ' » ' + client.config.version })
            }

            // Edit Buttons
            for (let i = 0; i <= 9; i++) {
                const comp = rowGet(i);

                (interaction.message.components[comp[1]].components[comp[0]].data.disabled as boolean) = true
            }

            // Delete Variables
            bot.game.delete('PLAYING-' + sender)
            bot.game.delete('PLAYING-' + reciever)

            bot.ttt.delete('TURN-' + sender)
            bot.ttt.delete('TURN-' + reciever)

            bot.ttt.delete('FIELDS-' + sender)
            bot.ttt.delete('FIELDS-' + reciever)

            bot.ttt.delete('FIELD-1-' + sender)
            bot.ttt.delete('FIELD-2-' + sender)
            bot.ttt.delete('FIELD-3-' + sender)
            bot.ttt.delete('FIELD-4-' + sender)
            bot.ttt.delete('FIELD-5-' + sender)
            bot.ttt.delete('FIELD-6-' + sender)
            bot.ttt.delete('FIELD-7-' + sender)
            bot.ttt.delete('FIELD-8-' + sender)
            bot.ttt.delete('FIELD-9-' + sender)

            // Update Message
            return interaction.message.edit({ embeds: [message], components: interaction.message.components, ephemeral: true } as any)
        }
    }
}