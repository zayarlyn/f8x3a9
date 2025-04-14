'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, XIcon } from 'lucide-react'

import { cn } from '@me/lib/utils'
import { IconButton } from '@me/padauk-ui'

function Dialog({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return (
		<DialogPrimitive.Root data-slot='dialog' {...props}>
			<DialogPortal data-slot='dialog-portal'>
				<DialogOverlay />
				<DialogBody>{children}</DialogBody>
			</DialogPortal>
		</DialogPrimitive.Root>
	)
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot='dialog-close' {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot='dialog-overlay'
			className={cn(
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
				className
			)}
			{...props}
		/>
	)
}

function DialogBody({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
	return (
		<DialogPrimitive.Content
			data-slot='dialog-content'
			className={cn(
				'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-md border shadow-lg duration-200 sm:max-w-lg',
				className
			)}
			{...props}
		>
			{children}
			{/* <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
					<XIcon />
					<span className='sr-only'>Close</span>
				</DialogPrimitive.Close> */}
		</DialogPrimitive.Content>
	)
}

// function DialogHeader({ className, children, ...props }: React.ComponentProps<'div'>) {
// 	return (
// 		<div data-slot='dialog-header' className={cn('border-b border-b-gray-300 p-4 py-3 flex gap-2 items-center justify-between text-center sm:text-left', className)} {...props}>
// 			<span className='font-semibold'>{children}</span>
// 			<DialogPrimitive.Close>
// 				<IconButton icon={X} className='p-1' variant='transparent' />
// 			</DialogPrimitive.Close>
// 		</div>
// 	)
// }

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot='dialog-footer' className={cn('border-b-gray-300 border-t p-4', className)} {...props} />
}

interface IDialogTitle extends React.ComponentProps<typeof DialogPrimitive.Title> {
	onClose: any
}
function DialogHeader({ className, children, onClose, ...props }: IDialogTitle) {
	return (
		<DialogPrimitive.Title data-slot='dialog-title' className={cn('border-b border-b-gray-300 p-4 py-3 flex items-center justify-between', className)} {...props}>
			<span className='font-semibold'>{children}</span>
			{/* <DialogPrimitive.Close> */}
			<IconButton onClick={onClose} icon={X} className='p-1' variant='transparent' />
			{/* </DialogPrimitive.Close> */}
		</DialogPrimitive.Title>
	)
}

function DialogContent({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return <DialogPrimitive.Description asChild data-slot='dialog-description' className={cn('p-4 text-muted-foreground', className)} {...props} />
}

Dialog.Header = DialogHeader
Dialog.Content = DialogContent
Dialog.Footer = DialogFooter
export { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTrigger }
