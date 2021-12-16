import { getServers } from './util.ns'

/** @param {NS} ns **/
export async function main(ns) {
	const target = ns.args[0]

	if (typeof target !== 'string') throw new Error('Invalid target.')

	const servers = getServers(ns)

	const server = servers.find(s => s.name === target);

	const cmd = `connect ${server.path.join('; connect ')};`

	// server.path.forEach(name => ns.connect(name));
	try {
		await navigator.clipboard.writeText(cmd);
		ns.tprint('Command copied to clipboard!')
	} catch (error) {
		ns.tprint(error)
	}
}