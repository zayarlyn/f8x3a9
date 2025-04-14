import { TodoListModel, TodoListSchema } from '@me/backend/models/TodoList'
import { z } from 'zod'
import { t } from '../setup'

export const todoListRouter = t.router({
	mutate: t.procedure
		.input(z.object({ id: z.string().optional(), deletedAt: z.boolean().optional(), values: z.custom<Partial<TodoListSchema>>().optional() }))
		.output(z.object({ data: z.custom<TodoListSchema>(), errors: z.any().optional() }))
		.mutation(async ({ input, ctx }) => {
			const { id, deletedAt, values } = input
			const todoList = await (id ? TodoListModel.findOne({ _id: id, userId: ctx.userId }) : new TodoListModel())
			if (!todoList) throw 'not found'

			if (values) todoList.set(values)
			todoList.userId = ctx.userId
			todoList.deletedAt = deletedAt ? new Date().toISOString() : undefined
			todoList.save()

			// return new Promise((resolve) => setTimeout(() => resolve({ data: todoList }), 1000))
			return { data: todoList }
		}),
})
