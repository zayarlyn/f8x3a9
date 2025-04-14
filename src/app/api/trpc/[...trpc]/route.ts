import { appRouter } from '@me/backend/trpc/routers/router'
import { createTrpcContext } from '@me/backend/trpc/setup'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { NextRequest } from 'next/server'

class AuthorizationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'AuthorizationError'
		// this.code = 400; // Optional custom property
	}
}

function handler(req: NextRequest) {
	return fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
		createContext: createTrpcContext,
		onError: ({ error }) => {
			console.error('TRPC: ', error.message)
		},
	})
}

export { handler as GET, handler as POST }
