const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
    	.setDMPermission(false)
        .setDescription('GET A MEME')
        .setDescriptionLocalizations({
            de: 'BEKOMME EIN MEME'
        }),
    async execute(interaction, client, lang, vote) {
        // Check if Meme is Enabled in Server
        if (!await bot.settings.get(interaction.guild.id, 'meme')) {
            // Create Embed
            let message = new EmbedBuilder().setColor(0x37009B)
        		.setTitle('<:EXCLAMATION:1024407166460891166> » ERROR')
        		.setDescription('» The **`/meme`** Command is disabled on this Server!')
        		.setFooter({ text: '» ' + vote + ' » ' + config.version });

            if (lang === 'de') {
                message = new EmbedBuilder().setColor(0x37009B)
        		    .setTitle('<:EXCLAMATION:1024407166460891166> » FEHLER')
        		    .setDescription('» Der **`/meme`** Befehl ist auf diesem Server deaktiviert!')
        		    .setFooter({ text: '» ' + vote + ' » ' + config.version });
            }
            
            // Send Message
            bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] MEME : DISABLED')
            return interaction.reply({ embeds: [message], ephemeral: true })
        }

        // Set Variables
        const res = bot.random(1, 4)

        // Set Subreddit
        let subreddit
        if (res === 1) { subreddit = "memes" }
        if (res === 2) { subreddit = "me_irl" }
        if (res === 3) { subreddit = "CrappyDesign" }
        if (res === 4) { subreddit = "Gittertiere" }

        // Get Initial Meme
        const req = await axios({
            method: 'get',
            url: `https://www.reddit.com/r/${subreddit}/random/.json`,
            validateStatus: false,
            headers: {}
        }); const random = req.data

        let upvotes = random[0].data.children[0].data.ups
        let comments = random[0].data.children[0].data.num_comments

        // 187 Easter Egg
        if (upvotes === 187) { upvotes = upvotes + ' 🐊' }
        if (comments === 187) { comments = comments + ' 🐊' }
        
        // Create Embed
        let message = new EmbedBuilder().setColor(0x37009B)
            .setTitle(`<:IMAGE:1024405297579696179> » ${random[0].data.children[0].data.title.toUpperCase()}`)
            .setDescription('» SUBREDDIT:\n`r/' + subreddit + '`\n\n» UPVOTES:\n`' + upvotes + '`\n\n» COMMENTS:\n`' + comments + '`')
            .setImage(random[0].data.children[0].data.url)
        	.setFooter({ text: '» ' + vote + ' » ' + config.version });

        if (lang === 'de') {
            message = new EmbedBuilder().setColor(0x37009B)
                .setTitle(`<:IMAGE:1024405297579696179> » ${random[0].data.children[0].data.title.toUpperCase()}`)
                .setDescription('» SUBREDDIT:\n`r/' + subreddit + '`\n\n» UPVOTES:\n`' + upvotes + '`\n\n» KOMMENTARE:\n`' + comments + '`')
                .setImage(random[0].data.children[0].data.url)
        	    .setFooter({ text: '» ' + vote + ' » ' + config.version });
        }
        
        // Send Message
        bot.log(false, interaction.user.id, interaction.guild.id, '[CMD] MEME : ' + subreddit.toUpperCase() + ' : ' + upvotes + '^ : ' + comments)
        return interaction.reply({ embeds: [message] })
    }
}