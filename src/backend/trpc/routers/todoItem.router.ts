import { ValidationError } from 'class-validator'
import _ from 'lodash'
import { z } from 'zod'
import { t } from '../setup'
import { TodoItemModel, TodoItemSchema } from '../../models/TodoItem'
import { TodoListModel } from '@me/backend/models/TodoList'

export const todoItemRouter = t.router({
	query: t.procedure
		.input(z.object({ id: z.string().optional() }))
		.output(z.object({ data: z.custom<TodoItemSchema[]>() }))
		.query(async ({ input, ctx }) => {
			const { id } = input
			// const start = performance.now()
			const todoItems = await TodoItemModel.find({ ..._.pickBy({ _id: id }), deletedAt: null, userId: ctx.userId }, {})

			// const end = performance.now() - start
			// console.log(end)
			return new Promise((resolve) => setTimeout(() => resolve({ data: todoItems }), 200))
			// return { data: todoItems }
		}),

	mutate: t.procedure
		.input(z.object({ id: z.string().optional(), deletedAt: z.boolean().optional(), values: z.custom<Partial<TodoItemSchema>>().optional() }))
		.output(z.object({ data: z.custom<TodoItemSchema>(), errors: z.any().optional() }))
		.mutation(async ({ input, ctx }) => {
			const { id, deletedAt, values } = input
			const todoItem = await (id ? TodoItemModel.findOne({ _id: id, userId: ctx.userId }) : new TodoItemModel())
			if (!todoItem) throw 'not found'

			if (values) todoItem.set(values)
			todoItem.userId = ctx.userId
			todoItem.deletedAt = deletedAt ? new Date().toISOString() : undefined

			const todoList = await TodoListModel.findOne({ _id: todoItem.todoListId, userId: ctx.userId })
			if (!todoList) throw 'not found'

			if (todoItem.deletedAt) {
				todoList.sortOrder = _.without(todoList.sortOrder, todoItem._id)
			}
			if (!id) {
				todoList.sortOrder = [...todoList.sortOrder, todoItem._id]
			}

			todoList.save()
			todoItem.save()

			// return new Promise((resolve) => setTimeout(() => resolve({ data: todoItem }), 0))
			return { data: todoItem }
		}),
})
