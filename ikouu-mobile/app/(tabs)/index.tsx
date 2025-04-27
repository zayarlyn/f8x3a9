import { gql, useQuery } from '@apollo/client'
import { Box } from '@me/components/ui/box'
import { Button, ButtonText } from '@me/components/ui/button'
import { Pressable } from '@me/components/ui/pressable'
import { Text } from '@me/components/ui/text'
import { DefaultTheme } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import _ from 'lodash'
import React from 'react'
import { SectionList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const tripListGql = gql`
	query {
		tripList {
			id
			name
			status

			todoLists {
				id
				name
			}
		}
	}
`

export default function TripsScreen() {
	const router = useRouter()
	const { data } = useQuery(tripListGql)
	const trips = _.get(data, 'tripList')
	console.log({ data })

	// const trips = _.map(_.range(0, 5), (i) => ({ id: i, name: 'Bagan', status: i % 2 ? 'pending' : 'started' }))
	const tripsByStatus = _.map(_.groupBy(trips, 'status'), (trips, status) => ({ title: status, data: trips }))

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Box className='p-4 pt-5'>
				<Text className='text-center' size='2xl'>
					You only live once
				</Text>
				<Button onPress={() => router.push('/plan')} size='xl' variant='link'>
					<ButtonText className='text-blue-500'>Plan a trip</ButtonText>
				</Button>
			</Box>
			<SectionList
				sections={tripsByStatus}
				style={{ flex: 1, paddingHorizontal: 16 }}
				renderSectionHeader={({ section }) => (
					<Box className='py-1' style={{ backgroundColor: DefaultTheme.colors.background }}>
						<Text className='font-medium' size='lg'>
							{section.title}
						</Text>
					</Box>
				)}
				renderSectionFooter={({ section }) => <Box className='h-4' />}
				renderItem={({ item: trip }) => (
					<Pressable
						style={({ pressed }) => [{ opacity: pressed ? 1 : 0.5 }]}
						onPress={() => {
							console.log('red')
							router.push('/trips/1')
						}}
						className='border border-gray-300 mb-2 rounded-md p-2'
					>
						<Text className='font-medium' size='lg'>
							{trip.name}
						</Text>
						<Box className='mt-1 flex-row justify-between'>
							<Text className='' size='lg'>
								{'2025-04-01 - 2025-05-03'}
							</Text>
							<Text className='font-medium' size='lg'>
								{'23 Todos'}
							</Text>
						</Box>
					</Pressable>
				)}
			/>
			{/* <View style={{ padding: 10 }}>
				<Text>trips</Text>
				<Button size='xl'>
					<ButtonText>NO Idea</ButtonText>
				</Button>
			</View> */}
		</SafeAreaView>
	)
}
