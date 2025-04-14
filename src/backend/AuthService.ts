import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { myCookie } from './constants'
import { UserModel } from './models/User'

const SECRET = process.env.JWT_SECRET || 'super-secret'

export const cookieExpireDuration = 60 * 60 * 24

interface TokenPayload {
	userId: string
	authUserId: string
}

export class AuthService {
	static signJwtToken(payload: TokenPayload): string {
		return jwt.sign(payload, SECRET, { expiresIn: cookieExpireDuration })
	}

	static verifyJwtToken(token: string): TokenPayload | null {
		try {
			return jwt.verify(token, SECRET) as TokenPayload
		} catch (error) {
			// throw new TRPCError({ message: error.message, code: 'UNAUTHORIZED' })
			return null
		}
	}

	static async getUser(req: NextRequest) {
		const myCk = req.cookies.get(myCookie)
		if (!myCk) return
		const payload = AuthService.verifyJwtToken(myCk.value)
		if (!payload) return
		const user = await UserModel.findOne({ _id: payload.userId })
		return user
	}
}
