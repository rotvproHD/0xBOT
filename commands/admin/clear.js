const { CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const { version } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('CLEAR MESSAGES')
        .setDescriptionLocalizations({
            de: 'ENTFERNE NACHRICHTEN'
        })
    	.setDMPermission(false)
        .addIntegerOption(option =>
            option.setName('amount')
                .setNameLocalizations({
                    de: 'anzahl'
                })
                .setDescription('THE AMOUNT OF MESSAGES')
                .setDescriptionLocalizations({
                    de: 'DIE ANZAHL AN NACHRICHTEN'
                })
                .setRequired(true))
    	.addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({
                    de: 'nutzer'
                })
                .setDescription('THE TARGET')
                .setDescriptionLocalizations({
                    de: 'DAS ZIEL'
                })
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client, lang, vote) {
        // Check if Bot has Permission
        if (!interaction.appPermissions.has('ManageMessages')) {
            // Create Embed
            let message = new EmbedBuilder()
        		.setTitle('» ERROR')
        		.setDescription('» I dont think I have the **MANAGE MESSAGES** Permission!')
        		.setFooter({ text: '» ' + version });
            if (lang == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» Ich denke nicht, dass ich die **NACHRICHTEN VERWALTEN** Berechtigung habe!')
        		    .setFooter({ text: '» ' + version });
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] CLEAR : NOPERM')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }
        if (!interaction.appPermissions.has('ViewChannel')) {
            // Create Embed
            let message = new EmbedBuilder()
        		.setTitle('» ERROR')
        		.setDescription('» I dont think I have the **VIEW CHANNEL** Permission!')
        		.setFooter({ text: '» ' + version });
            if (lang == "de") {
                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» Ich denke nicht, dass ich die **KANÄLE ANSEHEN** Berechtigung habe!')
        		    .setFooter({ text: '» ' + version });
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] CLEAR : NOPERM')
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Set Variables
        const amount = interaction.options.getInteger("amount")
        const target = interaction.options.getUser("user")
        const channel = interaction.channel
        const messages = channel.messages.fetch()

        // Check if Message Amount is Negative
        if (amount < 1) {
            // Create Embed
            let message = new EmbedBuilder()
        		.setTitle('» ERROR')
        		.setDescription('» You have to delete atleast **1** Message!')
        		.setFooter({ text: '» ' + version });
            if (lang == "de") {

                message = new EmbedBuilder()
        		    .setTitle('» FEHLER')
        		    .setDescription('» Du musst mindestens **1** Nachricht löschen!')
        		    .setFooter({ text: '» ' + version });
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] CLEAR : NOTENOUGH : ' + amount)
            return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
        }

        // Delete Messages and Send Message
        if (target != null) {
            let i = 0;
            const filtered = [];

            (await messages).filter((m) => {
                if(m.author.id === target.id && amount > i) {
                    filtered.push(m)
                    i++
                }
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                // Create Embed
                let message
                if (messages.size == 1) {
                    message = new EmbedBuilder()
                        .setTitle('» DELETE MESSAGES')
                        .setDescription('» You deleted **' + messages.size + '** Message from <@' + target + '>!')
                        .setFooter({ text: '» ' + version });

                    if (lang == "de") {
                        message = new EmbedBuilder()
                            .setTitle('» NACHRICHTEN LÖSCHEN')
                            .setDescription('» Du hast **' + messages.size + '** Nachricht von <@' + target + '> gelöscht!')
                            .setFooter({ text: '» ' + version });
                    }
                } else {
                    message = new EmbedBuilder()
                        .setTitle('» DELETE MESSAGES')
                        .setDescription('» You deleted **' + messages.size + '** Messages from <@' + target + '>!')
                        .setFooter({ text: '» ' + version });

                    if (lang == "de") {
                        message = new EmbedBuilder()
                            .setTitle('» NACHRICHTEN LÖSCHEN')
                            .setDescription('» Du hast **' + messages.size + '** Nachrichten von <@' + target + '> gelöscht!')
                            .setFooter({ text: '» ' + version });
                    }
                }

                // Send Message
                bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] CLEAR : ' + target + ' : ' + amount)
                return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
            })
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                // Create Embed
                let message
                if (messages.size == 1) {
                    message = new EmbedBuilder()
                        .setTitle('» DELETE MESSAGES')
                        .setDescription('» You deleted **' + messages.size + '** Message!')
                        .setFooter({ text: '» ' + version });

                    if (lang == "de") {
                        message = new EmbedBuilder()
                            .setTitle('» NACHRICHTEN LÖSCHEN')
                            .setDescription('» Du hast **' + messages.size + '** Nachricht gelöscht!')
                            .setFooter({ text: '» ' + version });
                    }
                } else {
                    message = new EmbedBuilder()
                        .setTitle('» DELETE MESSAGES')
                        .setDescription('» You deleted **' + messages.size + '** Messages!')
                        .setFooter({ text: '» ' + version });

                    if (lang == "de") {
                        message = new EmbedBuilder()
                            .setTitle('» NACHRICHTEN LÖSCHEN')
                            .setDescription('» Du hast **' + messages.size + '** Nachrichten gelöscht!')
                            .setFooter({ text: '» ' + version });
                    }
                }

                // Send Message
                bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] CLEAR : ' + amount)
                return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
            })
        }
    },
};