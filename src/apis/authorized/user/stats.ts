import { ctrFile } from "@interfaces/Webserver.js"

interface Body {}

export = {
	method: 'GET',
	path: '/stats/user',

	async code(ctr) {
		// Return Result
		return ctr.print({
			"success": true,
			"commands": await ctr['@'].bot.stat.get(`u-${ctr["@"].user.id}`, 'cmd'),
			"buttons": await ctr['@'].bot.stat.get(`u-${ctr["@"].user.id}`, 'btn'),
			"modals": await ctr['@'].bot.stat.get(`u-${ctr["@"].user.id}`, 'mod')
		})
	}
} as ctrFile<Body>