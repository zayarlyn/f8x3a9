'use client'
// import { env } from '@backend/util'
import { QueryClientProvider } from '@tanstack/react-query'

import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'

import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { AppRouter } from './backend/trpc/routers/router'
import { redirect } from 'next/navigation'
import { SuperJSON } from 'superjson'

// TODO: use context
// const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>()

const trpcClient = createTRPCClient<AppRouter>({
	// links: [httpBatchLink({ url: `${env().client.apiUrl}/api/trpc` })],
	links: [
		httpBatchLink({
			url: `/api/trpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: 'include',
				})
			},
			// transformer: SuperJSON,
			// transformer: (input) => {
			// 	return input
			// },
		}),
	],
})

export const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } })

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,

	// router: {}
	// overrides: {}
})

export const TrpcReactQueryCtx = ({ children }: any) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
