import HomePage from '@me/components/app/HomePage'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
	title: 'Trips',
}

const page = () => {
	return <HomePage />
}

export default page
