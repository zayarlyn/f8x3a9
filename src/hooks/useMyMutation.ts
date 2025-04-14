import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useMyMutation<T, O = any>(trpcFetcher: any) {
	const { data, error, mutateAsync } = useMutation(trpcFetcher)
	const router = useRouter()

	const handleMutation = async (args: T): Promise<O> => {
		const result = await mutateAsync(args as any)
		if ((error as any)?.data.code === 'UNAUTHORIZED') return router.push('/join')!
		return result as any
	}

	return [handleMutation] as [typeof handleMutation]
}
