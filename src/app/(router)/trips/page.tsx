import HomePage from '@me/components/app/HomePage'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Trips',
}

const page = async () => {
	return <HomePage />
}

export default page
