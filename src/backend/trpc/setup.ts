import { initTRPC, TRPCError } from '@trpc/server'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { NextRequest } from 'next/server'
import { AuthService } from '../AuthService'
import { connectMongoose } from '../mongoose'

export const createTrpcContext = async (opts: FetchCreateContextFnOptions) => {
	const req = opts.req as NextRequest

	const mongooseConn = await connectMongoose()
	const user = await AuthService.getUser(req)
	if (!user) throw new TRPCError({ message: 'Unauthenticated', code: 'UNAUTHORIZED' })

	return {
		mongooseConn,
		userId: user._id.toString(),
		authUserId: user.authUserId,
		authUser: user.toJSON(),
		req,
	}
}

type TrpcContext = Awaited<ReturnType<typeof createTrpcContext>>

export const t = initTRPC.context<TrpcContext>().create({})
