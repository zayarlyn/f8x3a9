'use client'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { TodoListSchema } from '@me/backend/models/TodoList'
import { TripSchema } from '@me/backend/models/Trip'
import { AppRouter } from '@me/backend/trpc/routers/router'
import { useMyMutation } from '@me/hooks/useMyMutation'
import { useQueryState } from '@me/hooks/useQueryState'
import { queryClient, trpc } from '@me/TrpcReactQueryCtx'
import { inferRouterInputs } from '@trpc/server'
import { format } from 'date-fns'
import _ from 'lodash'
import { SquarePen } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { TodoList } from '../TodoList'
import { TodoListDialog } from '../TodoListDialog'
import { TripMetaDialog } from '../TripMetaDialog'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Skeleton } from '../ui/skeleton'

export enum ETripStatus {
	draft = 'draft',
	started = 'started',
	ended = 'ended',
}

const TodoLists = ({ trip, setTrip }: { trip: TripSchema; setTrip: any }) => {
	const [openTodoList, setOpenTodoList] = useState<TodoListSchema>()
	const [parent] = useAutoAnimate()

	return (
		<div>
			{openTodoList && <TodoListDialog trip={trip} onClose={() => setOpenTodoList(undefined)} />}
			<div className='flex justify-end mb-4'>
				<Button onClick={() => setOpenTodoList({} as TodoListSchema)} variant='link-btn'>
					Create a list
				</Button>
			</div>
			<div className='text-gray-500'>
				{_.map(trip.todoLists, (todoList) => {
					return <TodoList trip={trip} setTrip={setTrip} todoList={todoList} key={todoList._id} />
				})}
			</div>
		</div>
	)
}

export const TripDetails = ({ trip, setTrip }: { trip: TripSchema; setTrip: any }) => {
	const [openTripMetaDialog, setOpenTripMetaDialog] = useState(false)
	const [saveTrip] = useMyMutation<inferRouterInputs<AppRouter>['trip']['mutate']>(trpc.trip.mutate.mutationOptions())
	const [parent] = useAutoAnimate()

	const handleSaveTrip = async (obj: Partial<TripSchema>) => {
		return saveTrip({ id: trip._id, values: obj }).then(() => {
			queryClient.invalidateQueries({ queryKey: trpc.trip.query.queryKey({ id: trip._id }) })
		})
	}

	const todoCount = _.sumBy(trip.todoLists, (t) => t.todoItems.length) || 1
	const doneTodoCount = _.sumBy(trip.todoLists, (t) => _.filter(t.todoItems, (td) => td.done).length)
	const progress = Math.floor((doneTodoCount / todoCount) * 100)
	const started = trip.status === ETripStatus.started
	const canEnd = progress === 100

	return (
		<div className='pb-6'>
			{openTripMetaDialog && <TripMetaDialog trip={trip} onClose={() => setOpenTripMetaDialog(false)} />}
			<div className='h-40 relative'>
				{/* <img className='absolute -z-10 left-0 top-0 h-full w-full object-cover' src='https://www.state.gov/wp-content/uploads/2019/04/Japan-2107x1406.jpg' alt='japan' /> */}
				<img className='absolute -z-10 left-0 top-0 h-full w-full object-cover' src='https://random-image-pepebigotes.vercel.app/api/random-image' alt='japan' />
			</div>
			<div className='my-width -translate-y-12'>
				<div ref={parent} className='mb-2 relative text-center bg-white  p-3 rounded-md border-gray-300 border'>
					<h1 className='text-lg font-medium'>{trip.name}</h1>
					<p className='mt-1 text-gray-600'>
						<span>{format(trip.startDate!, 'yyyy-MMM-dd (eee)')}</span> -<span>{format(trip.endDate!, 'yyyy-MMM-dd (eee)')}</span>
					</p>
					{/* <Badge variant='outline'>{trip.status}</Badge> */}
					{started && (
						<div className='mt-2'>
							<div className='flex justify-between items-center mb-1'>
								<span>Progress</span>
								<span>{progress} %</span>
							</div>
							<Progress value={progress} />
						</div>
					)}
					<div className='absolute top-0 right-0 m-2'>
						<Button onClick={() => setOpenTripMetaDialog(true)} variant='ghost' size='icon'>
							<SquarePen />
						</Button>
					</div>
				</div>
				<div className='mb-4'>
					{/* {trip.status === ETripStatus.draft && ( */}
					<Button onClick={() => handleSaveTrip({ status: trip.status === ETripStatus.draft ? ETripStatus.started : ETripStatus.ended })} fullWidth>
						{started ? 'End the trip' : 'Start the trip'}
					</Button>
					{started && (
						<>
							<Button onClick={() => handleSaveTrip({ status: ETripStatus.draft })} className='' variant='link-btn' fullWidth>
								Cancel the trip
							</Button>
						</>
					)}
					{/* )} */}
				</div>
				<div className='flex flex-col gap-2 mb-20'>
					<TodoLists trip={trip} setTrip={setTrip} />
				</div>
			</div>
		</div>
	)
}

const LoadingSkeleton = () => {
	return (
		<div className='min-h-screen flex flex-col'>
			{/* Background image and header */}
			<div className='relative h-32 bg-slate-200'>
				<Skeleton className='absolute top-0 left-0 right-0 bottom-0' />
				<div className='absolute top-4 left-4 z-10'>
					<Skeleton className='h-10 w-10 rounded-full' />
				</div>
			</div>

			{/* Trip details card */}
			<div className='px-4 -mt-6 z-10'>
				<div className='bg-white rounded-lg p-4 border border-gray-300'>
					<div className='flex justify-between items-start mb-4'>
						<Skeleton className='h-7 w-32' />
						<Skeleton className='h-6 w-6' />
					</div>
					<Skeleton className='h-4 w-64 mb-4' />

					{/* Progress section */}
					<div className='mb-4'>
						<div className='flex justify-between mb-1'>
							<Skeleton className='h-4 w-20' />
							<Skeleton className='h-4 w-12' />
						</div>
						<Skeleton className='h-2 w-full rounded-full' />
					</div>

					{/* Action buttons */}
					<Skeleton className='h-12 w-full rounded-md mb-2' />
					<div className='flex justify-center'>
						<Skeleton className='h-4 w-28' />
					</div>
				</div>
			</div>

			{/* Create a list button */}
			<div className='flex justify-end px-4 mt-4'>
				<Skeleton className='h-4 w-24' />
			</div>

			{/* To Explore tomorrow section */}
			<div className='px-4 mt-6'>
				<div className='flex justify-between items-center mb-4'>
					<Skeleton className='h-5 w-40' />
					<div className='flex items-center'>
						<Skeleton className='h-4 w-16 mr-2' />
						<Skeleton className='h-6 w-6' />
					</div>
				</div>

				{/* List items */}
				{[1, 2, 3].map((i) => (
					<div key={`explore-${i}`} className='border-b py-4 flex justify-between items-center'>
						<Skeleton className='h-5 w-48' />
						<Skeleton className='h-6 w-6 rounded-full' />
					</div>
				))}

				{/* Add a place */}
				<div className='mt-4'>
					<Skeleton className='h-4 w-24' />
				</div>
			</div>

			{/* Internships section */}
			<div className='px-4 mt-8'>
				<div className='flex justify-between items-center mb-4'>
					<Skeleton className='h-5 w-24' />
					<div className='flex items-center'>
						<Skeleton className='h-4 w-16 mr-2' />
						<Skeleton className='h-6 w-6' />
					</div>
				</div>

				{/* List items */}
				{[1, 2, 3, 4].map((i) => (
					<div key={`internship-${i}`} className='border-b py-4 flex justify-between items-center'>
						<Skeleton className='h-5 w-36' />
						<Skeleton className='h-6 w-6 rounded-full' />
					</div>
				))}

				{/* Add a place */}
				<div className='mt-4'>
					<Skeleton className='h-4 w-24' />
				</div>
			</div>

			{/* Profile button */}
			<div className='fixed bottom-4 left-4'>
				<Skeleton className='h-10 w-10 rounded-full' />
			</div>
		</div>
	)
}

export default function TripDetailsPage() {
	const { tripId } = useParams()
	const [rawTrip, setTrip, { isLoading }] = useQueryState<TripSchema>(trpc.trip.query.queryOptions({ id: tripId as string }), { getPath: 'data.0' })

	// O(n^2)
	const trip = useMemo(() => {
		if (!rawTrip) return undefined
		const sortedTodoLists = _.map(rawTrip?.todoLists, (list) => ({
			...list,
			todoItems: list.sortOrder.length ? _.map(list.sortOrder, (_id) => _.find(list.todoItems, { _id })!) : list.todoItems,
		}))
		const result = { ...rawTrip, todoLists: sortedTodoLists }
		return result
	}, [rawTrip])

	if (isLoading) return <LoadingSkeleton />

	return <TripDetails setTrip={setTrip} trip={trip!} />
}
