const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');
const { version } = require('../../../config.json');
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stockbuy')
    	.setDMPermission(false)
        .setDescription('BUY STOCKS')
        .setDescriptionLocalizations({
            de: 'KAUFE AKTIEN'
        })
        .addStringOption(option =>
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
				))
        .addIntegerOption(option =>
            option.setName('amount')
                .setNameLocalizations({
                    de: 'anzahl'
                })
                .setDescription('THE AMOUNT')
                .setDescriptionLocalizations({
                    de: 'DIE ANZAHL'
                })
                .setRequired(true)),
    async execute(interaction) {
        // Count to Global Commands
        addcmd('t-all', 1)
        
        // Count Guild Commands and User
        addcmd('g-' + interaction.guild.id, 1)
        addcmd('u-' + interaction.user.id, 1)
        
        // Set Variables
        const stock = interaction.options.getString("stock")
        const amount = interaction.options.getInteger("amount")

        const green = await getgrn('<@' + interaction.user.id + '>');
        const blue = await getblu('<@' + interaction.user.id + '>');
        const yellow = await getyll('<@' + interaction.user.id + '>');
        const red = await getred('<@' + interaction.user.id + '>');
        const greens = green + amount
        const blues = blue + amount
        const yellows = yellow + amount
        const reds = red + amount

        let greenmax = await getgrnx('<@' + interaction.user.id + '>');
        let bluemax = await getblux('<@' + interaction.user.id + '>');
        let yellowmax = await getyllx('<@' + interaction.user.id + '>');
        let redmax = await getredx('<@' + interaction.user.id + '>');

        const balance = await getbal('<@' + interaction.user.id + '>');

        // Convert Max Stocks
        if (greenmax == 0) { greenmax = 10; addgrnx('<@' + interaction.user.id + '>', 10) }
        if (bluemax == 0) { bluemax = 10; addblux('<@' + interaction.user.id + '>', 10) }
        if (yellowmax == 0) { yellowmax = 10; addyllx('<@' + interaction.user.id + '>', 10) }
        if (redmax == 0) { redmax = 10; addredx('<@' + interaction.user.id + '>', 10) }

        // Check if Amount is Negative
        if (amount < 0) {
            // Create Embed
            const err = new EmbedBuilder()
        		.setTitle('» FEHLER')
        		.setDescription('» Du kannst keine negativen Anzahlen kaufen!')
        		.setFooter({ text: '» ' + version });
            
            // Send Message
            console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] STOCKBUY : NEGATIVEMONEY : ' + amount + '€')
            return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
        }

        // Check if Max Stocks are reached
        if (stock == 'green' && greens > greenmax) {
            // Create Embed
            const err = new EmbedBuilder()
        		.setTitle('» FEHLER')
        		.setDescription('» Du kannst nicht mehr als **' + greenmax + '** 🟢 Kaufen!')
        		.setFooter({ text: '» ' + version });
            
            // Send Message
            console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] STOCKBUY : MAXGREEN : ' + amount + '€')
            return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
        }
        if (stock == 'blue' && blues > bluemax) {
            // Create Embed
            const err = new EmbedBuilder()
        		.setTitle('» FEHLER')
        		.setDescription('» Du kannst nicht mehr als **' + bluemax + '** 🔵 Kaufen!')
        		.setFooter({ text: '» ' + version });
            
            // Send Message
            console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] STOCKBUY : MAXBLUE : ' + amount + '€')
            return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
        }
        if (stock == 'yellow' && yellows > yellowmax) {
            // Create Embed
            const err = new EmbedBuilder()
        		.setTitle('» FEHLER')
        		.setDescription('» Du kannst nicht mehr als **' + yellowmax + '** 🟡 Kaufen!')
        		.setFooter({ text: '» ' + version });
            
            // Send Message
            console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] STOCKBUY : MAXYELLOW : ' + amount + '€')
            return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
        }
        if (stock == 'red' && reds > redmax) {
            // Create Embed
            const err = new EmbedBuilder()
        		.setTitle('» FEHLER')
        		.setDescription('» Du kannst nicht mehr als **' + redmax + '** 🔴 Kaufen!')
        		.setFooter({ text: '» ' + version });
            
            // Send Message
            console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] STOCKBUY : MAXRED : ' + amount + '€')
            return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
        }

        // Fetch Stock
        const price = await fetch("https://api.paperstudios.de/bot/stocks/" + stock);
        const pricetransformed = await price.text();
        const priceText = pricetransformed.replace(/(\r\n|\n|\r)/gm, "");

        // Calculate Cost
        const cost = amount * priceText

        // Check for enough Money
        if (balance < cost) {
            const missing = cost - balance
            
            // Create Embed
            const err = new EmbedBuilder()
            	.setTitle('» FEHLER')
  				.setDescription('» Du hast dafür nicht genug Geld, dir fehlen **' + missing + '€**!')
            	.setFooter({ text: '» ' + version });
            
            // Send Message
            console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] STOCKBUY : ' + stock.toUpperCase() + ' : ' + amount + ' : ' + cost + '€ : NOTENOUGHMONEY')
            return interaction.reply({ embeds: [err.toJSON()], ephemeral: true })
        }

        // Set Emoji
        let emoji

        if (stock == 'green') { emoji = '🟢' }
        if (stock == 'blue') { emoji = '🔵' }
        if (stock == 'yellow') { emoji = '🟡' }
        if (stock == 'red') { emoji = '🔴' }

        // Add Stock Amount
        if (stock == 'green') {
            addgrn('<@' + interaction.user.id + '>', amount)
        }
        if (stock == 'blue') {
            addblu('<@' + interaction.user.id + '>', amount)
        }
        if (stock == 'yellow') { 
            addyll('<@' + interaction.user.id + '>', amount)
        }
        if (stock == 'red') {
            addred('<@' + interaction.user.id + '>', amount)
        }

        // Remove Money
        rembal('<@' + interaction.user.id + '>', cost)

        // Create Embed
        const message = new EmbedBuilder()
            .setTitle('» ' + emoji + ' AKTIE KAUFEN')
            .setDescription('» Du hast erfolgreich **' + amount + '** ' + emoji + ' für **' + cost + '€** gekauft!')
            .setFooter({ text: '» ' + version });

        // Send Message
        console.log('[0xBOT] [i] [' + interaction.user.id + ' @ ' + interaction.guild.id + '] STOCKBUY : ' + stock.toUpperCase() + ' : ' + amount + ' : ' + cost + '€')
        return interaction.reply({ embeds: [message.toJSON()], ephemeral: true })
    },
};