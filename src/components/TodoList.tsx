'use client'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { TodoItemSchema } from '@me/backend/models/TodoItem'
import { TodoListSchema } from '@me/backend/models/TodoList'
import { TripSchema } from '@me/backend/models/Trip'
import { AppRouter } from '@me/backend/trpc/routers/router'
import { useMyMutation } from '@me/hooks/useMyMutation'
import { queryClient, trpc } from '@me/contexts/TrpcReactQueryCtx'
import { inferRouterInputs } from '@trpc/server'
import _ from 'lodash'
import { Circle, CircleCheck, GripVertical, SquarePen } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { TodoItemDialog } from './TodoItemDialog'
import { TodoListDialog } from './TodoListDialog'
import { Button } from './ui/button'
import { ETripStatus } from './app/TripDetailsPage'
import { List } from './app/HomePage'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { Badge } from './ui/badge'

const placeApiResponse = {
	predictions: [
		{
			description: 'Tokyo, Japan',
			place_id: 'ChIJ51cu8IcbXWARiRtXIothAS4',
			structured_formatting: {
				main_text: 'Tokyo',
				secondary_text: 'Japan',
			},
			types: ['locality', 'political'],
		},
		{
			description: 'Tokyo Tower, 4-chōme-2-8 Shibakōen, Minato City, Tokyo 105-0011, Japan',
			place_id: 'ChIJGTwqC8uLGGARoM9w0Z4-xcg',
			structured_formatting: {
				main_text: 'Tokyo Tower',
				secondary_text: 'Minato City, Tokyo, Japan',
			},
			types: ['tourist_attraction', 'point_of_interest'],
		},
		{
			description: 'Tokyo Skytree, 1-chōme-1-2 Oshiage, Sumida City, Tokyo 131-0045, Japan',
			place_id: 'ChIJ68Wnvc6PGGAR1PTBk3Ov40M',
			structured_formatting: {
				main_text: 'Tokyo Skytree',
				secondary_text: 'Sumida City, Tokyo, Japan',
			},
			types: ['tourist_attraction', 'point_of_interest'],
		},
		{
			description: 'Tokyo Disneyland, 1-1 Maihama, Urayasu, Chiba 279-0031, Japan',
			place_id: 'ChIJwUKeI66PGGARl3iF3zctzEw',
			structured_formatting: {
				main_text: 'Tokyo Disneyland',
				secondary_text: 'Urayasu, Chiba, Japan',
			},
			types: ['amusement_park', 'point_of_interest'],
		},
		{
			description: 'Tokyo Station, 1 Chome Marunouchi, Chiyoda City, Tokyo 100-0005, Japan',
			place_id: 'ChIJUWW0tg_PGGARfDaT5ka8Z40',
			structured_formatting: {
				main_text: 'Tokyo Station',
				secondary_text: 'Chiyoda City, Tokyo, Japan',
			},
			types: ['train_station', 'transit_station'],
		},
	],
	status: 'OK',
}

const options = _.map(placeApiResponse.predictions, (p) => ({ label: p.description, value: p.place_id }))

const TodoItem = ({ onClick, todo, trip, reordering }: { reordering?: boolean; onClick: any; todo: TodoItemSchema; trip: TripSchema; isEditing: boolean }) => {
	// const [todo, setTodo] = useState(dbTodo)
	// const checked = Math.floor(Math.random() * 10) % 2 === 0
	const { tripId } = useParams<any>()
	const pathname = usePathname()
	const router = useRouter()
	const [saveTodoItem] = useMyMutation<inferRouterInputs<AppRouter>['todoItem']['mutate']>(trpc.todoItem.mutate.mutationOptions())
	const [parent] = useAutoAnimate()
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo._id })

	const onChange = (obj: Partial<TodoItemSchema>) => {
		const queryKey = trpc.trip.query.queryKey({ id: tripId })
		const localTrip = _.cloneDeep(queryClient.getQueryData(queryKey))
		const todoListIndex = _.findIndex(localTrip?.data[0].todoLists, { _id: todo.todoListId })
		const todoIndex = _.findIndex(localTrip?.data[0].todoLists[todoListIndex].todoItems, { _id: todo._id })
		localTrip!.data[0].todoLists[todoListIndex].todoItems[todoIndex] = { ...todo, ...obj } as TodoItemSchema
		queryClient.setQueryData(queryKey, localTrip)
		return saveTodoItem({ id: todo._id, values: { done: obj.done } })
	}

	const started = trip.status === ETripStatus.started

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div {...attributes} ref={setNodeRef} style={style}>
			<Button
				onClick={reordering ? undefined : () => router.push(pathname + '/todo/' + todo._id)}
				className={twMerge('block', reordering ? 'select-none' : '', todo.done ? 'text-gray-500' : '')}
				asChild
				variant='outline'
				fullWidth
				key={todo._id}
				size='free'
				// as='div'
			>
				<div ref={parent} className='pb-2'>
					<div className='flex gap-2 items-start justify-between p-2 pb-0'>
						<div className={twMerge('truncate py-2 pl-2 select-none flex gap-2 items-start leading-5 font-semibold')}>
							{/* <MapPinned className='reordering-0' /> */}
							<p className={twMerge('truncate')}>{todo.name}</p>
							{todo.done && (
								<Badge variant='outline' className='no-underline'>
									Completed
								</Badge>
							)}
						</div>
						<div>
							{reordering ? (
								<div {...listeners}>
									<Button className='p-1' variant='ghost' size='icon-md'>
										<GripVertical />
									</Button>
								</div>
							) : started ? (
								<Button className='p-1' size='icon' variant='ghost' onClick={() => onChange({ done: !todo.done })}>
									{todo.done ? <CircleCheck /> : <Circle />}
								</Button>
							) : null}
						</div>
					</div>
					{!reordering && todo.description && (
						<div className='px-4'>
							<p className='truncate text-gray-500 leading-5'>{todo.description}</p>
						</div>
					)}
				</div>
			</Button>
		</div>
	)
}

export const TodoList = ({ todoList, trip, setTrip }: { trip: TripSchema; setTrip: any; todoList: TodoListSchema }) => {
	const [isEditing, setIsEditing] = useState(false)
	const [openCreateTodo, setOpenCreateTodo] = useState(false)
	const [openTodo, setOpenTodo] = useState<TodoItemSchema>()
	const [openTodoList, setOpenTodoList] = useState<TodoListSchema>()
	const [reordering, setReordering] = useState(false)
	const [saveTodoList] = useMyMutation<inferRouterInputs<AppRouter>['todoList']['mutate']>(trpc.todoList.mutate.mutationOptions())

	const tripEnded = trip.status === ETripStatus.ended

	const handleDragEnd = (e: DragEndEvent) => {
		const { active, over } = e
		// const obj: Partial<TodoItemSchema>;
		if (!over?.id) return
		const queryKey = trpc.trip.query.queryKey({ id: trip._id })
		const localTrip = _.cloneDeep(queryClient.getQueryData(queryKey))
		const localTripData = localTrip?.data[0]
		const todoListIndex = _.findIndex(localTripData?.todoLists, { _id: todoList._id })

		const todoItems = localTripData?.todoLists[todoListIndex].todoItems
		const sourceTodoIndex = _.findIndex(todoItems, { _id: active.id as string })
		const targetTodoIndex = _.findIndex(todoItems, { _id: over.id as string })

		// const sourceTodo = _.cloneDeep(todoItems?.[sourceTodoIndex])
		// const targetTodo = _.cloneDeep(todoItems?.[targetTodoIndex])

		if (!todoItems) return
		const [sourceTodo] = todoItems.splice(sourceTodoIndex, 1)
		if (!sourceTodo) return
		todoItems.splice(targetTodoIndex, 0, sourceTodo)
		todoItems[targetTodoIndex] = sourceTodo!
		const sortOrder = _.map(todoItems, (t) => t._id)

		localTripData.todoLists[todoListIndex].sortOrder = sortOrder

		setTrip(localTrip)
		// queryClient.setQueryData(queryKey, localTrip)
	}

	return (
		<div key={todoList._id} className='mb-8'>
			{openCreateTodo && <TodoItemDialog trip={trip} todoListId={todoList._id!} onClose={() => setOpenCreateTodo(false)} />}
			{openTodo && <TodoItemDialog todo={openTodo} trip={trip} todoListId={todoList._id!} onClose={() => setOpenTodo(undefined)} />}
			{openTodoList && <TodoListDialog trip={trip} todoList={todoList} onClose={() => setOpenTodoList(undefined)} />}
			<div className={twMerge('flex justify-between items-center', todoList.todoItems.length ? 'mb-2' : '')}>
				<div className='flex items-center gap-2'>
					<h2 className='font-medium '>{todoList.name}</h2>
					<Badge variant='default'>{todoList.todoItems.length}</Badge>
				</div>
				{!tripEnded && !!todoList.todoItems.length && (
					<div className='flex items-center'>
						<Button
							onClick={() => {
								setReordering((p) => !p)
								if (reordering) return saveTodoList({ id: todoList._id, values: { sortOrder: todoList.sortOrder } })
							}}
							variant='link-btn'
							className='-mt-1'
						>
							{reordering ? 'Save' : 'Reorder'}
						</Button>
						<Button variant='ghost' size='icon' onClick={() => setOpenTodoList(todoList)} className='text-black p-2'>
							<SquarePen />
						</Button>
					</div>
				)}
			</div>
			<DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
				<SortableContext items={_.map(todoList.todoItems, (t) => ({ ...t, id: t._id }))} strategy={verticalListSortingStrategy}>
					<List
						className='flex flex-col mb-1 gap-2'
						items={todoList.todoItems}
						renderItem={(todo: TodoItemSchema) => {
							return <TodoItem reordering={reordering} key={todo._id} todo={todo} trip={trip} isEditing={isEditing} onClick={() => setOpenTodo(todo)} />
						}}
					/>
				</SortableContext>
			</DndContext>
			{!tripEnded && (
				<Button
					onClick={() => {
						setOpenCreateTodo(true)
					}}
					variant='link-btn'
					className='flex gap-2'
				>
					{/* <PlusCircle /> */}
					Create an item
				</Button>
			)}
		</div>
	)
}
