export const env = () => {
	return {
		client: {
			supabase: {
				url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
				anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			},
		},
		server: {
			supabase: {
				serviceRoleSecret: process.env.SUPABASE_SERVICE_ROLE_SECRET!,
			},
			mongooseUri: process.env.MONGOOSE_URI!,
		},
	}
}
