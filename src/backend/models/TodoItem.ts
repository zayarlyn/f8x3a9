import { prop, ReturnModelType } from '@typegoose/typegoose'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { BaseSchema } from './BaseModel'
import { getOrRegisterModel } from '../mongoose'
import { Types } from 'mongoose'

export const TODO_ITEM_COLLECTION = 'todoItem'

export enum ETodoItemStatus {
	pending = 'pending',
	done = 'done',
	dropped = 'dropped',
}

export class TodoItemSchema extends BaseSchema {
	@IsString()
	@prop({ type: String, required: true })
	name: string

	@IsString()
	@IsOptional()
	@prop({ type: String, default: '' })
	description: string

	// deprecated
	// @IsBoolean()
	// @prop({ type: Boolean, default: false })
	// done: boolean

	@IsEnum(ETodoItemStatus)
	@prop({ type: String, enum: ETodoItemStatus, default: ETodoItemStatus.pending })
	status: ETodoItemStatus

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
