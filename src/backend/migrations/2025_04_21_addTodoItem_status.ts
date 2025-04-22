import 'dotenv/config'
import mongoose from 'mongoose'
import { exit } from 'process'
import { ETodoItemStatus, TodoItemModel } from '../models/TodoItem'
import { connectMongoose } from '../mongoose'

const setup = async () => {
	const start = performance.now()

	await connectMongoose()

	const session = await mongoose.startSession()

	session.startTransaction()
	try {
		const records = await TodoItemModel.find({ _id: { $ne: null } }, {})

		for (const record of records) {
			// @ts-ignore
			await TodoItemModel.findByIdAndUpdate(record._id, { $unset: { done: true }, status: record.done ? ETodoItemStatus.done : ETodoItemStatus.pending })
		}
	} catch (e) {
		console.log('error: ', e)
	} finally {
		console.log(performance.now() - start)
		session.endSession()
		exit()
	}
}

setup()
