'use client'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { TripSchema } from '@me/backend/models/Trip'
import { useQueryState } from '@me/hooks/useQueryState'
import { trpc } from '@me/TrpcReactQueryCtx'
import { addDays, format } from 'date-fns'
import _ from 'lodash'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { ETripStatus } from './TripDetailsPage'
import { twMerge } from 'tailwind-merge'

export const List = ({ children, className, itemCount, ...props }: any) => {
	return (
		<div {...props} className={twMerge('', className)}>
			{itemCount ? children : <span className='text-center text-gray-600'>List is empty</span>}
		</div>
	)
}

const TripList = ({ trips, name }: { name: string; trips: TripSchema[] }) => {
	const router = useRouter()
	const [parent] = useAutoAnimate()

	return (
		<div className='mb-3'>
			<div className='m-2'>
				<span className='font-semibold'>{name}</span>
			</div>

			<List ref={parent} className='flex flex-col mb-4' itemCount={trips.length}>
				{_.map(trips, (trip) => {
					return (
						// <Skeleton key={trip._id} loading={isLoading}>

						<Button asChild key={trip._id} onClick={() => router.push('/trip/' + trip._id)} className='mb-3 p-2 block' size='free' variant='outline'>
							<div className=''>
								<div className='text-lg mb-1 font-semibold'>{trip.name}</div>
								<div className='flex gap-2 justify-between'>
									{/* <span>{trip.location.name}</span> */}
									<span>
										{trip.startDate && format(trip.startDate, 'yyyy-MM-dd')} - {trip.endDate && format(addDays(trip.endDate, 3), 'yyyy-MM-dd')}
									</span>
									<span className='font-semibold'>{_.sumBy(trip.todoLists, (t) => t.todoItems.length)} Todos</span>
								</div>
							</div>
						</Button>
						// </Skeleton>
					)
				})}
			</List>
			{/* )} */}
		</div>
	)
}

const LoadingSkeleton = () => {
	return (
		<div className='p-4'>
			<div className='flex flex-col items-center justify-center h-28 mb-2'>
				<h1 className='text-xl'>You only live once</h1>

				<Button className='pointer-events-none text-gray-600' variant='link-btn' size='sm'>
					Plan a trip
				</Button>
			</div>

			<div className='h-5 w-20 bg-slate-300 animate-pulse mb-2' />
			<div className='flex flex-col'>
				{Array(7)
					.fill(0)
					.map((he, index) => {
						return (
							<div key={index}>
								<div className='w-auto mb-3 p-2 rounded-md border border-gray-300'>
									<div className='text-lg mb-1 bg-gray-300 whitespace-pre'> </div>
									<div className='bg-gray-300 whitespace-pre'> </div>
								</div>
							</div>
						)
					})}
			</div>
		</div>
	)
}

const Trips = ({ trips }: { trips: TripSchema[] }) => {
	const router = useRouter()
	const [parent] = useAutoAnimate()

	const handleSignOut = async () => {
		router.push('/api/auth/disconnect')
	}

	return (
		<div className=''>
			<header className='py-2 px-4 flex items-center justify-between border-b border-b-gray-300 sticky top-0 bg-white'>
				<span className='font-semibold'>YOLO Travel</span>
				{/* <Button onClick={() => router.push('/join')} variant='link-btn' size='sm'>
					Sign In
				</Button> */}
				<Button onClick={handleSignOut} variant='link-btn' size='sm'>
					Sign Out
				</Button>
			</header>
			<div className='pt-4 pb-12 my-width'>
				<div className='flex flex-col items-center justify-center h-28'>
					<h1 className='text-xl'>You only live once</h1>

					<Button onClick={() => router.push('/plan')} variant='link-btn' size='sm'>
						Plan a trip
					</Button>
				</div>
				<TripList name='Started' trips={_.filter(trips, { status: ETripStatus.started })} />
				<TripList name='Upcoming' trips={_.filter(trips, { status: ETripStatus.draft })} />
			</div>
		</div>
	)
}

export default function HomePage() {
	const [trips, setTrips, { isLoading }] = useQueryState<TripSchema[]>(trpc.trip.query.queryOptions({}, {}), { getPath: 'data' })
	const router = useRouter()
	// console.log(error?.message)

	if (isLoading) return <LoadingSkeleton />

	return <Trips trips={trips!} />
}
