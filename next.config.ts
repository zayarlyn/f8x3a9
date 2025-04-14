import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	webpack: (config) => {
		config.resolve.alias['pouchdb'] = require.resolve('pouchdb')
		return config
	},
}

export default nextConfig
