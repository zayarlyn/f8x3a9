'use client'
import { createClient } from '@me/backend/supabase/client'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
// import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import Logo from '../Logo'
import { Input } from '../ui/Input'

export default function SignIn() {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isGoogleLoading, setIsGoogleLoading] = useState(false)
	const [isMagicLinkSent, setIsMagicLinkSent] = useState(false)

	const handleGoogleSignIn = () => {
		setIsGoogleLoading(true)
		const supabaseClient = createClient()
		return supabaseClient.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: window.location.origin + '/api/auth/confirm',
			},
		})
	}

	const handleMagicLinkSignIn = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!email) return

		setIsLoading(true)
		const supabaseClient = createClient()
		const { data, error } = await supabaseClient.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: window.location.href + '/api/auth/confirm' } })
		if (!error) {
			setIsLoading(false)
			setIsMagicLinkSent(true)
		}
	}

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12'>
			<Card className='w-full max-w-md'>
				<CardContent className='space-y-4'>
					{!isMagicLinkSent ? (
						<>
							<CardHeader className='space-y-1'>
								<CardTitle className='text-2xl font-bold text-center flex justify-center'>
									<Logo className='scale-150' />
								</CardTitle>
								<CardDescription className='text-center'>Sign in to your account to continue</CardDescription>
							</CardHeader>
							<Button variant='outline' className='w-full justify-between font-normal' onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
								<div className='flex items-center'>
									<svg viewBox='0 0 24 24' className='h-5 w-5 mr-2' xmlns='http://www.w3.org/2000/svg'>
										<path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4' />
										<path
											d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
											fill='#34A853'
										/>
										<path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05' />
										<path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335' />
										<path d='M1 1h22v22H1z' fill='none' />
									</svg>
									{isGoogleLoading ? 'Loading...' : 'Sign in with Google'}
								</div>
								<ArrowRight className='h-4 w-4' />
							</Button>

							<div className='relative flex items-center justify-center'>
								<Separator className='absolute w-full' />
								<span className='relative bg-white px-2 text-xs text-muted-foreground'>OR</span>
							</div>

							<form onSubmit={handleMagicLinkSignIn} className='space-y-4'>
								<div className='space-y-2'>
									<Input type='email' placeholder='name@example.com' value={email} onChange={setEmail} fullWidth />
								</div>
								<Button type='submit' className='w-full' disabled={isLoading || !email || isGoogleLoading}>
									{isLoading ? (
										<>
											<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											Sending link...
										</>
									) : (
										'Sign in with Email'
									)}
								</Button>
							</form>
						</>
					) : (
						<div className='py-6 text-center space-y-4'>
							<div className='mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='h-6 w-6 text-green-600'
								>
									<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
									<polyline points='22 4 12 14.01 9 11.01' />
								</svg>
							</div>
							<div className='space-y-2'>
								<h3 className='text-lg font-medium'>Check your email</h3>
								<p className='text-sm text-muted-foreground'>
									We have sent a magic link to <span className='font-medium text-foreground'>{email}</span>
								</p>
							</div>
							<Button variant='outline' className='mt-4' onClick={() => setIsMagicLinkSent(false)}>
								Back to sign in
							</Button>
						</div>
					)}
				</CardContent>
				{/* <CardFooter className='flex flex-col space-y-4 border-t pt-4'>
					<div className='text-xs text-center text-muted-foreground'>
						By continuing, you agree to our{' '}
						<a href='#' className='underline underline-offset-4 hover:text-primary'>
							Terms of Service
						</a>{' '}
						and{' '}
						<a href='#' className='underline underline-offset-4 hover:text-primary'>
							Privacy Policy
						</a>
						.
					</div>
				</CardFooter> */}
			</Card>
		</div>
	)
}
