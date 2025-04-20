'use client'
import { AppRouter } from '@me/backend/trpc/routers/router'
import { useMyMutation } from '@me/hooks/useMyMutation'
import { trpc } from '@me/contexts/TrpcReactQueryCtx'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import _ from 'lodash'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'
import { DateRangePicker } from './DateRangePicker'
import { Input } from '../ui/Input'

export default function PlanTripPage() {
	const router = useRouter()
	const [trip, setTrip] = useState({ name: '', startDate: '', endDate: '' })
	const [errors, setErrors] = useState({ name: false, dates: false })
	const [saveTripMeta] = useMyMutation<inferRouterInputs<AppRouter>['trip']['mutate'], inferRouterOutputs<AppRouter>['trip']['mutate']>(trpc.trip.mutate.mutationOptions({}))

	const onChange = (obj: any) => {
		setTrip((prev) => ({ ...prev, ...obj }))
	}

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<span className='text-lg mb-4 font-semibold'>Where will you be going?</span>
			<div className='flex flex-col gap-4 w-80'>
				<Input
					// error='Name is required'
					value={trip.name || ''}
					onChange={(v) => onChange({ name: v })}
					placeholder='Trip Name'
					fullWidth
					error={errors.name ? 'This Field is required' : ''}
				/>
				{/* <DatePicker
					startDate={trip.startDate ? new Date(trip.startDate) : undefined}
					endDate={trip.endDate ? new Date(trip.endDate) : undefined}
					onChange={([startDate, endDate]: any) => onChange({ startDate, endDate })}
					fullWidth
					error={errors.dates ? 'This Field is required' : ''}
				/> */}
				<DateRangePicker
					value={{ from: trip.startDate ? new Date(trip.startDate) : undefined, to: trip.endDate ? new Date(trip.endDate) : undefined }}
					onChange={(v) => onChange({ startDate: v.from?.toISOString(), endDate: v.to?.toISOString() })}
				/>
				<Button
					onClick={() => {
						const err = _.pickBy({ name: !trip.name, dates: !trip.startDate || !trip.endDate })
						if (!_.isEmpty(err)) return setErrors(err as typeof errors)

						return saveTripMeta({ values: trip }).then((res) => router.replace('/trips/' + res.data._id))
					}}
					// fullWidth
				>
					Next
				</Button>
			</div>
		</div>
	)
}
