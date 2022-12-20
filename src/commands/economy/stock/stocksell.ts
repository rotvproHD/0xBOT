import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

import CommandInteraction from "@interfaces/CommandInteraction.js"
export default {
	data: new SlashCommandBuilder()
		.setName('stocksell')
		.setDMPermission(false)
		.setDescription('SELL STOCKS')
		.setDescriptionLocalizations({
			de: 'VERKAUFE AKTIEN'
		})
		.addStringOption((option: any) =>
			option.setName('stock')
				.setNameLocalizations({
					de: 'aktie'
				})
				.setDescription('THE STOCK')
				.setDescriptionLocalizations({
					de: 'DIE AKTIE'
				})
				.setRequired(true)
				.addChoices(
					// Setup Choices
					{ name: '🟢 GRÜNE AKTIE', value: 'green' },
					{ name: '🔵 BLAUE AKTIE', value: 'blue' },
					{ name: '🟡 GELBE AKTIE', value: 'yellow' },
					{ name: '🔴 ROTE AKTIE', value: 'red' },
					{ name: '⚪ WEISSE AKTIE', value: 'white' },
					{ name: '⚫ SCHWARZE AKTIE', value: 'black' },
				))
		.addIntegerOption((option: any) =>
			option.setName('amount')
				.setNameLocalizations({
					de: 'anzahl'
				})
				.setDescription('THE AMOUNT')
				.setDescriptionLocalizations({
					de: 'DIE ANZAHL'
				})
				.setRequired(true)),

	async execute(ctx: CommandInteraction) {
		// Check if Stocks are Enabled in Server
		if (!await ctx.bot.settings.get(ctx.interaction.guild.id, 'stocks')) {
			// Create Embed
			let message = new EmbedBuilder().setColor(0x37009B)
				.setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
				.setDescription(`» Stocks are disabled on this Server!`)
				.setFooter({ text: '» ' + ctx.metadata.vote.text + ' » ' + ctx.client.config.version })

			if (ctx.metadata.language === 'de') {
				message = new EmbedBuilder().setColor(0x37009B)
					.setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
					.setDescription(`» Aktien sind auf diesem Server deaktiviert!`)
					.setFooter({ text: '» ' + ctx.metadata.vote.text + ' » ' + ctx.client.config.version })
			}
			
			// Send Message
			ctx.log(false, `[CMD] STOCKSELL : DISABLED`)
			return ctx.interaction.reply({ embeds: [message], ephemeral: true })
		}

		// Set Variables
		const stock = ctx.getOption('stock') as string
		const amount = ctx.getOption('amount') as number

		// Check if Amount is Negative
		if (amount < 0) {
			// Create Embed
			let message = new EmbedBuilder().setColor(0x37009B)
				.setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
				.setDescription(`» You cant sell a negative amount of Stocks!`)
				.setFooter({ text: '» ' + ctx.metadata.vote.text + ' » ' + ctx.client.config.version })

			if (ctx.metadata.language === 'de') {
				message = new EmbedBuilder().setColor(0x37009B)
					.setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
					.setDescription(`» Du kannst keine negativen Anzahlen verkaufen!`)
					.setFooter({ text: '» ' + ctx.metadata.vote.text + ' » ' + ctx.client.config.version })
			}
			
			// Send Message
			ctx.log(false, `[CMD] STOCKSELL : NEGATIVESTOCKS : ${amount}€`)
			return ctx.interaction.reply({ embeds: [message], ephemeral: true })
		}

		// Calculate Cost
		const cash = amount * ctx.client.stocks[stock]

		// Set Emoji
		let emoji: string
		if (stock === 'green') emoji = '🟢'
		if (stock === 'blue') emoji = '🔵'
		if (stock === 'yellow') emoji = '🟡'
		if (stock === 'red') emoji = '🔴'
		if (stock === 'white') emoji = '⚪'
		if (stock === 'black') emoji = '⚫'

		// Check for enough Stocks
		if (await ctx.bot.stocks.get(ctx.interaction.user.id, stock, 'used') < amount) {
			const missing = amount - (await ctx.bot.stocks.get(ctx.interaction.user.id, stock, 'used'))
			
			// Create Embed
			let message = new EmbedBuilder().setColor(0x37009B)
				.setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
  			.setDescription(`» You dont have enough Stocks for that, you are missing **${missing}** ${emoji} !`)
				.setFooter({ text: '» ' + ctx.metadata.vote.text + ' » ' + ctx.client.config.version })

			if (ctx.interaction.guildLocale) {
				message = new EmbedBuilder().setColor(0x37009B)
					.setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
  				.setDescription(`» Du hast dafür nicht genug Aktien, dir fehlen **${missing}** ${emoji} !`)
					.setFooter({ text: '» ' + ctx.metadata.vote.text + ' » ' + ctx.client.config.version })
			}
			
			// Send Message
			ctx.log(false, `[CMD] STOCKSELL : ${stock.toUpperCase()} : ${amount} : ${cash}€ : NOTENOUGHSTOCKS`)
			return ctx.interaction.reply({ embeds: [message], ephemeral: true })
		}

		// Log Transaction
		const transaction = await ctx.bot.transactions.log({
			success: true,
			sender: {
				id: `${amount} ${stock.toUpperCase()} STOCK`,
				amount: cash,
				type: 'negative'
			}, reciever: {
				id: ctx.interaction.user.id,
				amount: cash,
				type: 'positive'
			}
		})

		// Add Money
		ctx.bot.money.add(ctx.interaction.guild.id, ctx.interaction.user.id, cash)

		// Remove Stock Amount
		ctx.bot.stocks.rem(ctx.interaction.user.id, stock, 'used', amount)

		// Create Embed
		let message = new EmbedBuilder().setColor(0x37009B)
			.setTitle('<:CHART:1024398298204876941> » SELL STOCKS')
			.setDescription(`
				» You successfully sold **${amount}** ${emoji} for **$${cash}**! (**$${ctx.client.stocks[stock]}** per Stock)

				ID: ${transaction.id}
			`).setFooter({ text: '» ' + ctx.metadata.vote.text + ' » ' + ctx.client.config.version })

		if (ctx.metadata.language === 'de') {
			message = new EmbedBuilder().setColor(0x37009B)
				.setTitle('<:CHART:1024398298204876941> » AKTIEN VERKAUFEN')
				.setDescription(`
					» Du hast erfolgreich **${amount}** ${emoji} für **${cash}€** verkauft! (**${ctx.client.stocks[stock]}€** pro Aktie)

					ID: ${transaction.id}
				`).setFooter({ text: '» ' + ctx.metadata.vote.text + ' » ' + ctx.client.config.version })
		}

		// Send Message
		ctx.log(false, `[CMD] STOCKSELL : ${stock.toUpperCase()} : ${amount} : ${cash}€`)
		return ctx.interaction.reply({ embeds: [message], ephemeral: true })
	}
}