'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { TodoItemSchema } from '@me/backend/models/TodoItem'
import { useMyMutation } from '@me/hooks/useMyMutation'
import { useQueryState } from '@me/hooks/useQueryState'
import { Button } from '@me/padauk-ui'
import Input from '@me/padauk-ui/Input'
import { queryClient, trpc } from '@me/TrpcReactQueryCtx'
import Linkify from 'linkify-react'
import _ from 'lodash'
import { Circle, CircleCheck } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

interface ITodoDetail {
	todoItem: TodoItemSchema
	setTodoItem: any
}

const TodoDetail = ({ todoItem, setTodoItem }: ITodoDetail) => {
	const [parent] = useAutoAnimate()

	const [errors, setErrors] = useState({ name: false })
	const [isEditing, setIsEditing] = useState(false)

	const [saveTodoItem] = useMyMutation(trpc.todoItem.mutate.mutationOptions())

	if (!todoItem) return null

	const handleSave = (obj: Partial<TodoItemSchema>) => {
		const err = _.pickBy({ name: !todoItem.name })
		if (!_.isEmpty(err)) return setErrors(err as typeof errors)
		return saveTodoItem({ id: todoItem._id, values: obj }).then(() => {
			queryClient.invalidateQueries(trpc.todoItem.query.queryOptions({ id: todoItem._id }))
			setIsEditing(false)
		})
	}

	return (
		<div className='pb-4'>
			<div className='w-11/12 mx-auto mt-20 mb-52'>
				{isEditing ? (
					<div className='flex flex-col gap-4'>
						<Input onChange={(v) => setTodoItem({ name: v })} value={todoItem.name} placeholder='god' fullWidth />
						<Input value={todoItem.description} onChange={(v) => setTodoItem({ description: v })} placeholder='Add note' fullWidth multiline />
					</div>
				) : (
					<div>
						<div className='mb-6 flex items-center justify-between' ref={parent}>
							<h1 className='text-xl font-semibold'>{todoItem.name}</h1>
							{todoItem.done ? <CircleCheck /> : <Circle />}
						</div>
						{todoItem.description ? (
							<p className='text-gray-500 whitespace-pre-wrap [&_a]:text-blue-500 [&_a]:hover:underline'>
								<Linkify>{todoItem.description}</Linkify>
							</p>
						) : (
							<Button onClick={() => setIsEditing(true)} variant='link'>
								Add a note
							</Button>
						)}
					</div>
				)}
			</div>
			<div className='p-4 bg-white flex flex-col gap-2 fixed w-full bottom-0 border-t border-t-gray-300'>
				{isEditing ? (
					<>
						<Button onClick={() => handleSave(_.pick(todoItem, ['name', 'description']))} fullWidth>
							Save
						</Button>
						<Button onClick={() => setIsEditing(false)} fullWidth>
							Cancel
						</Button>
						<Button className='bg-red-400 hover:bg-red-500 active:bg-red-500' fullWidth>
							Delete
						</Button>
					</>
				) : (
					<>
						<Button onClick={() => setIsEditing(true)} fullWidth>
							Edit
						</Button>
						<Button onClick={() => handleSave({ done: !todoItem.done })} fullWidth>
							{todoItem.done ? 'Reopen Task' : 'Mark as Done'}
						</Button>
					</>
				)}
			</div>
		</div>
	)
}

const LoadingSkeleton = () => {
	return (
		<div className='max-w-2xl mx-auto px-4 py-8 w-full pt-20'>
			{/* Title skeleton */}
			<div className='mb-8 flex justify-between items-center'>
				<div className='h-10 bg-gray-200 rounded-md w-3/4 animate-pulse'></div>
				<div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse'></div>
			</div>

			{/* First paragraph skeleton - multiple lines */}
			<div className='space-y-2 mb-10'>
				<div className='h-4 bg-gray-200 rounded-md w-full animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-full animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-11/12 animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-full animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-10/12 animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-full animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-9/12 animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-full animate-pulse'></div>
			</div>

			{/* Second paragraph skeleton - multiple lines */}
			<div className='space-y-2'>
				<div className='h-4 bg-gray-200 rounded-md w-full animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-full animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-11/12 animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-full animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-10/12 animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-full animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-md w-9/12 animate-pulse'></div>
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
