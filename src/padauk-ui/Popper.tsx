import { cloneElement, MouseEvent, useCallback } from 'react'
import { twMerge } from 'tailwind-merge'

interface IProps {
	onClick?: (e: any) => void
	children: any
	anchorElement: any
	anchor: TClickEvent['currentTarget']
	setAnchor: any
}

type TClickEvent = MouseEvent<HTMLDivElement, MouseEvent>

const Popper = (props: IProps) => {
	const { children, anchorElement, anchor, setAnchor } = props

	const handleOnClick = useCallback(
		(e: TClickEvent) => {
			setAnchor(e.currentTarget!)
		},
		[setAnchor]
	)

	return (
		<>
			{cloneElement(anchorElement, { ...anchorElement.props, onClick: handleOnClick, className: twMerge(anchorElement.className, 'z-10') })}
			{anchor && (
				<>
					<div
						style={{ width: anchor.clientWidth, top: anchor.offsetTop + anchor.offsetHeight }}
						className='z-10 absolute bg-white w-full shadow-sm border border-gray-300 mt-0.5 '
					>
						{children}
					</div>
					<div onClick={() => setAnchor(null)} className='w-screen h-screen fixed top-0 left-0 z-0' />
				</>
			)}
		</>
	)
}

export default Popper
