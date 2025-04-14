import { env } from '@me/env'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
	return createBrowserClient(env().client.supabase.url, env().client.supabase.anonKey)
}
