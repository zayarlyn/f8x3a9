'use client'
import { useQuery } from '@tanstack/react-query'
import _ from 'lodash'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useQueryState<StateType>(trpcFetcher: any, { getPath }: { getPath: string }) {
	const { data, isLoading, error } = useQuery(trpcFetcher)
	const [state, setState] = useState<StateType>()
	const router = useRouter()

	useEffect(() => {
		if ((error as any)?.data?.code === 'UNAUTHORIZED') return router.push('/join')

		const result = _.get(data, getPath)

		if (!isLoading && result) {
			setState(result)
		}
	}, [data, isLoading, getPath, error, router])

	const setStateFn = (obj: Partial<StateType> | ((old: StateType) => void), merge = true) => {
		setState((prev) => ({ ...prev, ...obj } as StateType))
	}

	const extra = { isLoading: isLoading || !state } // assuming it will be fulfilled eventually
	const returnValues = [state, setStateFn, extra]

	return returnValues as [typeof state, typeof setStateFn, typeof extra]
}
