// We load everything from the process.env file
require('dotenv').config()

// Calling Discord.js and all the required intents
const { Client, Intents, Presence } = require('discord.js')

const intents = new Intents()
intents.add('GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS', 'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING')

// We set the bot initial prensecee"
const initActivity = {
    "name": "BotCore",
    "type": "COMPETING",
    "url": "https://www.github.com/ThePotatoCamera/BotCore" 
}
const initPresenceData = {
    "status": "online",
    "afk": false,
    "activity": initActivity
}

// Getting token from environment file
const token = process.env.TOKEN

const bot = new Client({shards: 'auto'}, {disableMentions: 'everyone'}, {presence: {}} , {ws: { intents: { intents } }})

// We prepare the event service
const fs = require('fs')

fs.readdir('./events', (err, files) => {
    if (err) return console.error("[BC] " + err)
    files.forEach(file => {
        const eventFunction = require(`./events/${file}`)
        const eventName = file.split('.')[0]
        bot.on(eventName, (...args) => eventFunction.run(bot, ...args))
    })
})

console.info("[BC] Event service loaded.")

// We prepare the command service

bot.commands = new Map()

fs.readdir('./commands', (err, files) => {
    if (err) return console.error("[BC] " + err)
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const props = require(`./commands/${file}`)
        const commandName = file.split('.')[0]
        bot.commands.set(commandName, props)
    })
})

console.info("[BC] Command service loaded.")

bot.login(token)
    .catch(e => {
        return console.error("[BC] " + e)
    })
