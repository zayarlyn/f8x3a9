import TripDetailsPage from '@me/components/app/TripDetailsPage'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
	title: 'Trip to',
}

const page = () => {
	return <TripDetailsPage />
}

export default page
