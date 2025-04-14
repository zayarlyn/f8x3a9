import { prop, ReturnModelType } from '@typegoose/typegoose'
import { IsString } from 'class-validator'
import { getOrRegisterModel } from '../mongoose'
import { BaseSchema } from './BaseModel'

export const USER_SCHEMA_NAME = 'user'

// FIXME: SubDoc type hint doesn't work in create method
export class UserSchema extends BaseSchema {
	@IsString()
	@prop({ type: String })
	name!: string

	@IsString()
	@prop({ type: String })
	email: string

	@IsString()
	@prop({ type: String })
	authUserId!: string

	// @prop({ ref: TODO_LIST_COLLECTION, foreignField: 'tripId', localField: '_id' })
	// todoLists: TodoListSchema[]
}

export const UserModel = getOrRegisterModel(USER_SCHEMA_NAME, UserSchema) as ReturnModelType<typeof UserSchema>
