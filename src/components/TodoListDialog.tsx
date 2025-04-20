'use client'
import { TodoListSchema } from '@me/backend/models/TodoList'
import { TripSchema } from '@me/backend/models/Trip'
// import Dialog from '@me/padauk-ui/Dialog'
import { AppRouter } from '@me/backend/trpc/routers/router'
import { useMyMutation } from '@me/hooks/useMyMutation'
import { queryClient, trpc } from '@me/contexts/TrpcReactQueryCtx'
import { inferRouterInputs } from '@trpc/server'
import _ from 'lodash'
import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import Input from './ui/Input'

export const TodoListDialog = ({ trip, todoList, onClose }: { todoList?: TodoListSchema; trip: TripSchema; onClose: () => void }) => {
	const [saveTodoList] = useMyMutation<inferRouterInputs<AppRouter>['todoList']['mutate']>(trpc.todoList.mutate.mutationOptions())
	// const [todoListId, setTodoListId] = useState(defaultTodoListId)
	const [name, setName] = useState(todoList?.name || '')
	const [errors, setErrors] = useState({ name: false, todoListId: false })

	const handleSaveTodoItem = async ({ deletedAt }: any) => {
		const err = _.pickBy({ name: !name })
		if (!_.isEmpty(err)) return setErrors(err as typeof errors)
		const input = { id: todoList?._id, deletedAt, values: { tripId: trip._id, name } }

		return saveTodoList(input).then(() => {
			queryClient.invalidateQueries({ queryKey: trpc.trip.query.queryKey({ id: trip._id }) })
			onClose()
		})
	}

	return (
		<Dialog open onOpenChange={onClose}>
			<Dialog.Header onClose={onClose}>{trip._id ? 'Todo List' : 'Create a Todo List'}</Dialog.Header>
			<Dialog.Content>
				<div className='flex flex-col gap-4'>
					<Input value={name} onChange={setName} placeholder='Name' error={errors.name ? 'Name is required' : ''} fullWidth />
				</div>
			</Dialog.Content>
			<Dialog.Footer>
				<div className='flex gap-2'>
					{todoList?._id ? (
						<Button variant='destructive' onClick={() => handleSaveTodoItem({ deletedAt: true })} className='grow'>
							Delete
						</Button>
					) : null}
					<Button onClick={() => handleSaveTodoItem({})} className='grow'>
						{todoList?._id ? 'Save' : 'Create'}
					</Button>
				</div>
			</Dialog.Footer>
		</Dialog>
	)
}
