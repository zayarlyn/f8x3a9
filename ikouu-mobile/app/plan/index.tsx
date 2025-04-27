import { Box } from '@me/components/ui/box'
import { Button, ButtonText } from '@me/components/ui/button'
import { Input, InputField, InputSlot } from '@me/components/ui/input'
import { Text } from '@me/components/ui/text'
import { Stack } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Pressable } from '@me/components/ui/pressable'
import ActionSheet, { ActionSheetRef, SheetProvider } from 'react-native-actions-sheet'
import { format, toDate } from 'date-fns'
import _ from 'lodash'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: 'grey',
	},
	contentContainer: {
		flex: 1,
		padding: 36,
		alignItems: 'center',
		zIndex: 100,
	},
})

export default function index() {
	const actionSheetRef = useRef<ActionSheetRef>(null)

	useEffect(() => {
		actionSheetRef.current?.show()
	}, [])

	const [fromDate, setFromDate] = useState('')
	const [toDate, setToDate] = useState('')
	const [date, setDate] = useState(new Date())

	return (
		// <GestureHandlerRootView style={styles.container}>
		<SheetProvider>
			<View style={{ flex: 1 }}>
				<Stack.Screen options={{ title: 'Plan a trip' }} />
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<View className='m-8' style={{}}>
						<Text className='text-center font-medium' size='xl'>
							Where will you be going?
						</Text>
						<Input className='mt-4 rounded-md border-[1.5px]' variant='outline' isDisabled={false} isInvalid={false} isReadOnly={false}>
							<InputField placeholder='Trip name' />
						</Input>

						<Input className='mt-4 rounded-md border-[1.5px]' variant='outline' isDisabled={false} isInvalid={false} isReadOnly>
							<InputSlot className='justify-start text-left' style={{ flex: 1 }} onPress={() => actionSheetRef.current?.show()}>
								<InputField
									placeholder='From - To'
									value={_.filter([fromDate, toDate])
										.map((d) => format(d, 'MMM dd, yyyy'))
										.join(' - ')}
									className='w-full'
									pointerEvents='none'
								/>
							</InputSlot>
						</Input>

						<Button className='mt-4'>
							<ButtonText>Next</ButtonText>
						</Button>
					</View>
				</View>
			</View>
			<ActionSheet ref={actionSheetRef} containerStyle={{ padding: 16 }}>
				<Box className='items-center'>
					<Text className='mb-2 font-medium' size='xl'>
						Select Date
					</Text>
					<Box className='flex-row gap-4'>
						<Input isFocused={!fromDate && !toDate} className='flex-1 rounded-md border-[1.5px]' variant='outline' isReadOnly>
							<InputField value={fromDate && format(fromDate, 'yyyy-MM-dd')} placeholder='From' className='w-full' pointerEvents='none' />
						</Input>
						<Input isFocused={!!fromDate && !toDate} className='flex-1 rounded-md border-[1.5px]' variant='outline' isReadOnly>
							<InputField value={toDate && format(toDate, 'yyyy-MM-dd')} placeholder='To' className='w-full' pointerEvents='none' />
						</Input>
					</Box>
					<DateTimePicker
						display='spinner'
						mode='date'
						value={date}
						onChange={(v) => {
							console.log(v.nativeEvent.timestamp)
							setDate(new Date(v.nativeEvent.timestamp))
						}}
					/>
				</Box>
				<Button
					onPress={() => {
						console.log(date.toDateString())
						if (!fromDate && !toDate) {
							setFromDate(date.toISOString())
						}
						if (fromDate && !toDate) {
							setToDate(date.toDateString())
							actionSheetRef.current?.hide()
						}
					}}
				>
					<ButtonText>Ok</ButtonText>
				</Button>
			</ActionSheet>
		</SheetProvider>
	)
}
