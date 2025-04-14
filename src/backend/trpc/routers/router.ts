import { t } from '../setup'
import { todoItemRouter } from './todoItem.router'
import { todoListRouter } from './todoList.router'
import { tripRouter } from './trip.router'

export const appRouter = t.router({
	trip: tripRouter,
	todoList: todoListRouter,
	todoItem: todoItemRouter,
})

export type AppRouter = typeof appRouter
