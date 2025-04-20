'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { TodoItemSchema } from '@me/backend/models/TodoItem'
import { useMyMutation } from '@me/hooks/useMyMutation'
import { useQueryState } from '@me/hooks/useQueryState'
import { queryClient, trpc } from '@me/contexts/TrpcReactQueryCtx'
import Linkify from 'linkify-react'
import _ from 'lodash'
import { Edit } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import Input from '../ui/Input'
import { useAlert } from '@me/contexts/AlertCtx'

interface ITodoDetail {
	todoItem: TodoItemSchema
	setTodoItem: any
}

const TodoDetail = ({ todoItem, setTodoItem }: ITodoDetail) => {
	const [parent] = useAutoAnimate()
	const { alertConfirm } = useAlert()
	const router = useRouter()

	const [errors, setErrors] = useState({ name: false })
	const [isEditing, setIsEditing] = useState(false)

	const [saveTodoItem] = useMyMutation(trpc.todoItem.mutate.mutationOptions())

	if (!todoItem) return null

	const handleSave = ({ deletedAt, ...obj }: Partial<TodoItemSchema> | { deletedAt: boolean }) => {
		const err = _.pickBy({ name: !todoItem.name })
		if (!_.isEmpty(err)) return setErrors(err as typeof errors)
		return saveTodoItem({ id: todoItem._id, values: obj, deletedAt }).then(() => {
			queryClient.invalidateQueries(trpc.todoItem.query.queryOptions({ id: todoItem._id }))
			setIsEditing(false)
			if (deletedAt) router.back()
		})
	}

	return (
		<div className='pb-4'>
			<div className='mt-20 mb-52 my-width'>
				{isEditing ? (
					<div className='flex flex-col gap-4'>
						<div className='flex items-center gap-2 justify-end'>
							<Button
								className='text-red-500'
								onClick={() =>
									alertConfirm().then((result) => {
										if (result) {
											return handleSave({ deletedAt: true })
										}
									})
								}
								variant='link-btn'
							>
								Delete
							</Button>
							<Button onClick={() => handleSave(_.pick(todoItem, ['name', 'description']))} variant='link-btn'>
								Save
							</Button>

							{/* {todoItem.done ? <CircleCheck /> : <Circle />} */}
						</div>
						<Input onChange={(v) => setTodoItem({ name: v })} value={todoItem.name} placeholder='Name' fullWidth />
						<Input value={todoItem.description} onChange={(v) => setTodoItem({ description: v })} placeholder='Add note' fullWidth multiline />
					</div>
				) : (
					<div>
						<div className='mb-6 flex items-start justify-between gap-2' ref={parent}>
							<h1 className='text-xl font-semibold'>{todoItem.name}</h1>
							<div className='flex items-center gap-4 mt-1'>
								<Button onClick={() => setIsEditing(true)} variant='ghost' size='icon'>
									<Edit />
								</Button>

								{/* {todoItem.done ? <CircleCheck /> : <Circle />} */}
							</div>
						</div>
						{todoItem.description ? (
							<p className='text-gray-500 whitespace-pre-wrap [&_a]:text-blue-500 [&_a]:hover:underline'>
								<Linkify>{todoItem.description}</Linkify>
							</p>
						) : (
							<Button onClick={() => setIsEditing(true)} variant='link-btn'>
								Add a note
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

const LoadingSkeleton = () => {
	return (
		<div className='min-h-screen bg-white'>
			{/* Header with back button */}
			<div className='p-4'>
				<Skeleton className='h-10 w-10 rounded-full' />
			</div>

			{/* Title section */}
			<div className='px-6 py-4 flex justify-between items-start'>
				<Skeleton className='h-6 w-3/4' />
				<Skeleton className='h-6 w-6' />
			</div>

			{/* Content items */}
			<div className='px-6 space-y-8'>
				{/* Item 1 */}
				<div className='space-y-2'>
					<div className='flex items-center space-x-2'>
						<Skeleton className='h-5 w-32' />
						<Skeleton className='h-4 w-16' />
					</div>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-5/6' />
					<div className='flex items-center space-x-3 mt-2'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-4 w-12' />
						<Skeleton className='h-4 w-12' />
					</div>
				</div>

				{/* Item 2 */}
				<div className='space-y-2'>
					<div className='flex items-center space-x-2'>
						<Skeleton className='h-5 w-28' />
						<Skeleton className='h-4 w-16' />
					</div>
					<Skeleton className='h-4 w-full' />
					<div className='flex items-center space-x-3 mt-2'>
						<Skeleton className='h-4 w-16' />
						<Skeleton className='h-4 w-8' />
						<Skeleton className='h-4 w-10' />
					</div>
				</div>

				{/* Item 3 */}
				<div className='space-y-2'>
					<div className='flex items-center space-x-2'>
						<Skeleton className='h-5 w-24' />
						<Skeleton className='h-4 w-16' />
					</div>
					<Skeleton className='h-4 w-full' />
					<div className='flex items-center space-x-3 mt-2'>
						<Skeleton className='h-4 w-14' />
						<Skeleton className='h-4 w-8' />
						<Skeleton className='h-4 w-10' />
					</div>
				</div>

				{/* Item 4 */}
				<div className='space-y-2'>
					<div className='flex items-center space-x-2'>
						<Skeleton className='h-5 w-36' />
						<Skeleton className='h-4 w-16' />
					</div>
					<Skeleton className='h-4 w-full' />
					<div className='flex items-center space-x-3 mt-2'>
						<Skeleton className='h-4 w-16' />
						<Skeleton className='h-4 w-10' />
						<Skeleton className='h-4 w-8' />
					</div>
				</div>

				{/* Item 5 */}
				<div className='space-y-2'>
					<div className='flex items-center space-x-2'>
						<Skeleton className='h-5 w-32' />
						<Skeleton className='h-4 w-16' />
					</div>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-5/6' />
					<div className='flex items-center space-x-3 mt-2'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-4 w-8' />
						<Skeleton className='h-4 w-10' />
					</div>
				</div>
			</div>
		</div>
	)
}

const TodoDetailPage = () => {
	const { todoId } = useParams<any>()

	const [todoItem, setTodoItem, { isLoading }] = useQueryState<TodoItemSchema>(trpc.todoItem.query.queryOptions({ id: todoId }), { getPath: 'data.0' })

	if (isLoading) return <LoadingSkeleton />

	return <TodoDetail {...{ todoItem: todoItem!, setTodoItem }} />
}

export default TodoDetailPage
