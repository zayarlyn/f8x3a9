import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import './globals.css'

const quicksand = Quicksand({
	variable: '--font-quick-sand',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Yolo Travel',
	description: 'Plan you next trip ahead',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<head>
				<meta name='viewport' content='width=device-width, initial-scale=1.5, viewport-fit=cover' />
				<meta name='apple-mobile-web-app-capable' content='yes'></meta>
				<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'></meta>
			</head>
			<body className={`${quicksand.variable} antialiased font-[quicksand] font-medium`}>
				<div>{children}</div>
			</body>
		</html>
	)
}
