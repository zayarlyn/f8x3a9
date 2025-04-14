import { prop } from '@typegoose/typegoose'
import { IsOptional } from 'class-validator'
import { Types } from 'mongoose'

export class BaseSchema {
	@prop({ type: Types.ObjectId, auto: true })
	_id?: string

	@prop({ type: Date })
	createdAt!: string

	@prop({ type: Date })
	updatedAt!: string

	@IsOptional()
	@prop({ type: Date, default: null })
	deletedAt?: string
}
