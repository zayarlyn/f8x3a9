import { ValidationError } from 'class-validator'
import _ from 'lodash'
import { z } from 'zod'
import { TodoItemModel } from '../../models/TodoItem'
import { TodoListModel } from '../../models/TodoList'
import { TripModel, TripSchema } from '../../models/Trip'
import { t } from '../setup'

const validation = () => {}

const formatErrors = (error: ValidationError): any => {
	if (!error.children?.length) return { [error.property]: Object.values(error.constraints!).join(', ') }

	return _.reduce(error.children, (result, next) => ({ ...result, [error.property]: formatErrors(next) }), {})
}

export const tripRouter = t.router({
	query: t.procedure
		.input(z.object({ id: z.string().optional() }))
		.output(z.object({ data: z.custom<TripSchema[]>() }))
		.query(async ({ input, ctx }) => {
			const { id } = input
			const start = performance.now()
			const trips = await TripModel.find(
				{ ..._.pickBy({ _id: id, userId: ctx.userId }), deletedAt: null },
				{},
				{ populate: { path: 'todoLists', match: { deletedAt: null, userId: ctx.userId }, populate: { path: 'todoItems', match: { deletedAt: null, userId: ctx.userId } } } }
			)

			const end = performance.now() - start
			console.log(end)
			// return new Promise((resolve) => setTimeout(() => resolve({ data: trips }), 0))
			return { data: trips }
		}),

	mutate: t.procedure
		.input(z.object({ id: z.string().optional(), values: z.custom<Partial<TripSchema>>() }))
		.output(z.object({ data: z.custom<TripSchema>(), errors: z.any().optional() }))
		.mutation(async ({ input, ctx }) => {
			const { id, values } = input
			const userId = ctx.userId
			const trip = await (id ? TripModel.findOne({ _id: id, userId }) : new TripModel())
			if (!trip) throw 'not found'

			trip.set(values)
			trip.userId = userId
			const todoList = new TodoListModel({ name: 'To Visit', tripId: trip._id, userId })
			const todoItem = new TodoItemModel({ name: 'Visit somewhere', todoListId: todoList.id, userId })

			await Promise.all([trip.save(), todoList.save(), todoItem.save()])

			// return new Promise((resolve) => setTimeout(() => resolve({ data: trip }), 1000))
			return { data: trip }
		}),
})
