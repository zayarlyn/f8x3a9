import { AuthService } from '@me/backend/AuthService'
import { myCookie } from '@me/backend/constants'
import { createClient } from '@me/backend/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const cookieStore = await cookies()
	const { value: token } = cookieStore.get('token')!

	if (!AuthService.verifyJwtToken(token)) {
		const supabase = await createClient()
		const { error } = await supabase.auth.signOut()
		// if (!error) {
		cookieStore.delete(myCookie)
		return redirect('/join')
		// }
	}
	return NextResponse.json({ status: 'OK' })
}
