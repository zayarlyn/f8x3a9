import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useMyMutation<T, O = any>(trpcFetcher: any, mutationMessage?: string) {
	const { data, error, mutateAsync } = useMutation(trpcFetcher)
	const router = useRouter()

	const handleMutation = async (_args: T): Promise<O> => {
		const args = _args as any
		const result = await mutateAsync(args)
		if ((error as any)?.data?.code === 'UNAUTHORIZED') return router.push('/join')!
		const message = mutationMessage || args._id ? (args.deletedAt ? 'Deleted' : 'Created') : 'Saved'
		toast(message)
		return result as any
	}

	return [handleMutation] as [typeof handleMutation]
}
