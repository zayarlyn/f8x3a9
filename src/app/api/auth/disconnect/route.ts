import { myCookie } from '@me/backend/constants'
import { createClient } from '@me/backend/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
	const cookieStore = await cookies()
	// const { value: token } = cookieStore.get('token')!
	const supabaseClient = await createClient()
	await supabaseClient.auth.signOut()

	cookieStore.delete(myCookie)
	return redirect('/join')
}
