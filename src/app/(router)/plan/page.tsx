import PlanTripPage from '@me/components/app/PlanTripPage'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
	title: 'Plan a trip',
}

const page = () => {
	return <PlanTripPage />
}

export default page
