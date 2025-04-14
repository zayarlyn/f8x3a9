import { AuthService } from '@me/backend/AuthService'
import { myCookie } from '@me/backend/constants'
import { UserModel } from '@me/backend/models/User'
import { connectMongoose } from '@me/backend/mongoose'
import { createClient } from '@me/backend/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const token_hash = searchParams.get('token_hash')
	const type = searchParams.get('type') as EmailOtpType | null
	const next = searchParams.get('next') ?? '/'
	const cookieStore = await cookies()

	const signCookieAndRedirect = async (data: any, error: any) => {
		if (!data.user?.id || error) return NextResponse.json(error)
		await connectMongoose()

		let user = await UserModel.findOne({ authUserId: data.user.id })
		if (!user) {
			user = await UserModel.create({ authUserId: data.user.id, email: data.user.email })
		}

		const token = AuthService.signJwtToken({ userId: user._id, authUserId: data.user.id })
		cookieStore.set(myCookie, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 24,
		})
		// const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
		// if (forwardedHost) return redirect(`http://${forwardedHost}${next}`)

		// we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
		return redirect('/')
	}

	const supabase = await createClient()
	const code = searchParams.get('code')
	if (code) {
		const { error, data } = await supabase.auth.exchangeCodeForSession(code)
		return signCookieAndRedirect(data, error)
	}

	if (token_hash && type) {
		const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })
		return signCookieAndRedirect(data, error)
	}

	// redirect the user to an error page with some instructions
	// redirect(`/auth/error?error=No token hash or type`)
	return NextResponse.json({ ok: 'na ka' })
}
