import type { NextConfig } from 'next'
import withVercelToolbar from '@vercel/toolbar/plugins/next'

const nextConfig: NextConfig = {
	/* config options here */
	webpack: (config) => {
		config.resolve.alias['pouchdb'] = require.resolve('pouchdb')
		return config
	},
}

export default withVercelToolbar()(nextConfig)
