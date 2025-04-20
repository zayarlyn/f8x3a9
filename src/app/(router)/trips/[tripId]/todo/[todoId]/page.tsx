import TodoDetailPage from '@me/components/app/TodoDetailPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Trip | Todo',
}

const page = () => {
	return <TodoDetailPage />
}

export default page
