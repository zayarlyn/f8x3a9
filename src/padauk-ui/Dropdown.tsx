import { twMerge } from 'tailwind-merge'
import Popper from './Popper'
import { cloneElement, MouseEvent, useState } from 'react'

interface IProps {
	value?: string
	onChange?: (v: string) => void
	onClick?: (e: any) => void
	placeholder?: string
	anchorElement: any
	options: { value: string; label: string }[]
}

type TClickEvent = MouseEvent<HTMLDivElement, MouseEvent>

const Dropdown = (props: IProps) => {
	const { anchorElement, value, onChange, options } = props
	const [anchor, setAnchor] = useState<TClickEvent['currentTarget'] | null>(null)

	// const handleOnChange = useCallback(
	// 	(e: ChangeEvent<HTMLInputElement>) => {
	// 		const newValue = e.target.value
	// 		if (onChange) onChange(newValue)
	// 	},
	// 	[onChange]
	// )

	return (
		<Popper {...{ anchor: anchor!, setAnchor }} anchorElement={cloneElement(anchorElement)}>
			{options.map((place, index) => (
				<div
					onClick={() => {
						onChange?.(place.value)
						setAnchor(null)
					}}
					key={place.value}
					className={twMerge('p-3 hover:bg-gray-200 active:scale-95 cursor-pointer border-t-gray-300', index > 0 ? 'border-t' : '')}
				>
					{place.label}
				</div>
			))}
		</Popper>
	)
}

export default Dropdown
