const config = require('../config.js');
const util = require('../util.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute (client) {
        client.user.setPresence({ activities: [{ name: 'Starting up...', type: 'PLAYING' }], status: 'online' });
        const guildIds = client.guilds.cache.map(guild => guild.id);

        console.log(`[+] Logged in as ${client.user.tag}`);
        console.log('——————————————————————————————');
        console.log(`Client ID: ${client.user.id}`);
        console.log(`Client status: ${client.presence.status}`);
        console.log(`Guilds count: ${guildIds.length}`);
        console.log('——————————————————————————————');

        // changing status
        function updateStatus() {
            let status = `${config.prefix}help — ${config.statuses[util.randomInRange(0, config.statuses.length-1)]}`;
            while(status === client.user.presence.activities[0].name) {
                status = `${config.prefix}help — ${config.statuses[util.randomInRange(0, config.statuses.length-1)]}`;
            }
            client.user.setPresence({ activities: [{ name: status, type: 'PLAYING' }], status: 'online' });
        }
        setInterval(updateStatus, 10000);
    }
}