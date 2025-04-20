import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@me/components/ui/alert-dialog'
import { Button } from '@me/components/ui/button'
import { createContext, useContext, useRef, useState } from 'react'

type Args = { title?: string; description?: string }

interface IAlert {
	alertConfirm: (args?: Args) => Promise<boolean>
}

const alertCtx = createContext<IAlert | any>({})

export const useAlert = () => useContext<IAlert>(alertCtx)

export const AlertCtxProvider = ({ children }: any) => {
	const [state, setState] = useState<Args>()
	// const [title, setTitle] = useState('')
	const [{ promise, reject, resolve }, setPromise] = useState(Promise.withResolvers())
	const [open, setOpen] = useState(false)

	const alertConfirm = async (args: Args) => {
		setState(args)
		setOpen(true)
		const result = await promise
		console.log(result)
		setPromise(Promise.withResolvers())
		setOpen(false)
		return result
	}

	return (
		<alertCtx.Provider value={{ alertConfirm }}>
			{children}
			<AlertDialog open={open}>
				{/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{state?.title || 'Are you sure'}</AlertDialogTitle>
						<AlertDialogDescription>{state?.description || 'This action cannot be undone'}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<div className='flex gap-2'>
							<Button
								onClick={() => {
									resolve(false)
									console.log('clicked')
								}}
								variant='secondary'
								className='grow'
								// size='md'
							>
								Cancel
							</Button>
							<Button
								onClick={() => {
									resolve(true)
									console.log('clicked')
								}}
								className='grow'
								// size='md'
							>
								Continue
							</Button>
						</div>
						{/* <AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => resolve(true)}>Continue</AlertDialogAction> */}
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</alertCtx.Provider>
	)
}
