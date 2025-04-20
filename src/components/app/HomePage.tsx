'use client'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { TripSchema } from '@me/backend/models/Trip'
import { useQueryState } from '@me/hooks/useQueryState'
import { trpc } from '@me/contexts/TrpcReactQueryCtx'
import { addDays, format } from 'date-fns'
import _ from 'lodash'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import Logo from '../Logo'
import { Button } from '../ui/button'
import { ETripStatus } from './TripDetailsPage'
import { Skeleton } from '../ui/skeleton'
import { useState } from 'react'

export const List = ({ children, className, renderItem, items = [], initialCount, ...props }: any) => {
	const [parent, enableAnimations] = useAutoAnimate(/* optional config */)
	const [maxShown, setMaxShown] = useState(initialCount)

	const itemCount = items.length

	console.log({ initialCount, maxShown, itemCount })

	return (
		<div {...props} ref={parent} className={twMerge('', className)}>
			{itemCount ? (
				_.map(_.slice(items, 0, maxShown || itemCount), (item) => {
					return renderItem(item)
				})
			) : (
				<span className='text-center text-gray-600'>List is empty</span>
			)}
			{!!itemCount && itemCount > initialCount && (
				<Button onClick={() => setMaxShown(maxShown === itemCount ? initialCount : itemCount)} variant='link-btn' className='-mt-2'>
					{maxShown === itemCount ? 'Show less' : 'Show more'}
				</Button>
			)}
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

			<List
				initialCount={4}
				className='flex flex-col mb-6'
				items={trips}
				renderItem={(trip: TripSchema) => {
					return (
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
				}}
			/>
			{/* )} */}
		</div>
	)
}

const LoadingSkeleton = () => {
	return (
		<div className='min-h-screen flex flex-col'>
			{/* Header */}
			<header className='border-b p-4 py-3 flex items-center justify-between'>
				<div className='flex items-center'>
					<Skeleton className='h-6 w-6 mr-2' />
					<Skeleton className='h-6 w-24' />
				</div>
				<Skeleton className='h-6 w-20' />
			</header>

			{/* Main content */}
			<main className='flex-1 max-w-4xl mx-auto w-full px-4 py-8'>
				{/* Hero section */}
				<div className='text-center mb-8'>
					<Skeleton className='h-8 w-48 mx-auto mb-2' />
					<Skeleton className='h-6 w-24 mx-auto' />
				</div>

				{/* Started section */}
				<div className='mb-10'>
					<Skeleton className='h-6 w-24 mb-4' />

					{/* Trip cards */}
					{[1, 2, 3, 4].map((i) => (
						<div key={`started-${i}`} className='border rounded-lg p-4 mb-4'>
							<Skeleton className='h-6 w-48 mb-2' />
							<Skeleton className='h-4 w-40 mb-4' />
							<div className='flex justify-end'>
								<Skeleton className='h-4 w-20' />
							</div>
						</div>
					))}
				</div>

				{/* Upcoming section */}
				<div>
					<Skeleton className='h-6 w-28 mb-4' />

					{/* Trip cards */}
					{[1, 2].map((i) => (
						<div key={`upcoming-${i}`} className='border rounded-lg p-4 mb-4'>
							<Skeleton className='h-6 w-48 mb-2' />
							<Skeleton className='h-4 w-40 mb-4' />
							<div className='flex justify-end'>
								<Skeleton className='h-4 w-20' />
							</div>
						</div>
					))}
				</div>
			</main>
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
				<Logo />
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
				<TripList name='Ended' trips={_.filter(trips, { status: ETripStatus.ended })} />
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
