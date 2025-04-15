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
import { useState } from 'react'
import { TodoList } from '../TodoList'
import { TodoListDialog } from '../TodoListDialog'
import { TripMetaDialog } from '../TripMetaDialog'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'

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
			<div ref={parent} className='text-gray-500'>
				{_.map(trip.todoLists, (todoList) => {
					return <TodoList trip={trip} todoList={todoList} key={todoList._id} />
				})}
			</div>
		</div>
	)
}

export const TripDetails = ({ trip, setTrip }: { trip: TripSchema; setTrip: any }) => {
	const [openTripMetaDialog, setOpenTripMetaDialog] = useState(false)
	const [saveTrip] = useMyMutation<inferRouterInputs<AppRouter>['trip']['mutate']>(trpc.trip.mutate.mutationOptions())
	const [parent] = useAutoAnimate()

	const handleSaveTrip = async () => {
		return saveTrip({ id: trip._id, values: { status: trip.status === ETripStatus.draft ? ETripStatus.started : ETripStatus.draft } }).then(() => {
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
					<Button onClick={() => handleSaveTrip()} fullWidth>
						{canEnd ? 'End the trip' : started ? 'Cancel the trip' : 'Start the trip'}
					</Button>
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
		<div className=''>
			<div className='h-40 relative bg-slate-300 animate-pulse' />
			<div className='relative text-center bg-white -translate-y-1/2 w-11/12 mx-auto p-3  rounded-md border-gray-300 border'>
				<h1 className='text-lg font-medium  bg-slate-300 whitespace-pre'> </h1>
				<p className='mt-1 whitespace-pre bg-slate-300 animate-pulse'> </p>
			</div>
			<div className='w-11/12 mx-auto flex flex-col gap-2 mb-20'>
				<div className='flex justify-end mb-4'>
					<div className='whitespace-pre bg-slate-300 animate-pulse w-30 h-6 my-2' />
				</div>
				<div>
					{Array(2)
						.fill(0)
						.map((f, idx) => (
							<div key={idx} className='mb-8'>
								<div className='flex justify-between items-center mb-4'>
									<h2 className='font-medium whitespace-pre bg-slate-300 animate-pulse w-30'> </h2>
									<div className='bg-slate-300 animate-pulse w-6 h-6' />
								</div>
								<div className='flex flex-col gap-2 mb-2'>
									{Array(3)
										.fill(0)
										.map((f, idx) => (
											<div key={idx} className='p-3 border border-gray-300 rounded-md'>
												<div className='flex w-full justify-between gap-4'>
													<div className='h-6 bg-slate-300 whitespace-pre animate-pulse w-full'> </div>
													<div className='h-6 bg-slate-300 whitespace-pre animate-pulse w-6' />
												</div>
												<div className='mt-2 h-5 bg-slate-300 whitespace-pre animate-pulse w-full' />
											</div>
										))}
								</div>
								{/* <div className='bg-slate-300 animate-pulse w-30 h-6' /> */}
							</div>
						))}
				</div>
			</div>
		</div>
	)
}

export default function TripDetailsPage() {
	const { tripId } = useParams()
	const [trip, setTrip, { isLoading }] = useQueryState<TripSchema>(trpc.trip.query.queryOptions({ id: tripId as string }), { getPath: 'data.0' })

	if (isLoading) return <LoadingSkeleton />

	return <TripDetails setTrip={setTrip} trip={trip!} />
}
