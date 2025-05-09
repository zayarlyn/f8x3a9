import HomePage from '@me/components/app/HomePage'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
	title: 'Trips',
}

const page = () => {
	return redirect('/trips')
}

export default page
