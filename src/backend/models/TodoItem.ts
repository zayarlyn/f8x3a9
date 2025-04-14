import { prop, ReturnModelType } from '@typegoose/typegoose'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { BaseSchema } from './BaseModel'
import { getOrRegisterModel } from '../mongoose'
import { Types } from 'mongoose'

export const TODO_ITEM_COLLECTION = 'todoItem'

export class TodoItemSchema extends BaseSchema {
	@IsString()
	@prop({ type: String, required: true })
	name: string

	@IsString()
	@IsOptional()
	@prop({ type: String, default: '' })
	description: string

	@IsBoolean()
	@prop({ type: Boolean, default: false })
	done: boolean

	@IsString()
	@IsOptional()
	@prop({ type: String })
	locationId: string

	@IsString()
	@prop({ type: Types.ObjectId, required: true })
	todoListId: string

	@IsString()
	@prop({ type: Types.ObjectId })
	userId!: string
}

export const TodoItemModel = getOrRegisterModel(TODO_ITEM_COLLECTION, TodoItemSchema) as ReturnModelType<typeof TodoItemSchema>
