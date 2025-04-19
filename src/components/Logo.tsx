import Image from 'next/image'
import React from 'react'
import { twMerge } from 'tailwind-merge'

const Logo = ({ className }: { className?: string }) => {
	return (
		<div className={twMerge('flex items-center select-none', className)}>
			<Image src='/logo.svg' width={25} height={40} alt='Ikouu logo' />
			<span className='font-bold text-xl text-[#3664CF] mt-0.5'>Ikouu</span>
		</div>
	)
}

export default Logo
