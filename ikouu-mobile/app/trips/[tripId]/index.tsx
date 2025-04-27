import { Box } from '@me/components/ui/box'
import { Button, ButtonText } from '@me/components/ui/button'
import { Progress, ProgressFilledTrack } from '@me/components/ui/progress'
import { Text } from '@me/components/ui/text'
import { Stack } from 'expo-router'
import _ from 'lodash'
import React from 'react'
import { FlatList, Image, ScrollView } from 'react-native'

const todos = _.map(_.range(0, 5), (i) => ({ id: i, name: 'Bagan', status: i % 2 ? 'pending' : 'started' }))

export default function index() {
	return (
		<ScrollView>
			<Stack screenOptions={{ title: 'Trip' }} />
			<Image source={{ uri: 'https://random-image-pepebigotes.vercel.app/api/random-image' }} style={{ height: 100 }} />
			<Box className='mx-6'>
				<Box className='rounded-md p-4 border border-gray-300 -mt-8 bg-white'>
					<Text className='font-medium text-center' size='xl'>
						Trip Name
					</Text>
					<Text className='text-center mt-1' size='lg'>
						2025-Apr-01 (Tue) -2025-Apr-30 (Wed)
					</Text>
					<Box className='flex-row justify-between mt-2'>
						<Text className='' size='lg'>
							Progress
						</Text>
						<Text className='' size='lg'>
							40%
						</Text>
					</Box>
					<Progress value={40} size='sm' orientation='horizontal'>
						<ProgressFilledTrack />
					</Progress>
				</Box>

				<Box className='my-4'>
					<Button size='xl'>
						<ButtonText className='font-normal'>Start the trip</ButtonText>
					</Button>
				</Box>

				<FlatList
					data={todos}
					keyExtractor={(item) => '' + item.id}
					ListHeaderComponent={
						<Box className='py-4 flex-row justify-between'>
							<Text size='lg' className='font-medium'>
								Places
							</Text>
							<Button variant='link' size='free'>
								<ButtonText className='tracking-wide underline text-blue-500' size='lg'>
									Reorder
								</ButtonText>
							</Button>
						</Box>
					}
					renderItem={({ item }) => (
						<Box className='border border-gray-300 rounded-md p-2'>
							<Text size='lg' className='font-medium' numberOfLines={1}>
								{item.name}
							</Text>
							<Text size='lg' className='text-gray-500' numberOfLines={1}>
								{"<Box className='border border-gray-300 mb-2 rounded-md p-2'>"}
							</Text>
						</Box>
					)}
					ItemSeparatorComponent={() => (
						<Box className='flex-row items-center my-1'>
							<Box className='h-10 w-1 bg-black' />
							<Text className='ml-4'>Yellow Line (MRT)</Text>
						</Box>
					)}
					scrollEnabled={false}
				/>
			</Box>
			<Stack.Screen options={{ title: 'Trip', headerBackTitle: 'Trips' }} />
		</ScrollView>
	)
}
