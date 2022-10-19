const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('GIVE SOMEONE MONEY')
        .setDescriptionLocalizations({
            de: 'GEBE JEMANDEN GELD'
        })
    	.setDMPermission(false)
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({
                    de: 'nutzer'
                })
                .setDescription('THE USER')
                .setDescriptionLocalizations({
                    de: 'DER NUTZER'
                })
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setNameLocalizations({
                    de: 'anzahl'
                })
                .setDescription('THE AMOUNT OF MONEY')
                .setDescriptionLocalizations({
                    de: 'DIE ANZAHL VON GELD'
                })
                .setRequired(true)),
    async execute(interaction, client, lang, vote) {
        // Set Variables
        const user = interaction.options.getUser("user")
        const anzahl = interaction.options.getInteger("amount")
        const money = await bot.money.get(interaction.user.id);

        // Check if Balance is Minus
        if (anzahl < 0) {
            // Create Embed
            let message = new EmbedBuilder().setColor(0x37009B)
        		.setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
        		.setDescription('» You cant send negative Money!')
        		.setFooter({ text: '» ' + vote + ' » ' + config.version });

            if (lang === 'de') {
                message = new EmbedBuilder().setColor(0x37009B)
        		    .setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
        		    .setDescription('» Du kannst kein negatives Geld senden!')
        		    .setFooter({ text: '» ' + vote + ' » ' + config.version });
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] PAY : NEGATIVEMONEY : ' + anzahl + '€')
            return interaction.reply({ embeds: [message], ephemeral: true })
        }

        // Check if Target is Bot
        if (user.bot) {
            // Create Embed
            let message = new EmbedBuilder().setColor(0x37009B)
        		.setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
        		.setDescription('» You cant give a Bot Money!')
        		.setFooter({ text: '» ' + vote + ' » ' + config.version });

            if (lang === 'de') {
                message = new EmbedBuilder().setColor(0x37009B)
        		    .setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
        		    .setDescription('» Du kannst einem Bot kein Geld geben!')
        		    .setFooter({ text: '» ' + vote + ' » ' + config.version });
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] PAY : ' + user.id + ' : BOT : ' + anzahl + '€')
            return interaction.reply({ embeds: [message], ephemeral: true })
        }
        
        // Create Embeds
      	let message = new EmbedBuilder().setColor(0x37009B)
            .setTitle('<:BAG:1024389219558367292> » GIVE MONEY')
  			.setDescription('» You gave <@' + user.id + '> **$' + anzahl + '**!')
        	.setFooter({ text: '» ' + vote + ' » ' + config.version });
        let err2 = new EmbedBuilder().setColor(0x37009B)
            .setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
  			.setDescription('» You cant give yourself Money!')
        	.setFooter({ text: '» ' + vote + ' » ' + config.version });

        if (lang === 'de') {
            message = new EmbedBuilder().setColor(0x37009B)
                .setTitle('<:BAG:1024389219558367292> » GELD GEBEN')
  			    .setDescription('» Du hast <@' + user.id + '> **' + anzahl + '€** gegeben!')
        	    .setFooter({ text: '» ' + vote + ' » ' + config.version });
            err2 = new EmbedBuilder().setColor(0x37009B)
                .setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
  			    .setDescription('» Du kannst dir nicht selber Geld überweisen!')
        	    .setFooter({ text: '» ' + vote + ' » ' + config.version });
        }
        
        // Check if User is Author
        if (interaction.user.id == user.id) {
            return interaction.reply({ embeds: [err2.toJSON()], ephemeral: true })
        }
        
        // Set Money
        if (money >= anzahl) {
        	bot.money.rem(interaction.guild.id, interaction.user.id, anzahl)
        	bot.money.add(interaction.guild.id, user.id, anzahl)
        } else {
            const missing = anzahl - money
            
            // Create Embed
            let message = new EmbedBuilder().setColor(0x37009B)
            	.setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
  				.setDescription('» You dont have enough Money for that, you are missing **$' + missing + '**!')
            	.setFooter({ text: '» ' + vote + ' » ' + config.version });

            if (lang === 'de') {
                message = new EmbedBuilder().setColor(0x37009B)
            	    .setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
  				    .setDescription('» Du hast dafür nicht genug Geld, dir fehlen **' + missing + '€**!')
            	    .setFooter({ text: '» ' + vote + ' » ' + config.version });
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] PAY : ' + user.id + ' : NOTENOUGHMONEY : ' + anzahl + '€')
            return interaction.reply({ embeds: [message], ephemeral: true })
        }

        // Send Message
        bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] PAY : ' + user.id + ' : ' + anzahl + '€')
        return interaction.reply({ embeds: [message] })
    },
};