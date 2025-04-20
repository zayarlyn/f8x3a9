import { trpc } from '@me/contexts/TrpcReactQueryCtx'
import { TripSchema } from '@me/backend/models/Trip'
import { AppRouter } from '@me/backend/trpc/routers/router'
import { useMyMutation } from '@me/hooks/useMyMutation'
import { Button, IconButton } from '@me/padauk-ui'
import Combobox from '@me/padauk-ui/Combobox'
import DatePicker from '@me/padauk-ui/DatePicker'
import { inferRouterInputs } from '@trpc/server'
import _ from 'lodash'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Input from './ui/Input'

export const TripMetadata = (props: { setStep: any }) => {
	const [trip, setTrip] = useState<Partial<TripSchema>>({})
	const [errors, setErrors] = useState({ name: false, destination: false, dates: false })
	// const trip = useTripStore()
	const router = useRouter()
	const [saveTripMeta] = useMyMutation<inferRouterInputs<AppRouter>['trip']['mutate']>(trpc.trip.mutate.mutationOptions({}))

	const onChange = (obj: any) => {
		setTrip((prev) => ({ ...prev, ...obj }))
	}

	return (
		<div className='flex-col' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
			<div className='p-4 fixed top-0 left-0'>
				<IconButton className='text-white' onClick={() => router.push('/')}>
					<ArrowLeft />
				</IconButton>
			</div>
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
				{/* <Combobox
					options={[
						{ label: 'Japan', value: 'japan' },
						{ label: 'ChongQing', value: 'chongqing' },
						{ label: 'Phnom Penh', value: 'phnom_penh' },
					]}
					value={trip.location?.name}
					onChange={(v) => onChange({ location: { name: v } })}
					placeholder='Destination'
					// error='Destination is required'
					error={errors.destination ? 'This Field is required' : ''}
				></Combobox> */}
				<DatePicker
					startDate={trip.startDate ? new Date(trip.startDate) : undefined}
					endDate={trip.endDate ? new Date(trip.endDate) : undefined}
					onChange={([startDate, endDate]: any) => onChange({ startDate, endDate })}
					fullWidth
					error={errors.dates ? 'This Field is required' : ''}
				/>
				<Button
					onClick={() => {
						const err = _.pickBy({ name: !trip.name, dates: !trip.startDate || !trip.endDate })
						if (!_.isEmpty(err)) return setErrors(err as typeof errors)
						// const values = {
						// 	name: faker.location.country(),
						// 	startDate: new Date().toISOString(),
						// 	endDate: addDays(new Date(), Math.floor(Math.random() * 10)).toISOString(),
						// 	location: { name: faker.location.city(), locationId: faker.database.mongodbObjectId() },
						// 	// draft: true,
						// 	// todoLists: [{ name: 'Places to visit' }] as TodoListSchema[],
						// 	// placeGroups: [{ name: 'Visit' }],
						// 	// places: [{ name: faker.location.city(), locationId: faker.database.mongodbObjectId() }],
						// }
						return saveTripMeta({ values: trip })
						// setStep({ ...trip, endDate: trip.endDate?.valueOf(), startDate: trip.startDate?.valueOf() })
					}}
					fullWidth
				>
					Next
				</Button>
			</div>
		</div>
	)
}
