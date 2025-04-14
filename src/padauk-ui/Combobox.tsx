import _ from 'lodash'
import { MouseEvent, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Input, { InputProps } from './Input'
import Popper from './Popper'

interface IProps extends InputProps {
	value?: string
	onChange: (v: string) => void
	onClick?: (e: any) => void
	placeholder?: string
	options: { value: string; label: string }[]
}

type TClickEvent = MouseEvent<HTMLDivElement, MouseEvent>

const Combobox = (props: IProps) => {
	const { value, onChange, options, placeholder, error } = props
	const [input, setInput] = useState('')
	const [anchor, setAnchor] = useState<TClickEvent['currentTarget'] | null>(null)

	const handleInputChange = (v: string) => {
		setInput(v)
		if (!v) onChange(v)
	}

	const filteredOptions = _.filter(options, (option) => {
		return option.label.toLowerCase().includes(input.toLowerCase())
	})

	const inputFromOptions = _.find(options, { value })?.label

	return (
		<Popper
			{...{ anchor: anchor!, setAnchor }}
			anchorElement={<Input error={error} placeholder={placeholder} value={inputFromOptions || input} onChange={handleInputChange} fullWidth />}
		>
			{filteredOptions.length ? (
				filteredOptions.map((place, index) => (
					<div
						onClick={() => {
							onChange(place.value)
							setInput(place.label)
							setAnchor(null)
						}}
						key={place.value}
						className={twMerge('p-3 hover:bg-gray-200 active:scale-95 cursor-pointer border-t-gray-300', index > 0 ? 'border-t' : '')}
					>
						{place.label}
					</div>
				))
			) : (
				<div className='p-3'>No result found.</div>
			)}
		</Popper>
	)
}

export default Combobox
