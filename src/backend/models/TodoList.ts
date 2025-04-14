import { prop, ReturnModelType } from '@typegoose/typegoose'
import { IsString } from 'class-validator'
import { BaseSchema } from './BaseModel'
import { TODO_ITEM_COLLECTION, TodoItemSchema } from './TodoItem'
import { getOrRegisterModel } from '../mongoose'
import { Types } from 'mongoose'

export const TODO_LIST_COLLECTION = 'todoList'
export class TodoListSchema extends BaseSchema {
	@IsString()
	@prop({ type: String })
	name!: string

	@prop({ type: Types.ObjectId })
	tripId: string

	@IsString()
	@prop({ type: Types.ObjectId })
	userId!: string

	// @ValidateNested({ each: true })
	// @Type(() => TodoSchema)
	// @prop({ type: () => TodoSchema, default: [] })
	// items: TodoSchema[]

	@prop({ ref: TODO_ITEM_COLLECTION, foreignField: 'todoListId', localField: '_id' })
	todoItems: TodoItemSchema[]
}

export const TodoListModel = getOrRegisterModel(TODO_LIST_COLLECTION, TodoListSchema) as ReturnModelType<typeof TodoListSchema>
