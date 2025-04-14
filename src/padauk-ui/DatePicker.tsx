import ReactDatePicker from 'react-datepicker'

import { cva, VariantProps } from 'class-variance-authority'
import 'react-datepicker/dist/react-datepicker.css'
import { useTripStore } from '../trip'
import Input, { InputProps } from './Input'

const inputVariants = cva('relative w-60', { variants: { fullWidth: { true: 'w-full' } } })

interface IProps extends VariantProps<typeof inputVariants>, InputProps {
	placeholder?: string
	startDate?: Date
	endDate?: Date
	onChange: (v: any) => void
}

const DatePicker = (props: IProps) => {
	const { fullWidth, startDate, endDate, onChange, error } = props
	const className = inputVariants(props)
	const trip = useTripStore()

	return (
		<div className={className}>
			<ReactDatePicker
				placeholderText='Start Date - End Date'
				customInput={<Input {...{ fullWidth, error }} />}
				// selected={new Date()}
				// showYearDropdown
				// selectsRange
				startDate={startDate}
				endDate={endDate}
				selected={trip.startDate}
				onChange={onChange}
				dateFormat={'yyyy-MM-dd'}
				selectsRange
				withPortal
			/>
		</div>
	)
}

export default DatePicker
