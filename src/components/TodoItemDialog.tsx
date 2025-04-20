'use client'
import { TodoItemSchema } from '@me/backend/models/TodoItem'
import { TripSchema } from '@me/backend/models/Trip'
import { AppRouter } from '@me/backend/trpc/routers/router'
import { useMyMutation } from '@me/hooks/useMyMutation'
import Combobox from '@me/padauk-ui/Combobox'
import { queryClient, trpc } from '@me/contexts/TrpcReactQueryCtx'
import { inferRouterInputs } from '@trpc/server'
import _ from 'lodash'
import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import Input from './ui/Input'

export const TodoItemDialog = ({ trip, todoListId: defaultTodoListId, todo, onClose }: { todo?: TodoItemSchema; trip: TripSchema; todoListId: string; onClose: () => void }) => {
	const [saveTodoItem] = useMyMutation<inferRouterInputs<AppRouter>['todoItem']['mutate']>(trpc.todoItem.mutate.mutationOptions())
	const [todoListId, setTodoListId] = useState(defaultTodoListId)
	const [name, setName] = useState(todo?.name || '')
	const [errors, setErrors] = useState({ name: false, todoListId: false })

	const handleSaveTodoItem = async ({ deleteAt }: any) => {
		const err = _.pickBy({ name: !name, todoListId: !todoListId })
		if (!_.isEmpty(err)) return setErrors(err as typeof errors)
		const input = { id: todo?._id, deleteAt, values: { name, todoListId } }

		return saveTodoItem(input).then(() => {
			queryClient.invalidateQueries({ queryKey: trpc.trip.query.queryKey({ id: trip._id }) })
			onClose()
		})
	}

	return (
		<Dialog open onOpenChange={onClose}>
			<Dialog.Header onClose={onClose}>{trip._id ? 'Todo' : 'Create a Todo'}</Dialog.Header>
			<Dialog.Content>
				<div className='flex flex-col gap-4'>
					<Combobox
						value={todoListId}
						onChange={setTodoListId}
						placeholder='List'
						options={_.map(trip.todoLists, (list) => ({ value: list._id!, label: list.name }))}
						error={errors.todoListId ? 'List is required' : ''}
					/>
					<Input value={name} onChange={setName} placeholder='Name' error={errors.name ? 'Name is required' : ''} fullWidth />
				</div>
			</Dialog.Content>
			<Dialog.Footer>
				<Button onClick={() => handleSaveTodoItem({})} fullWidth>
					{todo?._id ? 'Save' : 'Create'}
				</Button>
				{todo?._id ? (
					<Button onClick={() => handleSaveTodoItem({ deletedAt: true })} className='bg-red-400 hover:bg-red-500 active:bg-red-500 mt-2' fullWidth>
						Delete
					</Button>
				) : null}
			</Dialog.Footer>
		</Dialog>
	)
}
