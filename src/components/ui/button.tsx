import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { MouseEvent, useState } from 'react'

import { cn } from '@me/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
	'text-black cursor-pointer active:scale-95 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none  shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
				destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
				outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
				secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
				ghost: 'hover:bg-secondary/80 hover:text-accent-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline',
				'link-btn': 'text-primary underline-offset-4 underline hover:bg-secondary/80 p-2!',
			},
			size: {
				md: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
				default: 'h-10 rounded-md px-6 py-5.5 has-[>svg]:px-4',
				free: 'h-auto',
				icon: "[&_svg:not([class*='size-'])]:size-6",
				'icon-md': "[&_svg:not([class*='size-'])]:size-7",
			},
			fullWidth: {
				true: 'w-full',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

interface IButtonProps extends VariantProps<typeof buttonVariants> {
	asChild?: boolean
	className?: string
	onClick?: (e: any) => any
	children: any
	ref?: any
	type?: any
	disabled?: boolean
}

function Button({ className, variant, size, asChild = false, onClick, fullWidth, children, ...props }: IButtonProps) {
	const [submitting, setIsSubmitting] = useState(false)
	const Comp = asChild ? Slot : 'button'

	const handleOnClick = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		e?.stopPropagation()

		if (onClick) {
			const result = onClick(e)
			if (result && result.then) {
				setIsSubmitting(true)
				result.finally(() => setIsSubmitting(false))
			}
		}
	}

	return (
		<Comp disabled={submitting} onClick={handleOnClick} data-slot='button' className={cn(buttonVariants({ variant, size, className, fullWidth }))} {...props}>
			{submitting ? <Loader2 className='animate-spin' /> : children}
		</Comp>
	)
}

export { Button, buttonVariants }
