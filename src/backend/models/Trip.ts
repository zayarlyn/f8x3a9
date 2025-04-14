import { prop, ReturnModelType } from '@typegoose/typegoose'
import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Types } from 'mongoose'
import { getOrRegisterModel } from '../mongoose'
import { BaseSchema } from './BaseModel'
import { TODO_LIST_COLLECTION, TodoListSchema } from './TodoList'

export const TRIP_SCHEMA_NAME = 'trip'

class LocationSchema {
	@IsString()
	@prop({ type: String })
	name: string

	@IsString()
	@prop({ type: String })
	locationId!: string
}

// FIXME: SubDoc type hint doesn't work in create method
export class TripSchema extends BaseSchema {
	@IsString()
	@prop({ type: String })
	name!: string

	@IsString()
	@IsOptional()
	@prop({ type: String })
	description: string

	@IsDate()
	@prop({ type: Date })
	startDate: string

	@IsDate()
	@prop({ type: Date })
	endDate: string

	// @IsBoolean()
	// @prop({ type: Boolean, default: true })
	// draft: boolean

	@ValidateNested()
	@Type(() => LocationSchema)
	@prop({ type: () => LocationSchema })
	location!: LocationSchema

	@IsString()
	@prop({ type: Types.ObjectId })
	userId!: string

	// @ValidateNested({ each: true })
	// @Type(() => TodoListSchema)
	// @prop({ type: () => TodoListSchema, default: [] })
	// todoLists: TodoListSchema[]

	@prop({ ref: TODO_LIST_COLLECTION, foreignField: 'tripId', localField: '_id' })
	todoLists: TodoListSchema[]
}

export const TripModel = getOrRegisterModel(TRIP_SCHEMA_NAME, TripSchema) as ReturnModelType<typeof TripSchema>
