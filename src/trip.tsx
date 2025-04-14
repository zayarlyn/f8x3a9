'use client'
import { addDays } from 'date-fns'
import { create } from 'zustand'

type Store = {
	name: string
	destination: string
	place: string
	startDate?: Date
	endDate?: Date
	setDestination: (v: string) => void
	setName: (v: string) => void
	setPlace: (v: string) => void
	setStartDate: (v: Date) => void
	setEndDate: (v: Date) => void
	setTrip: (v: any) => void
	places: { [key: string]: { name: string; items: { id: string; name: string }[] } }
}

export const useTripStore = create<Store>()((set) => ({
	name: 'Japan 2025',
	destination: 'phnom_penh',
	place: 'japan',
	startDate: new Date(),
	endDate: addDays(new Date(), 3),
	places: {
		visit: {
			name: 'Places to visit',
			items: [
				{ id: '1', name: 'Tokyo Tower' },
				{ id: '2', name: 'Sagaing Region' },
			],
		},
	},
	setName: (name: string) => set(() => ({ name })),
	setDestination: (destination: string) => set(() => ({ destination })),
	setPlace: (place: string) => set(() => ({ place })),
	setStartDate: (startDate: Date) => set(() => ({ startDate })),
	setEndDate: (endDate: Date) => set(() => ({ endDate })),
	setTrip: (obj: any) => set(() => obj),
}))

export interface ITrip {
	_id: string
	name: string
	destination: { name: string }
	startDate: string
	endDate: string
	draft: boolean
	places: { id: string; placeId: string; name: string }[]
}

export const trips: ITrip[] = [
	{
		_id: '1',
		name: 'Japan 2025',
		destination: { name: 'Kyoto, Japan' },
		startDate: new Date().toISOString(),
		endDate: addDays(new Date(), 3).toISOString(),
		draft: true,
		places: [
			{ id: '1', name: 'Sagaing', placeId: '1' },
			{ id: '2', name: 'Yangon', placeId: '1' },
		],
	},
	{
		_id: '2',
		name: 'Myanmar 2025',
		destination: { name: 'Sagaing, Myanmar' },
		startDate: new Date().toISOString(),
		endDate: addDays(new Date(), 3).toISOString(),
		draft: true,
		places: [
			{ id: '1', name: 'Career', placeId: '1' },
			{ id: '2', name: 'Orange', placeId: '1' },
		],
	},
	{
		_id: '3',
		name: 'Myanmar 2025',
		destination: { name: 'Sagaing, Myanmar' },
		startDate: new Date().toISOString(),
		endDate: addDays(new Date(), 3).toISOString(),
		draft: false,
		places: [],
	},
]
