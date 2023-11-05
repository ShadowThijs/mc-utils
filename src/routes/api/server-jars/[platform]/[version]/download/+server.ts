import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import info from "$lib/server-jars.json"
import { trackEvent } from '$lib/google/gtag'

export const GET = (async ({ params }) => {
	const platform: any | null = findByPlatform(params.platform)
	if (!platform) return new Response(null, {
		status: 204,
		statusText: `There is no platform ${params.platform}`
	})

	const version: any | null = findVersion(platform.jars, params.version)
	if (!version) return new Response(null, {
		status: 204,
		statusText: `No version ${params.version} on ${params.platform}`
	})

	trackEvent('server-jars-download', 'type', `${params.platform}-${params.version}`);

	const downloadUrl = version.downloadURL ?? `https://cdn.mcutils.com/jars/${params.platform}-${params.version}.jar`
	throw redirect(302, downloadUrl)
}) satisfies RequestHandler

const findByPlatform = (platform: string) => {
	return info.find((item) => item.platform === platform)
}

const findVersion = (versions: any, version: string) => {
	return versions.find((item: any) => item.version === version)
}