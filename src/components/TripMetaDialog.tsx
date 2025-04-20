'use client'
import { TodoListSchema } from '@me/backend/models/TodoList'
import { TripSchema } from '@me/backend/models/Trip'
// import Dialog from '@me/padauk-ui/Dialog'
import { AppRouter } from '@me/backend/trpc/routers/router'
import { useMyMutation } from '@me/hooks/useMyMutation'
import { queryClient, trpc } from '@me/contexts/TrpcReactQueryCtx'
import { inferRouterInputs } from '@trpc/server'
import _ from 'lodash'
import { useState } from 'react'
import { DateRangePicker } from './app/DateRangePicker'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import { Input } from './ui/Input'
// import {  } from '@trpc/client'

export const TripMetaDialog = ({ trip: dbTrip, onClose }: { todoList?: TodoListSchema; trip: TripSchema; onClose: () => void }) => {
	const [trip, setTrip] = useState<Partial<TripSchema>>(dbTrip)
	const [errors, setErrors] = useState({ name: false, destination: false, dates: false })
	const [saveTripMeta] = useMyMutation<inferRouterInputs<AppRouter>['trip']['mutate']>(trpc.trip.mutate.mutationOptions({}))

	const onChange = (obj: any) => {
		setTrip((prev) => ({ ...prev, ...obj }))
	}

	const handleSaveTodoItem = async ({ deletedAt }: any) => {
		const err = _.pickBy({ name: !trip.name, dates: !trip.startDate || !trip.endDate })
		if (!_.isEmpty(err)) return setErrors(err as typeof errors)

		const input = { id: trip?._id, deletedAt, values: _.pick(trip, ['name', 'startDate', 'endDate']) }

		return saveTripMeta(input).then(() => {
			queryClient.invalidateQueries({ queryKey: trpc.trip.query.queryKey({ id: trip._id }) })
			onClose()
		})
	}

	return (
		<Dialog open onOpenChange={onClose}>
			<Dialog.Header onClose={onClose}>{trip._id ? 'Todo List' : 'Create a Todo List'}</Dialog.Header>
			<Dialog.Content>
				<div className='flex flex-col gap-4'>
					<Input
						// error='Name is required'
						value={trip.name || ''}
						onChange={(v) => onChange({ name: v })}
						placeholder='Trip Name'
						fullWidth
						error={errors.name ? 'This Field is required' : ''}
					/>
					<DateRangePicker
						value={{ from: trip.startDate ? new Date(trip.startDate) : undefined, to: trip.endDate ? new Date(trip.endDate) : undefined }}
						onChange={(v) => onChange({ startDate: v.from?.toISOString(), endDate: v.to?.toISOString() })}
					/>
				</div>
			</Dialog.Content>
			<Dialog.Footer>
				<div className='flex gap-2'>
					{trip?._id ? (
						<Button variant='destructive' onClick={() => handleSaveTodoItem({ deletedAt: true })} className='grow'>
							Delete
						</Button>
					) : null}
					<Button onClick={() => handleSaveTodoItem({})} className='grow'>
						{trip?._id ? 'Save' : 'Create'}
					</Button>
				</div>
			</Dialog.Footer>
		</Dialog>
	)
}
