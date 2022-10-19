const { ShardingManager, PermissionsBitField } = require('discord.js')
const { getAllFilesFilter } = require('./utils/getAllFiles.js')

const pgP = require('pg').Pool
const config = require('./config.json')
const chalk = require('chalk')

// Connect to MongoDB
const mongoose = require('mongoose')
mongoose.connect(config.mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(console.log('[0xBOT] [!] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [INF] CONNECTED TO MONGODB'))
console.log(' ')

// Database Functions
const bot = require("./functions/bot")

// CLI Commands
const stdin = process.openStdin();
stdin.addListener("data", async function(input) {
    // Get Arguments
    const args = input.toString().trim().split(" ")
    console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [INF] RECIEVED COMMAND [' + input.toString().trim().toUpperCase() + ']')

    // ADDBAL
    if (args[0].toUpperCase() == 'ADDBAL') {
        if (typeof args[1] !== 'undefined' && typeof args[2] !== 'undefined') {
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [INF] ADDED ' + args[2] + '€ TO ' + args[1])
            bot.money.add(false, args[1].toString(), parseInt(args[2]))
        } else {
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [INF] USAGE: ADDBAL [USERID] [AMOUNT]')
        }
    }

    // REMBAL
    if (args[0].toUpperCase() == 'REMBAL') {
        if (typeof args[1] !== 'undefined' && typeof args[2] !== 'undefined') {
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [INF] REMOVED ' + args[2] + '€ FROM ' + args[1])
            bot.money.rem(false, args[1].toString(), parseInt(args[2]))
        } else {
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [INF] USAGE: REMBAL [USERID] [AMOUNT]')
        }
    }

    // SETBAL
    if (args[0].toUpperCase() == 'SETBAL') {
        if (typeof args[1] !== 'undefined' && typeof args[2] !== 'undefined') {
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [INF] SET BALANCE OF ' + args[1] + ' TO ' + args[2] + '€')
            bot.money.set(false, args[1].toString(), parseInt(args[2]))
        } else {
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [INF] USAGE: SETBAL [USERID] [AMOUNT]')
        }
    }

    // EVAL
    if (args[0].toUpperCase() == 'EVAL') {
        if (typeof args[1] !== 'undefined') {
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [INF] RESULT OF EVAL:')
            try {
                console.log(await eval(args[1]))
            } catch(e) {
                console.log(e)
                console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [INF] EVAL RETURNED AN ERROR')
            }
        } else {
            console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [INF] USAGE: EVAL [COMMAND]')
        }
    }
  });

// Show Logo
console.log(' ')
console.log(chalk.bold('  /$$$$$$            /$$$$$$$   /$$$$$$  /$$$$$$$$'))
console.log(chalk.bold(' /$$$_  $$          | $$__  $$ /$$__  $$|__  $$__/'))
console.log(chalk.bold('| $$$$\\ $$ /$$   /$$| $$  \\ $$| $$  \\ $$   | $$   '))
console.log(chalk.bold('| $$ $$ $$|  $$ /$$/| $$$$$$$ | $$  | $$   | $$   '))
console.log(chalk.bold('| $$\\ $$$$ \\  $$$$/ | $$__  $$| $$  | $$   | $$   '))
console.log(chalk.bold('| $$ \\ $$$  |$$  $$ | $$  \\ $$| $$  | $$   | $$   '))
console.log(chalk.bold('|  $$$$$$/ /$$/\\  $$| $$$$$$$/|  $$$$$$/   | $$   '))
console.log(chalk.bold(' \\______/ |__/  \\__/|_______/  \\______/    |__/   '))
console.log(' ')
console.log(chalk.bold('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$'))
console.log(' ')

// Database Migrations
let migrated = false
const migrator = async(conn) => {
    const migrations = getAllFilesFilter('./migrations', '.js');
    for (const file of migrations) {
    	const migration = require(file)
    	const status = await migration.migrate(conn)
        if (status) {
    	    console.log(`[0xBOT] [i] [${new Date().toLocaleTimeString('en-US', { hour12: false })}] [INF] MIGRATED ${migration.data.name}`)
            migrated = true
        }
    }
}; const db = new pgP({
    host: config.database.oxbot.host,
    database: config.database.oxbot.database,
    user: config.database.oxbot.username,
    password: config.database.oxbot.password,
    ssl: true,
    port: 5432
}); const domigrate = async() => { await migrator(db) }
domigrate(); if (migrated) { console.log(' ') }

// Switcher (Keeping for the Docs)
/* const domonmig = async() => {
const schema = require('./schema/votes')
const rawvalues = await schema.find({})
rawvalues.forEach(function (e) {
    db.query(`insert into uservotes values ($1, $2)`, [e.userId, e.votes])
});
}; domonmig() */

// Create Client
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds
] }); client.login(config.client.token);

/// Dashboard
// Check Session Function
const fetch = require('node-fetch')
const checksession = async(accessToken, tokenType, userid, guildid) => {
    const dbuser = await db.query(`select * from usersessions where userid = $1 and token = $2 and tokentype = $3;`, [
        userid,
        accessToken,
        tokenType
    ]); if (dbuser.rowCount === 0 || dbuser.rows[0].expires < Math.floor(+new Date() / 1000)) {
        // Clear Rows
        if (dbuser.rowCount > 0 && dbuser.rows[0].expires < Math.floor(+new Date() / 1000)) {
            await db.query(`delete from usersessions where userid = $1 and token = $2;`, [
                userid,
                accessToken
            ])
        }

        try {
            const userinfo = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${tokenType} ${accessToken}`
                }
            }); const userinfodata = await userinfo.json()
            if (userinfodata.id !== userid) return false

            const guild = await client.guilds.fetch(guildid, { force: true })
		    const user = await guild.members.fetch(userid, { force: true })
		    if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
                await db.query(`insert into usersessions values ($1, $2, $3, $4);`, [
                    userid,
                    accessToken,
                    tokenType,
                    (Math.floor(+new Date() / 1000))+150
                ]); return true
            } else { return false }
        } catch(e) { return false }
    } else {
        try {
            const guild = await client.guilds.fetch(guildid, { force: true })
		    const user = await guild.members.fetch(userid, { force: true })
		    if (user.permissions.has(PermissionsBitField.Flags.Administrator)) { return true }
        } catch(e) { return false }
    }
}

// Init API
const Koa = require('koa')
const Router = require('koa-router')

const rateLimitDB = new Map()
const rateLimit = require('koa-ratelimit')
const koaBody = require('koa-body')
const cors = require('@koa/cors')
const { watchFile } = require('fs')
const app = new Koa()

// Add Addons to API
app.use(koaBody())
app.use(cors())
app.use(rateLimit({
    max: 20,
    duration: 30000,
    driver: 'memory',
    db: rateLimitDB,
    errorMessage: { "success": false, "message": 'YOU ARE BEING RATE LIMITED' },
}))

// Error Handling
app.use(async (ctx, next) => {
    try {
        await next()
    }

    catch (err) {
        console.log('[0xBOT] [!] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [API] ERROR :')
		console.error(err)

        ctx.status = 500
        return ctx.body = { "success": false, "message": 'SERVER ERROR' }
    }
})

/// API Endpoints
const router = new Router();

// Fetch Functions
router.get('/fetch/guild', async(ctx) => {
    // Check for Queries
    if (!ctx.query.id) return ctx.body = { "success": false, "message": 'NO ID' }

    // Check Permissions
    if (!await checksession(
        ctx.headers.accesstoken,
        ctx.headers.tokentype,
        ctx.headers.userid,
        ctx.query.id
    )) { return ctx.body = { "success": false, "message": 'PERMISSION DENIED' } }

    let cont = true

    // Fetch Guild
    let guild = await client.guilds.fetch(ctx.query.id).catch((e) => {
        cont = false
        return ctx.body = { "success": false, "message": 'INVALID GUILD' }
    }); guild.success = true

    // Return Result
    if (cont) return ctx.body = guild
})

// Stat Functions
router.get('/stats/guild', async(ctx) => {
    // Check for Queries
    if (!ctx.query.id) return ctx.body = { "success": false, "message": 'NO ID' }

    // Check Permissions
    if (!await checksession(
        ctx.headers.accesstoken,
        ctx.headers.tokentype,
        ctx.headers.userid,
        ctx.query.id
    )) { return ctx.body = { "success": false, "message": 'PERMISSION DENIED' } }

    // Get Stats
    const stats = {
        "success": true,
        "commands": await bot.stat.get(`g-${ctx.query.id}`, 'cmd'),
        "buttons": await bot.stat.get(`g-${ctx.query.id}`, 'btn')
    }

    // Return Result
    return ctx.body = stats
}); router.get('/stats/user', async(ctx) => {
    // Check for Queries
    if (!ctx.query.id) return ctx.body = { "success": false, "message": 'NO ID' }

    // Get Stats
    const stats = {
        "success": true,
        "commands": await bot.stat.get(`u-${ctx.query.id}`, 'cmd'),
        "buttons": await bot.stat.get(`u-${ctx.query.id}`, 'btn')
    }

    // Return Result
    return ctx.body = stats
})

// Option Functions
router.get('/options/guild', async(ctx) => {
    // Check for Queries
    if (!ctx.query.id) return ctx.body = { "success": false, "message": 'NO ID' }

    // Check Permissions
    if (!await checksession(
        ctx.headers.accesstoken,
        ctx.headers.tokentype,
        ctx.headers.userid,
        ctx.query.id
    )) { return ctx.body = { "success": false, "message": 'PERMISSION DENIED' } }

    let response = { "success": false, "message": "NOT FOUND" }

    // GENERAL
    if (ctx.query.page === 'GENERAL') {
        let guildlang = 'ENGLISH'
        if (await bot.language.get(ctx.query.id) === 'de') {
            guildlang = 'GERMAN'
        }
        response = {
            "success": true,
            "language": guildlang
        }
    }

    // ECONOMY
    if (ctx.query.page === 'ECONOMY') {
        response = {
            "success": true,
            "businesses": await bot.settings.get(ctx.query.id, 'businesses'),
            "items": await bot.settings.get(ctx.query.id, 'items'),
            "cars": await bot.settings.get(ctx.query.id, 'cars'),
            "stocks": await bot.settings.get(ctx.query.id, 'stocks'),
            "luckgames": await bot.settings.get(ctx.query.id, 'luckgames'),
            "work": await bot.settings.get(ctx.query.id, 'work'),
            "rob": await bot.settings.get(ctx.query.id, 'rob')
        }
    }

    // FUN
    if (ctx.query.page === 'FUN') {
        response = {
            "success": true,
            "levels": await bot.settings.get(ctx.query.id, 'levels'),
            "quotes": await bot.settings.get(ctx.query.id, 'quotes'),
            "meme": await bot.settings.get(ctx.query.id, 'meme')
        }
    }

    // Return Result
    return ctx.body = response
}); router.post('/options/guild', async(ctx) => {
    // Check for Queries
    if (!ctx.query.id) return ctx.body = { "success": false, "message": 'NO ID' }
    if (ctx.request.body.option === null || ctx.request.body.value === null) return ctx.body = { "success": false, "message": 'NO HEADERS' }
    
    // Check Permissions
    if (!await checksession(
        ctx.headers.accesstoken,
        ctx.headers.tokentype,
        ctx.headers.userid,
        ctx.query.id
    )) { return ctx.body = { "success": false, "message": 'PERMISSION DENIED' } }

    let response = { "success": false, "message": 'NOT FOUND' }

    // Custom
    if (ctx.request.body.option === 'LANGUAGE') {
        if (ctx.request.body.value !== 'GERMAN' && ctx.request.body.value !== 'ENGLISH') return ctx.body = { "success": false, "message": 'INVALID VALUE' }
        let set = 'en'; if (ctx.request.body.value === 'GERMAN') { set = 'de' }
        bot.language.set(ctx.query.id, set)
        response = { "success": true, "message": 'OPTION UPDATED' }
    }

    // Boolean
    if (ctx.request.body.option !== 'LANGUAGE') {
        if (ctx.request.body.value !== true && ctx.request.body.value !== false) return ctx.body = { "success": false, "message": 'INVALID VALUE' }
        let set = 0; if (ctx.request.body.value === 'GERMAN') { set = 1 }
        bot.settings.set(ctx.query.id, ctx.request.body.option.toLowerCase(), ctx.request.body.value)
        response = { "success": true, "message": 'OPTION UPDATED' }
    }

    // Return Result
    return ctx.body = response
})

app.use(router.routes()).use(router.allowedMethods())
app.use((ctx) => {
    ctx.body = { "success": false, "message": 'NOT FOUND' }
})

app.listen(config.web.ports.api, () => console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [STA] $$$$$ LAUNCHED API ON PORT ' + config.web.ports.api))

// Start Shard
const manager = new ShardingManager('./bot.js', { token: config.client.token, shards: 'auto' })
manager.on('shardCreate', (shard) => console.log('[0xBOT] [i] [' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] [STA] $$$$$ LAUNCHED SHARD #' + shard.id))
manager.spawn()