'use client'

import { addDays, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@me/lib/utils'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { useRef, useState } from 'react'

interface IDateRangePicker {
	value: DateRange
	onChange: (args: { from?: Date; to?: Date }) => void
	className?: string
}

export function DateRangePicker({ className, value: date, onChange }: IDateRangePicker) {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLButtonElement>(null)

	const onClose = () => setOpen(false)

	return (
		<div className={cn('grid gap-2', className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						// id="date"
						variant={'outline'}
						className={cn('justify-start text-left font-normal', !date && 'text-muted-foreground')}
						fullWidth
						ref={ref}
					>
						<CalendarIcon />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
								</>
							) : (
								format(date.from, 'LLL dd, y')
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent style={{ width: ref.current?.clientWidth }} className='p-0' align='start'>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={new Date()}
						selected={date}
						onSelect={(v) => onChange(v as any)}
						numberOfMonths={1}
						classNames={{ cell: 'w-full aspect-square', day: 'w-full h-full' }}
					/>
					<div className='p-3 pt-0 -mt-1'>
						<Button onClick={onClose} fullWidth className=''>
							Done
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
