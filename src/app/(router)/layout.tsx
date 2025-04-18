'use client'
import { Button } from '@me/components/ui/button'
import { Toaster } from '@me/components/ui/sonner'
import { TrpcReactQueryCtx } from '@me/TrpcReactQueryCtx'
import { ArrowLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const pathname = usePathname()
	const router = useRouter()

	return (
		<TrpcReactQueryCtx>
			<header className='p-4 py-3 fixed top-0 left-0 z-10'>
				{!['/', '/join'].includes(pathname) && (
					<Button size='icon' className='rounded-full p-3 border border-gray-300' onClick={() => router.back()} variant='secondary'>
						<ArrowLeft />
					</Button>
				)}
			</header>
			<div>{children}</div>
			<Toaster />
		</TrpcReactQueryCtx>
	)
}
