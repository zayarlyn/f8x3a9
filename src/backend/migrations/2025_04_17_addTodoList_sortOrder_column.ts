import mongoose from 'mongoose'
import { connectMongoose } from '../mongoose'
import { TodoListModel } from '../models/TodoList'
import 'dotenv/config'
import { exit } from 'process'
import _ from 'lodash'

const setup = async () => {
	const start = performance.now()

	await connectMongoose()

	const session = await mongoose.startSession()

	session.startTransaction()
	try {
		const records = await TodoListModel.find({ _id: { $ne: null } }, {}, { populate: { path: 'todoItems', match: { deletedAt: null } } })

		for (const record of records) {
			const sortOrder = _.map(record.todoItems, (t) => t._id.toString())
			await TodoListModel.findByIdAndUpdate(record._id, { sortOrder })
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
