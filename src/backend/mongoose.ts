import { env } from '@me/env'
import { getModelForClass } from '@typegoose/typegoose'
import mongoose, { Mongoose } from 'mongoose'
// import { env, isDev } from './env'

const isDev = () => process.env.NODE_ENV === 'development'

export function getOrRegisterModel(name: string, schema: any) {
	if (isDev() && mongoose.models[name]) {
		console.log('model re-registered')
		mongoose.deleteModel(name)
	}
	return (
		mongoose.models[name] ??
		getModelForClass(schema, {
			options: { customName: name },
			schemaOptions: { collection: name, timestamps: true, virtuals: true, toObject: { virtuals: true }, toJSON: { virtuals: true } },
		})
	)
}

declare global {
	var mongooseWriteConn: Mongoose
}

export const connectMongoose = async () => {
	if (!global.mongooseWriteConn) {
		global.mongooseWriteConn = await mongoose.connect(env().server.mongooseUri, { dbName: 'sisu', maxPoolSize: 200, maxIdleTimeMS: 100000 })
	}
	return global.mongooseWriteConn
}
