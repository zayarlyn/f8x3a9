import { cva, VariantProps } from 'class-variance-authority'
import { MouseEvent, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const buttonVariants = cva('leading-4 flex justify-center items-center w-60 bg-blue-500 text-white rounded-md py-3.5 duration-200 cursor-pointer', {
	variants: {
		variant: {
			default: '',
			outline: 'bg-transparent text-black border-2 border-blue-500',
			text: 'p-0 w-fit bg-transparent hover:bg-gray-300 text-black text-left block',
			transparent: 'p-1 underline-offset-2 w-fit bg-transparent hover:bg-blue-100',
			link: 'p-2 w-fit bg-transparent hover:bg-blue-100 text-blue-500 underline underline-offset-2',
		},
		fullWidth: { true: 'w-full' },
	},
})

interface IProps extends VariantProps<typeof buttonVariants> {
	children: any
	className?: string
	onClick?: () => any
	color?: string
	disabled?: boolean
	as?: any
}

export const Button = (props: IProps) => {
	const { onClick, children, fullWidth, variant, className, disabled, as: As = 'button' } = props
	const [loading, setLoading] = useState(false)

	// const colorClassName = `bg-[${color}]`
	const handleOnClick = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		e.stopPropagation()

		if (onClick) {
			const result = onClick()
			if (result && result.then) {
				setLoading(true)
				result.finally(() => setLoading(false))
			}
		}
	}

	const variantClassName = twMerge(buttonVariants({ variant, fullWidth }), loading || disabled ? 'pointer-events-none bg-gray-400' : '')

	return (
		<As onClick={handleOnClick} className={twMerge(variantClassName, className)}>
			{loading ? <div className='w-6 h-6 rounded-full border-3 border-t-transparent animate-spin' /> : children}
		</As>
	)
}

const iconButtonVariants = cva('cursor-pointer p-2 hover:bg-gray-200 rounded-md active:scale-95', {
	variants: {
		variant: { default: 'bg-blue-500', light: 'bg-slate-100 hover:bg-slate-200', transparent: 'bg-transparent' },
		rounded: { true: 'rounded-full' },
		size: { small: 'p-1', default: '' },
		// fullWidth: { true: 'w-full' },
	},
})

interface IProps1 extends VariantProps<typeof iconButtonVariants> {
	children?: any
	className?: string
	onClick?: () => any
	icon?: any
}

export const IconButton = (props: IProps1) => {
	const { children, className, onClick, icon: Icon, variant = 'default', size = 'default', rounded } = props

	const variantClassName = twMerge(onClick ? 'active:scale-95 hover:bg-blue-400' : '', iconButtonVariants({ variant, size, rounded }))

	const handleOnClick = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		e.stopPropagation()
		if (onClick) onClick()
	}

	return (
		<button onClick={handleOnClick} className={twMerge(variantClassName, className)}>
			{Icon ? <Icon size={size === 'small' ? 20 : undefined} /> : children}
		</button>
	)
}
