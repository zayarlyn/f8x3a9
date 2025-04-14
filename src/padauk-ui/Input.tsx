import { cva, VariantProps } from 'class-variance-authority'
import _ from 'lodash'
import { CircleX } from 'lucide-react'
import { ChangeEvent, useCallback } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconButton } from './Button'
import TextareaAutosize from 'react-textarea-autosize'

const inputVariants = cva('relative w-60', { variants: { fullWidth: { true: 'w-full' } } })

export interface InputProps extends VariantProps<typeof inputVariants> {
	value?: string
	onChange?: (v: string) => void
	onClick?: (e: any) => void
	placeholder?: string
	error?: string
	multiline?: boolean
}

const Input = (props: InputProps) => {
	const { value, error, onChange, onClick, placeholder, multiline = false } = props
	const className = inputVariants({ ..._.omit(props, 'error') })

	const handleOnChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value
			if (onChange) onChange(newValue)
		},
		[onChange]
	)

	const inputClassName = 'text-black peer pt-4 pb-1.5 pl-4 pr-10  outline-1 outline-gray-300 rounded-md focus:outline-[1.5px] focus:outline-gray-800 w-full block'

	return (
		<div>
			<div className={className} onClick={onClick}>
				{multiline ? (
					<TextareaAutosize
						placeholder=''
						minRows={3}
						className={twMerge('resize-none', inputClassName, placeholder ? '' : 'pt-3 pb-3', error ? 'outline-red-400 focus:outline-red-400' : '')}
						value={value}
						onChange={handleOnChange as any}
					/>
				) : (
					<input
						value={value}
						onChange={handleOnChange}
						placeholder=''
						className={twMerge(inputClassName, placeholder ? '' : 'pt-3 pb-4', error ? 'outline-red-400 focus:outline-red-400' : '')}
					/>
				)}

				{placeholder && (
					<span className='duration-200 peer-focus:text-[12px] peer-focus:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:top-5.5 left-4 absolute top-2.5 -translate-y-1/2 text-[12px] text-gray-400 select-none pointer-events-none'>
						{placeholder}
					</span>
				)}
				{value && (
					<IconButton onClick={() => onChange?.('')} className='absolute right-0 top-0.5 bg-white'>
						<CircleX className='text-gray-500' />
					</IconButton>
				)}
			</div>
			{error && <span className='block text-sm leading-4 text-red-400 pl-3 mt-1'>*{error}</span>}
		</div>
	)
}

export default Input
