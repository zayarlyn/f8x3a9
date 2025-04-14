import { createPortal } from 'react-dom'
import { Button, IconButton } from './Button'
import { Cross, X } from 'lucide-react'

interface IDialogHeaderProps {
	children: any
	onClose: () => void
}
const DialogHeader = ({ children, onClose }: IDialogHeaderProps) => {
	return (
		<>
			<div className='p-4 py-3 flex items-center justify-between'>
				<span className='font-semibold'>{children}</span>
				<IconButton onClick={onClose} icon={X} className='p-1' variant='transparent' />
			</div>
			<div className='border-b-gray-300 border-b' />
		</>
	)
}

interface IDialogBodyProps {
	children: any
}
export const DialogBody = ({ children }: IDialogBodyProps) => {
	return <div className='p-4'>{children}</div>
}

interface IDialogFooterProps {
	children: any
}
export const DialogFooter = ({ children }: IDialogFooterProps) => {
	return (
		<>
			<div className='border-b-gray-300 border-b' />
			<div className='p-4'>{children}</div>
		</>
	)
}
interface IDialogProps {
	children: any
	onClose?: any
}
const Dialog = ({ children, onClose }: IDialogProps) => {
	return createPortal(
		<div className='fixed top-0 w-full h-full grid place-items-center'>
			<div className='bg-black w-full h-full absolute opacity-50' onClick={onClose} />
			<div className='bg-white w-10/12 max-w-sm border border-gray-300 rounded-md z-10'>{children}</div>
		</div>,
		document.getElementById('my-overlays')!
	)
}

Dialog.Header = DialogHeader
Dialog.Body = DialogBody
Dialog.Footer = DialogFooter

export default Dialog
